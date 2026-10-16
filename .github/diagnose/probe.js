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
let SourceMapConsumer = null; try { SourceMapConsumer = require("source-map").SourceMapConsumer; } catch (e) { /* optional */ }
async function symbolicate(logs) {
  if (!SourceMapConsumer) return ["(source-map not installed)"];
  const cache = new Map(), seen = new Set(), out = [];
  for (const l of logs) {
    const kind = l.split("\n")[0].slice(0, 110);
    if (seen.has(kind) || !/Error/.test(kind)) continue;
    const frames = [...l.matchAll(/js\/(app\.[0-9a-f]+\.js):(\d+):(\d+)/g)].slice(0, 4);
    if (!frames.length) continue; seen.add(kind);
    const mapped = [];
    for (const [, file, ln, col] of frames) {
      let c = cache.get(file);
      if (c === undefined) { const mp = path.join(dist, "js", file + ".map"); c = fs.existsSync(mp) ? await new SourceMapConsumer(JSON.parse(fs.readFileSync(mp, "utf8"))) : null; cache.set(file, c); }
      if (!c) continue;
      const o = c.originalPositionFor({ line: +ln, column: +col });
      if (o && o.source) { let sl = ""; try { sl = (c.sourceContentFor(o.source, true) || "").split("\n")[o.line - 1].trim().slice(0, 150); } catch (e) {}
        mapped.push(`${String(o.source).replace(/^webpack:\/\/[^/]*\//, "")}:${o.line} :: ${sl}`); }
    }
    out.push(`WHERE[${kind}]` + nl_ + "  " + mapped.join(nl_ + "  "));
  }
  return out;
}
const nl_ = "\n";
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
    // Visit every tab/subtab the fresh save lets us open, to surface render errors.
    const tour = await page.evaluate(async () => {
      const res = { visited: 0, thrown: [] };
      try {
        for (const tab of (window.Tabs ? window.Tabs.all : [])) {
          for (const sub of (tab.subtabs || [tab])) {
            try { if (sub.show) { sub.show(true); res.visited++; } } catch (e) { res.thrown.push(String(e).slice(0, 160)); }
            await new Promise((r) => setTimeout(r, 200));
          }
        }
      } catch (e) { res.thrown.push("tour: " + String(e).slice(0, 160)); }
      return res;
    }).catch((e) => ({ tourError: e.message }));
    logs.push("[tour] " + JSON.stringify(tour));
    await page.waitForTimeout(1500);
    const state = await page.evaluate(() => {
      const d = (id) => { const e = document.getElementById(id); return e ? (e.style.display || "(default)") : "(missing)"; };
      return { loadingDisplay: d("loading"), browserWarning: d("browser-warning"), playerDefined: typeof window.player !== "undefined",
        uiTextStart: ((document.getElementById("ui") || {}).innerText || "").replace(/\s+/g, " ").slice(0, 300),
        bodyTextStart: document.body.innerText.replace(/\s+/g, " ").slice(0, 300) };
    }).catch((e) => ({ evalError: e.message }));
    // Show the built code around the first stack frame of the first page error.
    const firstErr = logs.find((l) => l.startsWith("[pageerror]"));
    const fm = firstErr && firstErr.match(/(http:\/\/localhost:8080\/[^\s:)]+\.js):(\d+):(\d+)/);
    if (fm) {
      try {
        const body = fs.readFileSync(path.join(dist, fm[1].replace("http://localhost:8080/", "")), "utf8").split("\n");
        const line = body[Number(fm[2]) - 1] || ""; const c = Number(fm[3]);
        logs.push("[snippet] " + line.slice(Math.max(0, c - 400), c + 300).replace(/\s+/g, " "));
      } catch (e) { logs.push("[snippet failed] " + e.message); }
    }
    await page.screenshot({ path: `shot-${name}.png` }).catch(() => {});
    const where = await symbolicate(logs);
    const groups = new Map();
    for (const l of logs) { const k = l.split("\n").slice(0, 2).join(" | ").replace(/app\.[0-9a-f]+\.js:\d+:\d+|chunk-vendors\.[0-9a-f]+\.js:\d+:\d+/g, "BUNDLE").replace(/[?&]_p=\d+.*/, "").slice(0, 220); groups.set(k, (groups.get(k) || 0) + 1); }
    const grouped = [...groups].sort((a, b) => b[1] - a[1]).slice(0, 18).map(([k, n]) => `${n}x ${k}`);
    const text = `STATE ${JSON.stringify(state)}\nDISTINCT LOG KINDS (${groups.size}), total ${logs.length}:\n` + grouped.join("\n") + "\n" + where.join("\n");
    summary += `## ${name}\n\`\`\`\n${text}\n\`\`\`\n`;
    console.log(`::error title=probe ${process.env.PROBE_NAME || ""} ${name}::${esc(text.slice(0, 6000))}`);
    await ctx.close();
  }
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  await browser.close(); server.close();
})().catch((e) => { console.log(`::error title=probe crashed::${esc(e.stack || e)}`); process.exit(1); });
