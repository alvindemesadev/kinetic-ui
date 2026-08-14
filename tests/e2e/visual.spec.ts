import { expect, test } from "@playwright/test";

test.describe("protected Skeuomorphic visual contract", () => {
  test.beforeEach(({ page: unusedPage }, testInfo) => {
    void unusedPage;
    test.skip(testInfo.project.name !== "chromium", "Visual baselines use the desktop Chromium project.");
  });

  test("overview light theme", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("kinetic-theme", "light"));
    await page.goto("/#overview");
    await expect(page.locator("#overview")).toHaveScreenshot("overview-light.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    });
  });

  test("overview dark theme", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("kinetic-theme", "dark"));
    await page.goto("/#overview");
    await expect(page.locator("#overview")).toHaveScreenshot("overview-dark.png", {
      animations: "disabled",
      caret: "hide",
      scale: "css",
    });
  });

  test("overview responsive matrix", async ({ page }) => {
    for (const viewport of [
      { name: "tablet", width: 810, height: 1080 },
      { name: "mobile", width: 412, height: 915 },
      { name: "compact", width: 375, height: 667 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/#overview");
      await expect(page.locator("#overview")).toHaveScreenshot(`overview-${viewport.name}.png`, {
        animations: "disabled",
        caret: "hide",
        scale: "css",
      });
    }
  });
});
