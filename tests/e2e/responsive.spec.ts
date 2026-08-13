import { expect, test } from "@playwright/test";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth };
  });
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

test("main page has no horizontal overflow at any viewport", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(500);
  await expectNoHorizontalOverflow(page);
});

test("hero device fits within narrow viewports", async ({ page }) => {
  await page.goto("/");
  const device = page.locator(".hero-device");
  await expect(device).toBeVisible();
  const box = await device.boundingBox();
  expect(box).not.toBeNull();
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width + 1);
});

test("component library section has no horizontal overflow", async ({ page }) => {
  await page.goto("/library");
  await expect(page.getByLabel("Skeuomorphic component library")).toBeVisible({
    timeout: 15_000,
  });
  await expectNoHorizontalOverflow(page);
});

test("custom table panel scrolls instead of overflowing on small screens", async ({ page }) => {
  await page.goto("/#data");
  const panel = page.locator(".table-panel").first();
  const scrollRegion = panel.locator(".table-scroll");
  await expect(scrollRegion).toBeVisible({ timeout: 15_000 });
  const isScrollable = await scrollRegion.evaluate(
    (element) => element.scrollWidth > element.clientWidth + 1,
  );
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  if (viewport!.width < 720) {
    expect(isScrollable).toBe(true);
  }
  await expectNoHorizontalOverflow(page);
});

test("content shell respects the viewport width", async ({ page }) => {
  await page.goto("/");
  const shell = page.locator(".content-shell");
  const box = await shell.boundingBox();
  expect(box).not.toBeNull();
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width + 1);
});

test("mode toggle stays reachable on small screens", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("group", { name: "Theme" });
  await expect(toggle).toBeVisible();
  await expect(toggle.getByRole("button", { name: "Dark mode" })).toBeVisible();
});
