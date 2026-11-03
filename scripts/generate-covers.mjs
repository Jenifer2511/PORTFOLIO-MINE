/** Original typographic project covers, not screenshots of the live client sites.
 * Run with `node scripts/generate-covers.mjs` when Playwright and Chromium are available. */
import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("/opt/codex/cua_node/lib/node_modules/playwright"));
}
const font = await fs.readFile(
  new URL(
    "../node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2",
    import.meta.url,
  ),
);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 800 },
  deviceScaleFactor: 1,
});
const covers = [
  {
    id: "srinava",
    bg: "#101010",
    color: "#ffffff",
    html: '<header><b>Srinava Industries</b><span>Business website ↗</span></header><main><div class="small">Built for industry.<br>Designed for the web.</div><h1 style="font-size:180px;margin-top:36px;letter-spacing:-14px">Srinava<span style="font-size:112px;display:block;letter-spacing:-6px">Industries.</span></h1><span class="mark" style="color:#0047ff">✳</span></main><footer><span>Digital presence. Real business.</span><span>srinavaindustries.com</span></footer>',
  },
  {
    id: "outfit",
    bg: "#101010",
    color: "#ffffff",
    html: '<header><b>OUTFIT FOR YOU</b><span>Retail website ↗</span></header><main><h1 style="font-size:146px;letter-spacing:-10px;line-height:.94;margin-top:28px">Everyday.<br>Extraordinary.</h1><div style="font-size:28px;margin-top:36px">A new look for the everyday.</div></main><footer><span>Style, brought online.</span><span>outfitforyou.com</span></footer>',
  },
  {
    id: "sdk",
    bg: "#ffffff",
    color: "#101010",
    html: '<header><b>SD-K INDUSTRIES</b><span>Business website ↗</span></header><main><h1 style="font-size:260px;letter-spacing:-24px;line-height:1">SD—K</h1><div style="display:flex;justify-content:space-between;margin-top:36px"><span style="font-size:54px;letter-spacing:-2px;line-height:1.1">Built on<br>precision.</span><span class="small" style="text-align:right;align-self:end">Responsive design.<br>Dependable development.</span></div></main><footer><span>A stronger digital foundation.</span><span>sd-kindustries.vercel.app</span></footer>',
  },
  {
    id: "film",
    bg: "#ffffff",
    color: "#101010",
    html: '<header><b>Filmaking</b><span>Creative website ↗</span></header><main><div style="display:flex;gap:22px;align-items:center"><span style="font-size:72px;line-height:1">↗</span><span class="small">A space for<br>visual storytelling.</span></div><h1 style="font-size:145px;letter-spacing:-10px;line-height:.96;margin-top:32px">STORIES.<br>IN MOTION.</h1></main><footer><span>Creativity, frame by frame.</span><span>filmaking.vercel.app</span></footer>',
  },
];
for (const c of covers) {
  await page.setContent(
    `<!doctype html><html><head><style>@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${font.toString("base64")})}*{box-sizing:border-box}body{font-family:Manrope,sans-serif;margin:0;width:1200px;height:800px;background:${c.bg};color:${c.color};padding:48px;display:flex;flex-direction:column;position:relative}header,footer{display:flex;justify-content:space-between;align-items:center;font-size:20px}header b{font-size:24px;letter-spacing:-1px}main{flex:1;padding-top:60px;position:relative}h1{margin:0;font-weight:600}.small{font-size:24px;line-height:1.4}footer{font-size:18px}.mark{position:absolute;font-size:210px;right:0;top:60px;line-height:1}</style></head><body>${c.html.replaceAll("↗", "").replaceAll("✳", '<svg width="210" height="210" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"><path d="M50 9v82M9 50h82M21 21l58 58M21 79l58-58"/></svg>')}</body></html>`,
  );
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: new URL(`../public/images/work-${c.id}.png`, import.meta.url)
      .pathname,
  });
  console.log(`Created work-${c.id}.png`);
}
await browser.close();
