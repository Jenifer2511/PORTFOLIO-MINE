let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("/opt/codex/cua_node/lib/node_modules/playwright"));
}
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  const url = process.env.TARGET_URL || "http://127.0.0.1:4173";
  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator(".hero-poster").waitFor();
  await page.waitForFunction(
    () =>
      document.querySelector(".hero-poster").complete &&
      document.querySelector(".hero-poster").naturalWidth > 0,
  );
  assert.equal(
    await page
      .getByRole("heading", { name: "JENIFER J.", exact: true })
      .count(),
    1,
  );
  assert.equal(
    await page
      .locator(".hero-poster")
      .evaluate((e) => getComputedStyle(e).objectFit),
    "contain",
  );
  assert.equal(
    await page
      .locator(".hero-poster")
      .evaluate((e) => getComputedStyle(e).filter),
    "none",
  );
  assert.equal(await page.locator("[data-scroll-chapter]").count(), 6);
  console.log(
    "Hero: full-colour, uncropped original photo; six scroll chapters",
  );
  for (const vp of [
    { width: 1440, height: 1000 },
    { width: 1366, height: 768 },
    { width: 1024, height: 900 },
    { width: 900, height: 900 },
    { width: 768, height: 1024 },
    { width: 600, height: 900 },
    { width: 481, height: 900 },
    { width: 390, height: 844 },
    { width: 320, height: 740 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(vp);
    await page.waitForTimeout(120);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Overflow at ${vp.width}`,
    );
    const photo = await page.locator(".hero-poster").evaluate((e) => {
      const r = e.getBoundingClientRect();
      return {
        width: r.width,
        height: r.height,
        fit: getComputedStyle(e).objectFit,
        filter: getComputedStyle(e).filter,
      };
    });
    assert.ok(photo.width <= 360 && photo.width <= vp.width - 48);
    assert.ok(photo.height <= 440 && photo.height <= vp.height);
    assert.equal(photo.fit, "contain");
    assert.equal(photo.filter, "none");
    console.log("Layout fits", vp.width, vp.height);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const id of ["about", "learning", "contact"]) {
    await page
      .locator("#" + id)
      .evaluate((e) =>
        scrollTo({ top: e.offsetTop - innerHeight * 0.6, behavior: "instant" }),
      );
    await page.waitForTimeout(120);
    const entering = await page
      .locator("#" + id + " > .chapter-content")
      .evaluate((e) => ({
        transform: getComputedStyle(e).transform,
        opacity: Number(getComputedStyle(e).opacity),
      }));
    await page
      .locator("#" + id)
      .evaluate((e) => scrollTo({ top: e.offsetTop, behavior: "instant" }));
    await page.waitForTimeout(120);
    const settled = await page
      .locator("#" + id + " > .chapter-content")
      .evaluate((e) => ({
        transform: getComputedStyle(e).transform,
        opacity: Number(getComputedStyle(e).opacity),
      }));
    assert.notEqual(
      entering.transform,
      settled.transform,
      id + " scroll transform",
    );
    assert.ok(settled.opacity > entering.opacity, id + " scroll opacity");
  }
  assert.equal(
    await page
      .locator(".about-photo img")
      .evaluate(
        (e) =>
          getComputedStyle(e).objectFit === "contain" &&
          getComputedStyle(e).filter === "none",
      ),
    true,
  );
  assert.equal(
    await page
      .locator(".cert-row>img")
      .evaluateAll((images) =>
        images.every(
          (e) =>
            getComputedStyle(e).objectFit === "contain" &&
            getComputedStyle(e).filter === "none",
        ),
      ),
    true,
  );
  console.log(
    "Chapters: independent scroll-linked entrances; complete full-colour photos and certificates",
  );
  await page.locator("#work").evaluate((e) => scrollTo(0, e.offsetTop));
  await page.waitForSelector(".has-webgl");
  await page.waitForTimeout(500);
  const before = await page.locator("#gallery-name").textContent();
  await page.getByRole("button", { name: "Next project", exact: true }).click();
  await page.waitForFunction(
    (before) => document.querySelector("#gallery-name").textContent !== before,
    before,
  );
  assert.notEqual(await page.locator("#gallery-name").textContent(), before);
  console.log("Gallery: buttons select project and update real URL");
  const box = await page.locator("#webgl-gallery").boundingBox();
  const beforeDrag = await page.locator("#gallery-name").textContent();
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.38, box.y + box.height * 0.5, {
    steps: 12,
  });
  await page.mouse.up();
  await page.waitForTimeout(1100);
  assert.notEqual(
    await page.locator("#gallery-name").textContent(),
    beforeDrag,
  );
  console.log("Gallery: pointer drag with momentum");
  await page.locator("#projects").evaluate((e) => scrollTo(0, e.offsetTop));
  await page.waitForTimeout(500);
  assert.equal(await page.locator("#projects-position").textContent(), "1 / 4");
  await page.getByRole("button", { name: "Next technical project" }).click();
  await page.waitForTimeout(1500);
  assert.equal(await page.locator("#projects-position").textContent(), "2 / 4");
  await page.locator('[data-project="nurse"]').click();
  await page
    .getByRole("heading", { name: "Smart Nurse", exact: true })
    .last()
    .waitFor();
  assert.equal(
    await page.locator("#project-dialog").evaluate((e) => e.open),
    true,
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () =>
      !document.querySelector("#project-dialog").open &&
      document.activeElement ===
        document.querySelector('[data-project="nurse"]'),
  );
  console.log("Project rail: scroll controls and working project dialog");
  await page.locator('[data-project="chain"]').focus();
  await page.waitForFunction(
    () => document.querySelector("#projects-position").textContent === "4 / 4",
  );
  assert.equal(await page.locator("#projects-position").textContent(), "4 / 4");
  assert.equal(
    await page.locator('[data-project="chain"]').evaluate((e) => {
      const r = e.getBoundingClientRect();
      return r.x >= 0 && r.right <= innerWidth;
    }),
    true,
  );
  console.log("Project rail: keyboard focus brings offscreen card into view");
  await page.locator('[data-document="3"]').click();
  await page.locator("#certificate-dialog[open]").waitFor();
  await page.waitForFunction(
    () =>
      document.querySelector("#document-image").complete &&
      document.querySelector("#document-image").naturalWidth > 0,
  );
  for (let i = 0; i < 19; i++) {
    assert.equal(
      await page
        .locator("#document-image")
        .evaluate((e) => e.complete && e.naturalWidth > 0),
      true,
    );
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.waitForFunction(
      () =>
        document.querySelector("#document-image").complete &&
        document.querySelector("#document-image").naturalWidth > 0,
    );
  }
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .locator('[data-document="3"]')
      .evaluate((e) => e === document.activeElement),
    true,
  );
  console.log(
    "Certificates: 19 original images, navigation, Escape, focus return",
  );
  for (const file of [
    "/Jenifer-J-Resume.pdf",
    "/Python-Full-Stack-Certificate.pdf",
  ]) {
    const r = await page.request.get(url + file);
    assert.equal(r.status(), 200);
    assert.equal((await r.body()).subarray(0, 4).toString(), "%PDF");
  }
  console.log("Downloads: both original PDFs valid");
  await page
    .getByRole("button", { name: "Motion effects", exact: true })
    .click();
  await page.waitForTimeout(150);
  assert.equal(await page.locator("canvas").count(), 0);
  assert.equal(await page.locator("html").getAttribute("data-motion"), "off");
  assert.equal(
    await page
      .locator(".project-list")
      .evaluate((e) => getComputedStyle(e).flexDirection),
    "column",
  );
  console.log("Motion off: no canvases; scenes become readable static layouts");
  await page
    .getByRole("button", { name: "Motion effects", exact: true })
    .click();
  await page.locator(".hero-poster").waitFor();
  await page.waitForFunction(
    () =>
      document.querySelector(".hero-poster").complete &&
      document.querySelector(".hero-poster").naturalWidth > 0,
  );
  assert.equal(await page.locator("html").getAttribute("data-motion"), "on");
  console.log("Motion on: animated gallery restores");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(150);
  assert.equal(await page.locator("canvas").count(), 0);
  assert.equal(
    await page.getByRole("button", { name: "Motion effects" }).isDisabled(),
    true,
  );
  assert.equal(await page.locator("#gallery-fallback").isVisible(), true);
  console.log("System reduced motion: automatically honored");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator(".hero-poster").waitFor();
  await page.waitForFunction(
    () =>
      document.querySelector(".hero-poster").complete &&
      document.querySelector(".hero-poster").naturalWidth > 0,
  );
  assert.equal(await page.locator("#webgl-portrait canvas").count(), 0);
  assert.equal(
    await page
      .locator(".hero-poster")
      .evaluate((e) => getComputedStyle(e).objectFit),
    "contain",
  );
  console.log("Portrait stays a complete original image in every motion mode");
  await page.locator("#work").evaluate((e) => scrollTo(0, e.offsetTop));
  await page.waitForSelector(".has-webgl");
  await page
    .locator("#webgl-gallery canvas")
    .evaluate((c) =>
      c.getContext("webgl2").getExtension("WEBGL_lose_context").loseContext(),
    );
  await page.waitForFunction(
    () =>
      !document.querySelector(".gallery-stage").classList.contains("has-webgl"),
  );
  assert.equal(await page.locator("#gallery-fallback").isVisible(), true);
  console.log("Gallery WebGL failure: static linked covers restored");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  assert.equal(await page.locator("main").evaluate((e) => e.inert), true);
  assert.equal(
    await page
      .locator("html")
      .evaluate((e) => e.classList.contains("menu-is-open")),
    true,
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("main").evaluate((e) => e.inert), false);
  console.log("Mobile menu: focus and scroll isolation; Escape works");
  assert.deepEqual(errors, []);
  console.log("Production page: no browser errors");
  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await nojs.newPage();
  await staticPage.goto(url);
  assert.equal(await staticPage.locator("h1").textContent(), "JENIFER J.");
  assert.equal(await staticPage.locator("#gallery-fallback a").count(), 4);
  assert.equal(
    await staticPage
      .locator(".project-list")
      .evaluate((e) => getComputedStyle(e).flexDirection),
    "column",
  );
  assert.equal(
    await staticPage.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  console.log(
    "No JavaScript: photo, links, and all project descriptions remain available",
  );
  await nojs.close();
  const portable = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const portableErrors = [];
  const network = [];
  portable.on("pageerror", (e) => portableErrors.push(e.message));
  portable.on("request", (r) => {
    if (r.url().startsWith("http")) network.push(r.url());
  });
  await portable.setContent(
    require("node:fs").readFileSync(
      require("node:path").join(
        process.cwd(),
        "artifacts/Jenifer-Portfolio.html",
      ),
      "utf8",
    ),
    { waitUntil: "load" },
  );
  await portable.locator(".hero-poster").waitFor();
  await portable.locator("#work").evaluate((e) => scrollTo(0, e.offsetTop));
  await portable.waitForSelector(".has-webgl");
  await portable.locator('[data-document="3"]').click();
  await portable.locator("#certificate-dialog[open]").waitFor();
  assert.equal(
    await portable
      .locator("#document-download")
      .getAttribute("href")
      .then((h) => h.startsWith("data:application/pdf")),
    true,
  );
  assert.deepEqual(network, []);
  assert.deepEqual(portableErrors, []);
  console.log(
    "Standalone HTML: inline execution with WebGL, documents, and zero external requests",
  );
  await browser.close();
  console.log("ALL CINEMATIC CHECKS PASSED");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
