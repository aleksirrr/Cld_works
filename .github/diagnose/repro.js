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
(async () => {
  await new Promise((r) => server.listen(8080, r));
  const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox"] });
  const ctx = await browser.newContext({ viewport: { width: 662, height: 1400 }, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36" });
  const page = await ctx.newPage(); const errs = [];
  page.on("pageerror", (e) => errs.push(String(e.stack || e.message).slice(0, 1500)));
  await page.goto("http://localhost:8080/", { waitUntil: "load" });
  await page.waitForTimeout(10000);
  try { await page.getByText("Start New Game", { exact: true }).first().click({ timeout: 4000 }); } catch (e) {}
  await page.waitForTimeout(2000);
  const out = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const res = [];
    const txt = () => ((document.querySelector(".c-game-tab") || {}).innerText || "").replace(/\s+/g, " ");
    const go = async (t, s) => { try { Modal.hideAll(); } catch (e) {} ui.view.tab = t; ui.view.subtab = s; await sleep(900); };
    if (window.dev && dev.skipIntro) dev.skipIntro(); else { player.hasSeenIntro = true; player.introFrozen = true; }
    await sleep(500);
    player.antimatter = Decimal.pow10(310); try { bigCrunchReset(); } catch (e) {}
    await sleep(1500);
    player.break = true; player.infinityPoints = Decimal.pow10(150);
    for (const k of ["thisInfinity", "thisEternity"]) { try { player.records[k].maxAM = Decimal.pow10(1102); } catch (e) {} }
    player.antimatter = Decimal.pow10(1102);
    // A: infinity dimensions
    await go("dimensions", "infinity");
    const a0 = txt();
    try { InfinityDimensions.unlockNext(); } catch (e) { res.push("unlockNext err " + e.message); }
    await sleep(1200);
    const a1 = txt();
    await go("dimensions", "antimatter"); await go("dimensions", "infinity");
    const a2 = txt();
    res.push("ID before: " + a0.slice(0, 160)); res.push("ID after unlock (no revisit): " + a1.slice(0, 160)); res.push("ID after revisit: " + a2.slice(0, 160));
    res.push("ID same? " + (a1 === a2));
    // B: replicanti
    await go("infinity", "replicanti");
    const b0 = txt();
    try { Replicanti.unlock(); } catch (e) { res.push("repl unlock err " + e.message); }
    await sleep(1200);
    const b1 = txt();
    await go("infinity", "upgrades"); await go("infinity", "replicanti");
    const b2 = txt();
    res.push("REPL before: " + b0.slice(0, 160)); res.push("REPL after unlock (no revisit): " + b1.slice(0, 160)); res.push("REPL after revisit: " + b2.slice(0, 160));
    res.push("REPL same? " + (b1 === b2) + " unl=" + player.replicanti.unl);
    // C: TT shop clearance
    await go("eternity", "studies");
    const shop = document.querySelector(".time-theorem-buttons"); const bar = document.getElementById("mkbar");
    const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom), Math.round(b.left), Math.round(b.right)]; };
    res.push("TT shop " + JSON.stringify(r(shop)) + " bar " + JSON.stringify(r(bar)) + " innerH " + innerHeight + " buyBtns " + document.querySelectorAll(".c-tt-buy-button").length);
    if (shop) { const q = shop.getBoundingClientRect(); const e = document.elementFromPoint(q.left + q.width / 2, q.bottom - 10); res.push("top at shop bottom: " + (e ? e.tagName + "#" + e.id + "." + String(e.className).slice(0, 40) : "none")); }
    return res;
  }).catch((e) => ["evalError " + e.message]);
  const uniq = [...new Set(errs)].slice(0, 4); const mapped = []; for (const e of uniq) mapped.push(await where(e));
  console.log(`::error title=repro::${esc(out.join("\n").slice(0, 4000) + "\nERRWHERE\n" + mapped.join("\n"))}`);
  await browser.close(); server.close();
})().catch((e) => { console.log(`::error title=repro crashed::${esc(e.stack || e)}`); process.exit(1); });
