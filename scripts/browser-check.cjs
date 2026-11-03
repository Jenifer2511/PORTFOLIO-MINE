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
  console.log("Hero: original full-colour photo and six scroll chapters");
  const scrubHero = async (progress) => {
    await page.locator("#home").evaluate(
      (e, p) =>
        scrollTo({
          top: e.offsetTop + (e.offsetHeight - innerHeight) * p,
          behavior: "instant",
        }),
      progress,
    );
    await page.waitForTimeout(120);
  };
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
    { width: 320, height: 600 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(vp);
    await scrubHero(0);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Initial overflow at ${vp.width}`,
    );
    const initial = await page
      .locator(".shutter-left")
      .evaluate((e) => getComputedStyle(e).transform);
    if (vp.width === 1440 || vp.width === 390) {
      await page.waitForTimeout(400);
      assert.equal(
        await page
          .locator(".shutter-left")
          .evaluate((e) => getComputedStyle(e).transform),
        initial,
        "Portrait must wait for scroll, not a timer",
      );
    }
    await scrubHero(0.36);
    assert.notEqual(
      await page
        .locator(".shutter-left")
        .evaluate((e) => getComputedStyle(e).transform),
      initial,
      "Scrolling must open the shutters",
    );
    assert.equal(
      await page
        .locator(".hero-stage")
        .evaluate((e) => Math.abs(e.getBoundingClientRect().top) < 1),
      true,
      "Opening stays pinned",
    );
    await scrubHero(0.8);
    const image = await page.locator(".hero-poster").evaluate((e) => {
      const r = e.getBoundingClientRect(),
        left = document.querySelector(".shutter-left").getBoundingClientRect(),
        right = document
          .querySelector(".shutter-right")
          .getBoundingClientRect();
      const intersects = (node) => {
        const b = node.getBoundingClientRect();
        return (
          r.left < b.right &&
          r.right > b.left &&
          r.top < b.bottom &&
          r.bottom > b.top
        );
      };
      return {
        width: r.width,
        height: r.height,
        x: r.x,
        y: r.y,
        right: r.right,
        bottom: r.bottom,
        fit: getComputedStyle(e).objectFit,
        filter: getComputedStyle(e).filter,
        clear: left.right <= r.left && right.left >= r.right,
        overlapsCopy:
          intersects(document.querySelector(".hero-left h2")) ||
          intersects(document.querySelector(".hero-right p")),
      };
    });
    assert.ok(
      image.width <= 340 && image.width <= vp.width - 48,
      `Photo width ${JSON.stringify(vp)}`,
    );
    assert.ok(image.height <= 430 && image.height <= vp.height);
    assert.ok(
      image.y >= 64 && image.bottom <= vp.height - 50,
      `Complete photo must fit the screen: ${JSON.stringify({ vp, image })}`,
    );
    assert.equal(image.fit, "contain");
    assert.equal(image.filter, "none");
    assert.equal(
      image.clear,
      true,
      "Shutters completely uncover the original photo",
    );
    assert.equal(
      image.overlapsCopy,
      false,
      `Text must not cover the completed portrait: ${JSON.stringify(vp)}`,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Revealed overflow at ${vp.width}`,
    );
    await scrubHero(0);
    assert.equal(
      await page
        .locator(".shutter-left")
        .evaluate((e) => getComputedStyle(e).transform),
      initial,
      "Scrolling back must reverse the reveal",
    );
    console.log(
      "Pinned portrait reveal fits and reverses",
      vp.width,
      vp.height,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "Scroll to reveal", exact: true })
    .click();
  await page.waitForFunction(
    () =>
      Number(
        getComputedStyle(document.querySelector(".hero-final-copy")).opacity,
      ) > 0.98,
  );
  await page.waitForFunction(
    () =>
      Math.abs(
        scrollY -
          (document.querySelector("#home").offsetHeight - innerHeight) * 0.78,
      ) < 1,
  );
  await page.waitForTimeout(150);
  const backgrounds = await page
    .locator("main > section")
    .evaluateAll((nodes) =>
      nodes.map((e) => getComputedStyle(e).backgroundColor),
    );
  assert.deepEqual(backgrounds, [
    "rgb(16, 16, 16)",
    "rgb(255, 255, 255)",
    "rgb(16, 16, 16)",
    "rgb(255, 255, 255)",
    "rgb(16, 16, 16)",
    "rgb(255, 255, 255)",
  ]);
  console.log(
    "Monochrome chapters; reveal control reaches the completed portrait",
  );
  for (const [target, animated] of [
    ["#about-title", "#about-title [data-animated]"],
    [".about-photo", ".about-photo"],
    [".about-facts", ".about-facts strong"],
    [".cert-row", ".cert-row"],
  ]) {
    const top = await page
      .locator(target)
      .first()
      .evaluate((e) => e.getBoundingClientRect().top + scrollY);
    await page.evaluate(
      (y) => scrollTo({ top: y, behavior: "instant" }),
      top - 1000 * 0.94,
    );
    await page.waitForTimeout(120);
    const entering = await page
      .locator(animated)
      .first()
      .evaluate((e) => getComputedStyle(e).transform);
    await page.evaluate(
      (y) => scrollTo({ top: y, behavior: "instant" }),
      top - 1000 * 0.3,
    );
    await page.waitForTimeout(120);
    assert.notEqual(
      await page
        .locator(animated)
        .first()
        .evaluate((e) => getComputedStyle(e).transform),
      entering,
      target + " scroll animation",
    );
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
    "Content: folded headlines, hinged photo, number reels, and dimensional certificates respond to scroll",
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
