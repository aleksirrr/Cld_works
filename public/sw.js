/* Minimal offline cache for the phone build. Game logic is untouched.
 * - hashed build assets (js/css/img/fonts/media folders): cache-first
 * - everything else same-origin: network-first, falling back to cache when offline
 * - audio/video (range requests) and cross-origin requests are never intercepted
 * Bump VERSION to drop all old caches. */
const VERSION = "ad-endgame-legendary-v1";
const HASHED = /\/(js|css|img|fonts|media)\//;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== VERSION) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || req.headers.has("range")) return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.destination === "audio" || req.destination === "video") return;
  if (url.pathname.endsWith("commit.json") || url.pathname.endsWith("version.txt")) return;

  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const store = (res) => { if (res && res.ok && res.status === 200) cache.put(req, res.clone()); return res; };
    if (HASHED.test(url.pathname)) {
      const hit = await cache.match(req);
      if (hit) return hit;
      return store(await fetch(req));
    }
    try {
      return store(await fetch(req));
    } catch (err) {
      const hit = await cache.match(req) || (req.mode === "navigate" ? await cache.match("./") : null);
      if (hit) return hit;
      throw err;
    }
  })());
});
