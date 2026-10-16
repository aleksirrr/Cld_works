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
    await page.waitForTimeout(12000);
    // ---- INTRO SCREEN: what is on screen, what is white, does "Start New Game" work? ----
    const shot = async (label) => {
      try {
        const buf = await page.screenshot({ type: "jpeg", quality: 28 });
        if (buf.length < 48000) console.log(`::notice title=shot ${process.env.PROBE_NAME || ""} ${name} ${label}::${buf.toString("base64")}`);
        else logs.push(`[shot ${label}] too big (${buf.length})`);
      } catch (e) { logs.push("[shot failed] " + e.message); }
    };
    const introInfo = await page.evaluate(() => {
      const out = {};
      const btn = [...document.querySelectorAll("button, .o-primary-btn")].find((b) => /Start New Game/i.test(b.textContent));
      out.hasStartBtn = !!btn; const chain = []; let e = btn;
      while (e && chain.length < 9) { const cs = getComputedStyle(e);
        chain.push(`${e.tagName.toLowerCase()}#${e.id}.${String(e.className || "").slice(0, 45)} bg=${cs.backgroundColor} pos=${cs.position} z=${cs.zIndex} op=${cs.opacity}`); e = e.parentElement; }
      out.chain = chain;
      out.body = `body bg=${getComputedStyle(document.body).backgroundColor} html bg=${getComputedStyle(document.documentElement).backgroundColor}`;
      out.top = document.elementsFromPoint(innerWidth / 2, innerHeight / 2).slice(0, 7).map((x) =>
        `${x.tagName.toLowerCase()}#${x.id}.${String(x.className || "").slice(0, 40)} bg=${getComputedStyle(x).backgroundColor} op=${getComputedStyle(x).opacity}`);
      out.player = window.player ? { hasSeenIntro: player.hasSeenIntro, introTick: player.introTick, introFrozen: player.introFrozen, theme: (player.options || {}).theme } : null;
      out.hasDev = typeof window.dev !== "undefined";
      return out;
    }).catch((e) => ({ introError: e.message }));
    logs.push("[intro] " + JSON.stringify(introInfo));
    await shot("intro");
    let clickInfo = "no start button";
    try {
      const b = page.getByText("Start New Game", { exact: true }).first();
      if (await b.count()) { await b.click({ timeout: 5000 }); await page.waitForTimeout(3000);
        clickInfo = await page.evaluate(() => ({
          modalText: ((document.querySelector(".l-modal-overlay, .c-modal, .l-modal") || {}).innerText || "").replace(/\s+/g, " ").slice(0, 300),
          buttons: [...document.querySelectorAll("button, .o-primary-btn")].map((x) => x.textContent.trim()).filter(Boolean).slice(0, 12),
          introTick: window.player ? player.introTick : null, introFrozen: window.player ? player.introFrozen : null,
        })); }
    } catch (e) { clickInfo = "click failed: " + e.message.slice(0, 200); }
    logs.push("[after-click] " + JSON.stringify(clickInfo));
    await shot("after-click");
    // ---- PLAY: skip the intro and push the game through several stages ----
    const play = await page.evaluate(async () => {
      const res = { steps: [], thrown: [] };
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const step = async (label, fn) => { try { const r = await fn(); res.steps.push(label + (r === undefined ? "" : "=" + String(r).slice(0, 40))); }
        catch (e) { res.thrown.push(`${label}: ${(e && e.stack) || e}`.slice(0, 700)); } await sleep(400); };
      await step("skipIntro", () => { if (window.dev && dev.skipIntro) { dev.skipIntro(); return "dev"; } player.hasSeenIntro = true; player.introFrozen = true; return "manual"; });
      await step("giveAM", () => { player.antimatter = new Decimal("1e20"); });
      for (let i = 1; i <= 8; i++) await step("buyMax" + i, () => (typeof buyMaxDimension === "function" ? buyMaxDimension(i) : "no-fn"));
      await step("tickspeed", () => (typeof buyMaxTickSpeed === "function" ? buyMaxTickSpeed() : "no-fn"));
      await step("boost1", () => { player.antimatter = new Decimal("1e20"); for (let i = 1; i <= 8; i++) player.dimensions.antimatter[i - 1].amount = new Decimal(100); return typeof requestDimensionBoost === "function" ? requestDimensionBoost(true) : "no-fn"; });
      await step("galaxy1", () => { for (let i = 1; i <= 8; i++) player.dimensions.antimatter[i - 1].amount = new Decimal(1000); return typeof requestGalaxyReset === "function" ? requestGalaxyReset(true) : "no-fn"; });
      await step("crunch", () => { player.antimatter = Decimal.pow10(310); return typeof bigCrunchResetRequest === "function" ? bigCrunchResetRequest() : (typeof bigCrunchReset === "function" ? bigCrunchReset() : "no-fn"); });
      await sleep(3000);
      await step("giveIP", () => { player.infinityPoints = Decimal.pow10(320); player.antimatter = Decimal.pow10(310); });
      await step("eternity", () => (typeof eternity === "function" ? eternity(true) : "no-fn"));
      await sleep(3000);
      await step("tour", async () => { let n = 0; for (const tab of (window.Tabs ? window.Tabs.all : [])) for (const sub of (tab.subtabs || [tab])) { try { if (sub.show) { sub.show(true); n++; } } catch (e) { res.thrown.push(`tab ${tab.config && tab.config.id}: ${(e && e.stack) || e}`.slice(0, 500)); } await sleep(150); } return n; });
      return res;
    }).catch((e) => ({ playError: e.message }));
    for (const th of (play.thrown || [])) logs.push("[play-throw] " + th);
    logs.push("[play] " + JSON.stringify({ steps: play.steps, error: play.playError }));
    await page.waitForTimeout(4000);
    await shot("after-play");
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
    const SPECIAL = /^\[(intro|after-click|play|play-throw|shot)/;
    for (const l of logs.filter((x) => !SPECIAL.test(x))) { const k = l.split("\n").slice(0, 2).join(" | ").replace(/app\.[0-9a-f]+\.js:\d+:\d+|chunk-vendors\.[0-9a-f]+\.js:\d+:\d+/g, "BUNDLE").replace(/[?&]_p=\d+.*/, "").slice(0, 220); groups.set(k, (groups.get(k) || 0) + 1); }
    const grouped = [...groups].sort((a, b) => b[1] - a[1]).slice(0, 18).map(([k, n]) => `${n}x ${k}`);
    const special = logs.filter((x) => SPECIAL.test(x)).slice(0, 18).map((x) => x.slice(0, 1500));
    const text = `STATE ${JSON.stringify(state)}\nDISTINCT LOG KINDS (${groups.size}), total ${logs.length}:\n` + grouped.join("\n") + "\n--- SPECIAL ---\n" + special.join("\n") + "\n" + where.join("\n");
    summary += `## ${name}\n\`\`\`\n${text}\n\`\`\`\n`;
    console.log(`::error title=probe ${process.env.PROBE_NAME || ""} ${name}::${esc(text.slice(0, 14000))}`);
    await ctx.close();
  }
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  await browser.close(); server.close();
})().catch((e) => { console.log(`::error title=probe crashed::${esc(e.stack || e)}`); process.exit(1); });
