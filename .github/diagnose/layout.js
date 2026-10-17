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
const TSA = "html,body{-webkit-text-size-adjust:none!important;text-size-adjust:none!important}";
const variants = [
  ["none", null, "p", ""], ["none-tsa", null, "p", TSA],
  ["none", null, "l", ""], ["none-tsa", null, "l", TSA],
  ["devwidth", "width=device-width, initial-scale=1", "l", ""], ["devwidth-tsa", "width=device-width, initial-scale=1", "l", TSA],
  ["w800-tsa", "width=800", "p", TSA], ["w1000-tsa", "width=1000", "l", TSA],
];
(async () => {
  await new Promise((r) => server.listen(8080, r));
  const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });
  const ua = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
  fs.mkdirSync("shots", { recursive: true });
  for (const [name, meta, orient, css] of variants) {
    const vp = orient === "p" ? { width: 412, height: 915 } : { width: 915, height: 412 };
    const ctx = await browser.newContext({ viewport: vp, isMobile: true, hasTouch: true, deviceScaleFactor: 1, userAgent: ua });
    await ctx.route("**/", async (route) => {
      const resp = await route.fetch(); let body = await resp.text();
      body = body.replace(/<meta[^>]*name=["']viewport["'][^>]*>/i, "");
      if (meta) body = body.replace("<head>", `<head><meta name="viewport" content="${meta}">`);
      if (css) body = body.replace("</head>", `<style>${css}</style></head>`);
      await route.fulfill({ response: resp, body });
    });
    const page = await ctx.newPage();
    await page.goto("http://localhost:8080/", { waitUntil: "load" }).catch(() => {});
    await page.waitForTimeout(7000);
    await page.evaluate(() => { if (window.dev && dev.skipIntro) dev.skipIntro(); else { player.hasSeenIntro = true; player.introFrozen = true; } }).catch(() => {});
    await page.waitForTimeout(4000);
    const m = await page.evaluate(() => ({ iw: innerWidth, sw: document.documentElement.scrollWidth, bw: document.body.scrollWidth,
      scale: window.visualViewport ? +window.visualViewport.scale.toFixed(2) : null,
      over: [...document.querySelectorAll("#ui *")].filter((e) => e.getBoundingClientRect().right > innerWidth + 2).length,
      textOver: [...document.querySelectorAll("#ui *")].filter((e) => e.children.length === 0 && e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === "visible").length,
      fs: getComputedStyle(document.body).fontSize })).catch(() => ({}));
    const buf = await page.screenshot({ type: "jpeg", quality: 55 });
    fs.writeFileSync(path.join("shots", `${name}-${orient}.jpg`), buf);
    const title = `layout ${name} ${orient} iw=${m.iw} scale=${m.scale} overflowEls=${m.over} textOver=${m.textOver} bodyFont=${m.fs}`;
    console.log(`::notice title=${title}::saved ${name}-${orient}.jpg (${buf.length} bytes)`);
    await ctx.close();
  }
  await browser.close(); server.close();
})().catch((e) => { console.log(`::error title=layout crashed::${String(e.stack || e).replace(/\n/g, "%0A")}`); process.exit(1); });
