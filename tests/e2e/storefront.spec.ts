import { expect, test } from "@playwright/test";

test("landing page explains the store and leads to products", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Your next upgrade starts right here." }),
  ).toBeVisible();
  await expect(page.getByText("Transparent pricing")).toBeVisible();
  await page.getByRole("link", { name: "Explore the store" }).first().click();
  await expect(page).toHaveURL(/\/shop$/);
  await expect
    .poll(() => page.getByTestId("product-card").count())
    .toBeGreaterThanOrEqual(5);
});

test("supplied solar products remain enquiry-only", async ({ page }) => {
  await page.goto("/shop/itel-power-tank-500w");
  await expect(
    page.getByRole("heading", { name: "itel Power Tank 500W" }),
  ).toBeVisible();
  await expect(
    page.getByText("Advertised price — confirm before ordering"),
  ).toBeVisible();
  const enquiry = page.getByRole("link", { name: "Enquire on WhatsApp" });
  await expect(enquiry).toHaveAttribute("href", /wa\.me\/2348133872007/);
  await expect(page.getByRole("button", { name: "Add to bag" })).toHaveCount(0);
});

test("an in-stock checkout-enabled product can be added to the bag", async ({
  page,
}) => {
  await page.goto("/shop");
  const readyCard = page
    .getByTestId("product-card")
    .filter({ hasText: "Ready to order" })
    .first();
  test.skip(
    (await readyCard.count()) === 0,
    "No in-stock checkout product in this catalogue",
  );
  await readyCard
    .getByRole("link", { name: /^View /i })
    .last()
    .click();
  const add = page.getByRole("button", { name: "Add to bag" });
  await expect(add).toBeEnabled();
  await add.click();
  await expect(
    page.getByRole("link", { name: /Shopping bag, 1 items/i }),
  ).toBeVisible();
});

test("featured CTA and product search retain readable spacing", async ({
  page,
}) => {
  await page.goto("/");
  const weekly = page.getByRole("link", { name: /View this week’s pick/i });
  if (await weekly.count()) {
    await expect(weekly).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(weekly).toHaveCSS("color", "rgb(24, 24, 27)");
  }
  await page.goto("/shop");
  const padding = await page
    .getByLabel("Search products")
    .evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).paddingLeft),
    );
  expect(padding).toBeGreaterThanOrEqual(40);
});

test("search, category filters and empty states use shareable URLs", async ({
  page,
}) => {
  await page.goto("/shop");
  await page.getByLabel("Search products").fill("MECO");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/q=MECO/);
  await expect
    .poll(() => page.getByTestId("product-card").count())
    .toBeGreaterThanOrEqual(2);
  await page.getByLabel("Search products").fill("nonexistent phone model");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(
    page.getByRole("heading", { name: "Looking for something specific?" }),
  ).toBeVisible();
});

test("mobile layout and navigation avoid horizontal overflow", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Shop products" })
    .click();
  await expect(page).toHaveURL(/\/shop$/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("private and admin routes are excluded from search indexing", async ({
  request,
}) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /admin/");
  expect(robots).toContain("Disallow: /orders/");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toMatch(/<loc>https?:\/\/[^<]+\/shop<\/loc>/);
  expect(sitemap).not.toContain("/admin");
});
