// Screenshots the running game on a phone-sized screen with different <meta viewport> settings.
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright-core");
const dist = path.resolve("dist");
const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".webm": "video/webm", ".mp3": "audio/mpeg", ".wav": "audio/wav", ".json": "application/json", ".ttf": "font/ttf",
  ".woff": "font/woff", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
  const f = path.join(dist, p);
  if (!f.startsWith(dist) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end("nf"); }
  res.setHeader("content-type", types[path.extname(f)] || "application/octet-stream"); fs.createReadStream(f).pipe(res);
});
const variants = [
  ["none", null, "p"], ["devwidth", "width=device-width, initial-scale=1", "p"], ["w600", "width=600", "p"], ["w800", "width=800", "p"],
  ["w1000", "width=1000", "p"], ["devwidth", "width=device-width, initial-scale=1", "l"], ["w800", "width=800", "l"], ["w1000", "width=1000", "l"],
];
(async () => {
  await new Promise((r) => server.listen(8080, r));
  const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });
  const ua = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
  for (const [name, meta, orient] of variants) {
    const vp = orient === "p" ? { width: 412, height: 915 } : { width: 915, height: 412 };
    const ctx = await browser.newContext({ viewport: vp, isMobile: true, hasTouch: true, deviceScaleFactor: 2, userAgent: ua });
    await ctx.route("**/", async (route) => {
      const resp = await route.fetch(); let body = await resp.text();
      body = body.replace(/<meta[^>]*name=["']viewport["'][^>]*>/i, "");
      if (meta) body = body.replace("<head>", `<head><meta name="viewport" content="${meta}">`);
      await route.fulfill({ response: resp, body });
    });
    const page = await ctx.newPage();
    await page.goto("http://localhost:8080/", { waitUntil: "load" }).catch(() => {});
    await page.waitForTimeout(7000);
    await page.evaluate(() => { if (window.dev && dev.skipIntro) dev.skipIntro(); else { player.hasSeenIntro = true; player.introFrozen = true; } }).catch(() => {});
    await page.waitForTimeout(4000);
    const m = await page.evaluate(() => ({ iw: innerWidth, sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth,
      scale: window.visualViewport ? +window.visualViewport.scale.toFixed(2) : null,
      over: [...document.querySelectorAll("#ui *")].filter((e) => e.getBoundingClientRect().right > innerWidth + 2).length })).catch(() => ({}));
    const buf = await page.screenshot({ type: "jpeg", quality: 38 });
    const title = `layout ${name} ${orient} iw=${m.iw} scrollW=${m.sw} scale=${m.scale} overflowEls=${m.over}`;
    if (buf.length < 52000) console.log(`::notice title=${title}::${buf.toString("base64")}`); else console.log(`::warning title=${title}::shot too big ${buf.length}`);
    await ctx.close();
  }
  await browser.close(); server.close();
})().catch((e) => { console.log(`::error title=layout crashed::${String(e.stack || e).replace(/\n/g, "%0A")}`); process.exit(1); });
