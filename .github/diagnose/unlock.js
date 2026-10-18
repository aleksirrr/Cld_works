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
const esc = (s) => String(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
(async () => {
  await new Promise((r) => server.listen(8080, r));
  const browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox"] });
  const ctx = await browser.newContext({ viewport: { width: 662, height: 1400 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36" });
  const page = await ctx.newPage(); const errs = [];
  page.on("pageerror", (e) => errs.push(String(e.stack || e.message).slice(0, 400)));
  await page.goto("http://localhost:8080/", { waitUntil: "load" });
  await page.waitForTimeout(10000);
  try { await page.getByText("Start New Game", { exact: true }).first().click({ timeout: 4000 }); } catch (e) {}
  await page.waitForTimeout(2000);
  const out = [];
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    if (window.dev && dev.skipIntro) dev.skipIntro(); else { player.hasSeenIntro = true; player.introFrozen = true; }
    await sleep(500);
    player.antimatter = Decimal.pow10(310); try { bigCrunchReset(); } catch (e) {}
    await sleep(1500);
    player.break = true;
    player.infinityPoints = Decimal.pow10(60);
    player.antimatter = Decimal.pow10(1200);
    for (const k of ["thisInfinity", "thisEternity"]) { try { player.records[k].maxAM = Decimal.pow10(1200); } catch (e) {} }
    try { Modal.hideAll(); } catch (e) {}
    ui.view.tab = "dimensions"; ui.view.subtab = "antimatter";
    await sleep(1500);
  });
  const info = async (label) => {
    const r = await page.evaluate(() => {
      const btns = [...document.querySelectorAll("button, .o-primary-btn, .o-infinity-button, .o-prestige-button")].filter((b) => /unlock|reach/i.test(b.innerText || ""));
      return { id1: (() => { try { return InfinityDimension(1).isUnlocked; } catch (e) { return "err"; } })(), canUnlock: (() => { try { const n = InfinityDimensions.next(); return [n.canUnlock, String(n.ipRequirement), String(n.amRequirement), n.hasIPUnlock]; } catch (e) { return "err " + e.message; } })(),
        iw: innerWidth, btns: btns.map((b) => { const r = b.getBoundingClientRect(); return { t: b.innerText.replace(/\s+/g, " ").slice(0, 90), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], cls: String(b.className).slice(0, 60), top: (() => { const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e ? e.tagName + "." + String(e.className).slice(0, 40) : "none"; })() }; }) };
    });
    out.push(label + " " + JSON.stringify(r));
    return r;
  };
  const before = await info("before");
  // try a real tap on the first matching button
  try {
    const b = before.btns.find((x) => /unlock/i.test(x.t));
    if (b) { await page.touchscreen.tap(b.rect[0] + b.rect[2] / 2, b.rect[1] + b.rect[3] / 2); await page.waitForTimeout(1000); }
    else out.push("no unlock button found");
  } catch (e) { out.push("tap failed " + e.message.slice(0, 120)); }
  await info("after-tap");
  console.log(`::error title=unlock::${esc(out.join("\n").slice(0, 7000) + "\nERR " + JSON.stringify([...new Set(errs)].slice(0, 4)))}`);
  const buf = await page.screenshot({ type: "jpeg", quality: 30 }); if (buf.length < 60000) console.log(`::notice title=ushot::${buf.toString("base64")}`);
  await browser.close(); server.close();
})().catch((e) => { console.log(`::error title=unlock crashed::${esc(e.stack || e)}`); process.exit(1); });
