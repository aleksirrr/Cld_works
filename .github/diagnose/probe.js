// Headless load test: serves ./dist, opens it in Chrome (desktop + phone viewport),
// records console errors / page errors / failed requests and what is on screen,
// and prints them as GitHub annotations so they can be read without downloading logs.
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright-core");
const dist = path.resolve("dist");
const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".png": "image/png",
  ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webm": "video/webm", ".mp3": "audio/mpeg", ".wav": "audio/wav",
  ".json": "application/json", ".ttf": "font/ttf", ".woff": "font/woff", ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json", ".map": "application/json" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
  const f = path.join(dist, p);
  if (!f.startsWith(dist) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end("nf"); }
  res.setHeader("content-type", types[path.extname(f)] || "application/octet-stream");
  fs.createReadStream(f).pipe(res);
});
const esc = (s) => String(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
(async () => {
  await new Promise((r) => server.listen(8080, r));
  const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"] });
  const profiles = [
    ["desktop", { viewport: { width: 1280, height: 800 } }],
    ["phone", { viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true,
      userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36" }],
  ];
  let summary = "";
  for (const [name, opts] of profiles) {
    const ctx = await browser.newContext(opts); const page = await ctx.newPage(); const logs = [];
    page.on("console", (m) => { if (["error", "warning"].includes(m.type())) logs.push(`[console.${m.type()}] ${m.text()}`.slice(0, 700)); });
    page.on("pageerror", (e) => logs.push(`[pageerror] ${e.stack || e.message}`.slice(0, 1800)));
    page.on("requestfailed", (r) => logs.push(`[requestfailed] ${r.url()} ${(r.failure() || {}).errorText}`.slice(0, 300)));
    page.on("response", (r) => { if (r.status() >= 400) logs.push(`[http ${r.status()}] ${r.url()}`); });
    await page.goto("http://localhost:8080/", { waitUntil: "load" }).catch((e) => logs.push("goto: " + e.message));
    await page.waitForTimeout(30000);
    const state = await page.evaluate(() => {
      const d = (id) => { const e = document.getElementById(id); return e ? (e.style.display || "(default)") : "(missing)"; };
      return { loadingDisplay: d("loading"), browserWarning: d("browser-warning"), playerDefined: typeof window.player !== "undefined",
        uiTextStart: ((document.getElementById("ui") || {}).innerText || "").replace(/\s+/g, " ").slice(0, 300),
        bodyTextStart: document.body.innerText.replace(/\s+/g, " ").slice(0, 300) };
    }).catch((e) => ({ evalError: e.message }));
    await page.screenshot({ path: `shot-${name}.png` }).catch(() => {});
    const text = `STATE ${JSON.stringify(state)}\nLOGS (${logs.length}):\n` + logs.slice(0, 20).join("\n");
    summary += `## ${name}\n\`\`\`\n${text}\n\`\`\`\n`;
    console.log(`::error title=probe ${name}::${esc(text.slice(0, 6000))}`);
    await ctx.close();
  }
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  await browser.close(); server.close();
})().catch((e) => { console.log(`::error title=probe crashed::${esc(e.stack || e)}`); process.exit(1); });
