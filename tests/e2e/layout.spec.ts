import { test, expect } from "@playwright/test";

test("catalogue and ordering layouts fit small phones, tablets and desktops", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Viewport sizes are explicitly covered in this test.",
  );
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/ng");
    await expect(
      page.getByRole("heading", { name: "Big ideas. Beautifully branded." }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.screenshot({
      path: testInfo.outputPath(`catalogue-${width}.png`),
      fullPage: true,
      scale: "css",
    });
    if (width < 1280) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.getByRole("button", { name: "Close navigation" }).click();
    }
    await page.goto("/ng/services/brand-identity");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.screenshot({
      path: testInfo.outputPath(`detail-${width}.png`),
      fullPage: true,
      scale: "css",
    });
    await page.getByRole("button", { name: "Order now", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Your order", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.screenshot({
      path: testInfo.outputPath(`checkout-${width}.png`),
      fullPage: true,
      scale: "css",
    });
  }
  expect(errors).toEqual([]);
});
