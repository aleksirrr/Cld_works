// Opens the challenge tabs after pushing the game to a late-ish state and reports what is rendered.
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright-core");
const dist = path.resolve("dist");
const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".webm": "video/webm", ".mp3": "audio/mpeg", ".json": "application/json", ".ttf": "font/ttf", ".woff": "font/woff", ".woff2": "font/woff2" };
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
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage(); const errs = [];
  page.on("pageerror", (e) => errs.push(String(e.stack || e.message).slice(0, 500)));
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 300)); });
  await page.goto("http://localhost:8080/", { waitUntil: "load" });
  await page.waitForTimeout(10000);
  try { await page.getByText("Start New Game", { exact: true }).first().click({ timeout: 4000 }); } catch (e) {}
  await page.waitForTimeout(2000);
  const out = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const res = { log: [], tabs: {} };
    const t = async (l, fn) => { try { await fn(); } catch (e) { res.log.push(l + ": " + String(e && e.stack || e).slice(0, 300)); } await sleep(400); };
    await t("skip", () => { if (window.dev && dev.skipIntro) dev.skipIntro(); else { player.hasSeenIntro = true; player.introFrozen = true; } });
    await t("am", () => { player.antimatter = Decimal.pow10(310); });
    await t("crunch", () => (typeof bigCrunchReset === "function" ? bigCrunchReset() : bigCrunchResetRequest()));
    await sleep(2000);
    await t("prog", () => {
      const big = Decimal.pow10(3000);
      for (const k of ["thisInfinity", "thisEternity", "thisReality", "bestInfinity"]) { try { player.records[k].maxAM = big; } catch (e) {} }
      player.records.totalAntimatter = big; player.antimatter = big;
      player.infinityPoints = Decimal.pow10(400);
      try { player.break = true; } catch (e) {}
      try { for (let i = 1; i <= 12; i++) player.challenge.normal.completedBits |= (1 << i); } catch (e) {}
    });
    await sleep(1500);
    const find = (name) => { for (const tab of window.Tabs.all) for (const sub of (tab.subtabs || [tab])) { const cfg = sub.config || {}; if ((cfg.key || cfg.id || "").toLowerCase().includes(name)) return sub; } };
    for (const name of ["normal", "infinity", "eternity"]) {
      const c = [];
      for (const tab of window.Tabs.all) for (const sub of (tab.subtabs || [])) if (/challenge/i.test(String((sub.config || {}).key || (sub.config || {}).id || ""))) c.push(sub);
      break;
    }
    const subs = [];
    res.allTabs = window.Tabs.all.map((tb) => (tb.config.key || tb.config.id) + ":" + (tb.subtabs || []).map((x) => x.config.key || x.config.id).join("/"));
    for (const tab of window.Tabs.all) if (/challenge/i.test(String(tab.config.key || tab.config.id))) for (const sub of (tab.subtabs || [])) subs.push([String(sub.config.key || sub.config.id), sub]);
    res.found = subs.map((x) => x[0]);
    for (const [k, sub] of subs) {
      await t("show " + k, () => { try { Modal.hideAll(); } catch (e) {} ui.view.tab = "challenges"; ui.view.subtab = k; });
      await sleep(1500);
      const grid = document.querySelector(".l-challenge-grid");
      const cells = [...document.querySelectorAll(".l-challenge-grid__cell")];
      const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
      res.tabs[k] = {
        viewTab: ui.view.tab + "/" + ui.view.subtab, quoteOpen: (() => { try { return Quote.isOpen; } catch (e) { return "?"; } })(),
        isAvailable: (() => { try { return sub.isAvailable; } catch (e) { return "?"; } })(),
        hasGrid: !!grid, gridRect: r(grid), cells: cells.length,
        displayed: cells.filter((c) => getComputedStyle(c).display !== "none").length,
        firstCells: cells.slice(0, 3).map((c) => ({ disp: getComputedStyle(c).display, rect: r(c), txt: c.innerText.replace(/\s+/g, " ").slice(0, 60), html: c.innerHTML.length })),
        tabText: (document.querySelector(".c-game-tab") || {}).innerText ? document.querySelector(".c-game-tab").innerText.replace(/\s+/g, " ").slice(0, 200) : "(no c-game-tab)",
        ICs: (() => { try { return InfinityChallenges.all.map((x) => x.isUnlocked).join(","); } catch (e) { return "err " + e.message; } })(),
        NCs: (() => { try { return NormalChallenges.all.length; } catch (e) { return "err"; } })(),
      };
      window.__sh = window.__sh || [];
    }
    res.sweep = [];
    for (const tab of window.Tabs.all) for (const sub of (tab.subtabs || [])) {
      const k = String(tab.config.key || tab.config.id) + "/" + String(sub.config.key || sub.config.id);
      try { try { Modal.hideAll(); } catch (e) {} ui.view.tab = tab.config.key || tab.config.id; ui.view.subtab = sub.config.key || sub.config.id; } catch (e) { res.sweep.push(k + " NAVERR"); continue; }
      await sleep(700);
      const el = document.querySelector(".c-game-tab");
      const txt = el ? el.innerText : "(none)";
      const bad = (txt.match(/undefined|NaN|\[object|null/g) || []).length;
      const empty = el ? el.querySelectorAll("*").length : 0;
      if (bad || !el || empty < 8) res.sweep.push(k + " bad=" + bad + " nodes=" + empty + " :: " + (bad ? txt.replace(/\s+/g, " ").split(/(?=undefined|NaN|\[object|null)/).slice(1, 3).map((x) => x.slice(0, 40)).join(" | ") : ""));
    }
    return res;
  }).catch((e) => ({ evalError: e.message }));
  for (const k of (out.found || [])) { /* screenshots of each tab */ }
  const text = JSON.stringify(out, null, 1) + "\nERRORS(" + errs.length + "):\n" + [...new Set(errs)].slice(0, 12).join("\n");
  console.log(`::error title=chall ${process.env.PROBE_NAME}::${esc(text.slice(0, 14000))}`);
  await browser.close(); server.close();
})().catch((e) => { console.log(`::error title=chall crashed::${esc(e.stack || e)}`); process.exit(1); });
