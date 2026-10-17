// Phone viewport: does the bottom of long tabs get hidden under the hotkey bar / cut off?
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
  const ctx = await browser.newContext({ viewport: { width: 662, height: 1400 }, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36" });
  const page = await ctx.newPage();
  await page.goto("http://localhost:8080/", { waitUntil: "load" });
  await page.waitForTimeout(10000);
  try { await page.getByText("Start New Game", { exact: true }).first().click({ timeout: 4000 }); } catch (e) {}
  await page.waitForTimeout(2000);
  const shot = async (label) => { const buf = await page.screenshot({ type: "jpeg", quality: 30 }); console.log(`::notice title=bshot ${label}::${buf.length < 60000 ? buf.toString("base64") : "TOOBIG" + buf.length}`); };
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    if (window.dev && dev.skipIntro) dev.skipIntro(); else { player.hasSeenIntro = true; player.introFrozen = true; }
    await sleep(500);
    player.antimatter = Decimal.pow10(310); try { bigCrunchReset(); } catch (e) {}
    await sleep(1500);
    player.options.showAllChallenges = true;
    try { player.records.thisEternity.maxAM = Decimal.pow10(3000); } catch (e) {}
  });
  const report = [];
  for (const [tab, sub] of [["challenges", "normal"], ["challenges", "infinity"], ["automation", "autobuyers"]]) {
    await page.evaluate(([t, s]) => { try { Modal.hideAll(); } catch (e) {} ui.view.tab = t; ui.view.subtab = s; }, [tab, sub]);
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => {
      const se = document.scrollingElement; se.scrollTo(0, 1e6);
      const bar = document.getElementById("mkbar"); const tab = document.querySelector(".c-game-tab");
      const rect = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom), Math.round(b.left), Math.round(b.right)]; };
      const kids = tab ? [...tab.querySelectorAll("*")].filter((e) => e.getBoundingClientRect().height > 20 && getComputedStyle(e).display !== "none") : [];
      const maxBottom = Math.max(0, ...kids.map((e) => e.getBoundingClientRect().bottom));
      const ov = (e) => { const c = getComputedStyle(e); return c.overflowY + "/" + c.height + "/pos:" + c.position; };
      const chain = []; let e = tab; while (e && chain.length < 8) { chain.push(e.tagName.toLowerCase() + "#" + e.id + "." + String(e.className).slice(0, 20) + " " + ov(e) + " sh=" + e.scrollHeight + " ch=" + e.clientHeight); e = e.parentElement; }
      return { innerH: innerHeight, innerW: innerWidth, vv: window.visualViewport ? [window.visualViewport.height, window.visualViewport.scale] : null, scrollY: Math.round(se.scrollTop), scrollH: se.scrollHeight, bar: rect(bar), tab: rect(tab), maxContentBottom: Math.round(maxBottom), zoom: tab && tab.style.zoom, chain };
    });
    report.push(tab + "/" + sub + " " + JSON.stringify(r));
    await shot(tab + "-" + sub);
  }
  console.log(`::error title=bottom::${esc(report.join("\n").slice(0, 8000))}`);
  await browser.close(); server.close();
})().catch((e) => { console.log(`::error title=bottom crashed::${esc(e.stack || e)}`); process.exit(1); });
