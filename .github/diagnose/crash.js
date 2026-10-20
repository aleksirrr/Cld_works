const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright-core");
const dist = path.resolve("dist");
const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webm": "video/webm", ".mp3": "audio/mpeg", ".json": "application/json", ".ttf": "font/ttf", ".woff": "font/woff", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
  const f = path.join(dist, p);
  if (!f.startsWith(dist) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.statusCode = 404; return res.end("nf"); }
  res.setHeader("content-type", types[path.extname(f)] || "application/octet-stream"); fs.createReadStream(f).pipe(res);
});
let SMC = null; try { SMC = require("source-map").SourceMapConsumer; } catch (e) {}
async function where(stack) {
  if (!SMC) return "(no source-map)";
  const frames = [...String(stack).matchAll(/js\/(app\.[0-9a-f]+\.js):(\d+):(\d+)/g)].slice(0, 5); const outl = [];
  for (const [, file, ln, col] of frames) {
    const mp = path.join(dist, "js", file + ".map"); if (!fs.existsSync(mp)) continue;
    const c = await new SMC(JSON.parse(fs.readFileSync(mp, "utf8"))); const o = c.originalPositionFor({ line: +ln, column: +col });
    if (o && o.source) { let sl = ""; try { sl = (c.sourceContentFor(o.source, true) || "").split("\n")[o.line - 1].trim().slice(0, 110); } catch (e) {} outl.push(String(o.source).replace(/^webpack:\/\/[^/]*\//, "") + ":" + o.line + " :: " + sl); }
    c.destroy && c.destroy();
  }
  return outl.join(" <- ");
}
const esc = (s) => String(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
const GROUPS = {
  ID: "for (let i = 1; i <= 8; i++) Autobuyer.infinityDimension(i).isActive = true; player.auto.infinityDims.isActive = true;",
  bigCrunch: "Autobuyer.bigCrunch.isActive = true;",
  ipMult: "Autobuyer.ipMult.isActive = true;",
  replGalaxy: "Autobuyer.replicantiGalaxy.isActive = true;",
  replUpg: "for (let i = 1; i <= 3; i++) Autobuyer.replicantiUpgrade(i).isActive = true; player.auto.replicantiUpgrades.isActive = true;",
};
(async () => {
  await new Promise((r) => server.listen(8080, r));
  const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox"] });
  const results = [];
  for (const [name, code] of Object.entries(GROUPS)) {
    const ctx = await browser.newContext({ viewport: { width: 900, height: 1200 } });
    const page = await ctx.newPage(); const errs = []; let crashed = false;
    page.on("pageerror", (e) => errs.push(String(e.stack || e.message).slice(0, 1500)));
    page.on("crash", () => { crashed = true; });
    await page.goto("http://localhost:8080/", { waitUntil: "load" });
    await page.waitForTimeout(9000);
    try { await page.getByText("Start New Game", { exact: true }).first().click({ timeout: 4000 }); } catch (e) {}
    await page.waitForTimeout(1500);
    const setup = await page.evaluate(async () => {
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const log = [];
      const t = (l, fn) => { try { fn(); } catch (e) { log.push(l + ": " + String(e.stack || e).slice(0, 200)); } };
      if (window.dev && dev.skipIntro) dev.skipIntro(); else { player.hasSeenIntro = true; player.introFrozen = true; }
      await sleep(400);
      player.antimatter = Decimal.pow10(310); t("crunch", () => bigCrunchReset());
      await sleep(1200);
      t("prog", () => {
        player.break = true; player.infinityPoints = Decimal.pow10(300); player.antimatter = Decimal.pow10(1200);
        for (const k of ["thisInfinity", "thisEternity"]) player.records[k].maxAM = Decimal.pow10(1200);
        player.eternities = new Decimal(1e6);
        for (let i = 0; i < 8; i++) InfinityDimensions.unlockNext();
        player.replicanti.unl = true; player.replicanti.amount = new Decimal(1e10);
        player.infinities = new Decimal(1e6);
      });
      await sleep(800);
      window.__hb = 0; setInterval(() => window.__hb++, 100);
      return log;
    });
    let enable;
    try { enable = await page.evaluate((code) => { try { (new Function("Autobuyer", code))(Autobuyer); return "ok"; } catch (e) { return "enable err " + String(e.stack || e).slice(0, 300); } }, code); } catch (e) { enable = "evaluate failed: " + e.message.slice(0, 100); }
    await page.waitForTimeout(3000);
    let hb = "frozen/crashed";
    try { hb = await Promise.race([page.evaluate(() => window.__hb), new Promise((r) => setTimeout(() => r("TIMEOUT(frozen)"), 8000))]); } catch (e) { hb = "evaluate error: " + e.message.slice(0, 80); }
    const uniq = [...new Set(errs)].slice(0, 4); const mapped = [];
    for (const e of uniq) mapped.push(String(e).split("\n")[0].slice(0, 100) + " @ " + await where(e));
    results.push(`[${name}] setup=${JSON.stringify(setup)} enable=${enable} heartbeat=${hb} crashed=${crashed} errors=${errs.length}\n  ${mapped.join("\n  ")}`);
    await ctx.close().catch(() => {});
  }
  console.log(`::error title=crash::${esc(results.join("\n").slice(0, 7500))}`);
  await browser.close(); server.close();
})().catch((e) => { console.log(`::error title=crash crashed::${esc(e.stack || e)}`); process.exit(1); });
