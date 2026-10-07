import { test, expect } from "@playwright/test";

test("catalogue filters survive reload and render on the server", async ({
  page,
  request,
}) => {
  await page.goto("/ng");
  await expect(
    page.getByRole("heading", { name: "Big ideas. Beautifully branded." }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Service categories" })
    .getByRole("link", { name: "Prints", exact: true })
    .click();
  await page.getByLabel("Turnaround").selectOption("3");
  await expect(page).toHaveURL(/category=Prints.*urgency=3/);
  await expect(page.getByTestId("service-card")).toHaveCount(3);
  await page.reload();
  await expect(page.getByLabel("Turnaround")).toHaveValue("3");
  const response = await request.get("/ng?category=Prints&urgency=3");
  expect(await response.text()).toContain("Premium business cards");
  await page.getByLabel("Search services").fill("zzzzzzzzzzzz");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A fresh search could be the start." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByTestId("service-card")).toHaveCount(8);
  await page.getByRole("link", { name: "Next page", exact: true }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByTestId("service-card")).toHaveCount(8);
});

test("customer configures a service, edits the bag and confirms a demo order", async ({
  page,
}) => {
  await page.goto("/ng/services/branded-mugs");
  await page.getByRole("radio", { name: /Signature/ }).check();
  await page
    .getByRole("button", { name: "Increase quantity", exact: true })
    .click();
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await expect(
    page.getByText("Custom ceramic mugs added to your bag"),
  ).toBeVisible();
  await page.getByRole("link", { name: "Shopping bag, 2 items" }).click();
  await expect(page.getByTestId("subtotal")).toHaveText("₦20,800");
  await page
    .getByRole("button", { name: "Increase custom ceramic mugs quantity" })
    .click();
  await expect(page.getByTestId("total")).toHaveText("₦33,540");
  await page.reload();
  await expect(page.getByTestId("total")).toHaveText("₦33,540");
  await page.getByRole("link", { name: "Continue to checkout" }).click();
  await page.getByRole("button", { name: "Confirm demo order" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Please check",
  );
  await page.getByLabel("Full name").fill("Alex Morgan");
  await page.getByLabel("Email address").fill("alex@example.test");
  await page.getByLabel("Company / brand name").fill("Good Things Studio");
  await page.getByRole("button", { name: "Confirm demo order" }).click();
  await expect(page).toHaveURL(/\/ng\/confirmation$/);
  await expect(
    page.getByRole("heading", { name: "Looking good, already." }),
  ).toBeVisible();
  await expect(page.getByTestId("total")).toHaveText("₦33,540");
  await page.reload();
  await expect(page.getByText(/Order reference: BR-/)).toBeVisible();
  await page.getByRole("link", { name: "Shopping bag, 0 items" }).click();
  await expect(
    page.getByRole("heading", { name: "Your next big idea starts here." }),
  ).toBeVisible();
});

test("markets keep separate bags and show local currency", async ({ page }) => {
  await page.goto("/us/services/branded-mugs");
  await page.getByRole("button", { name: "Order now", exact: true }).click();
  await expect(page).toHaveURL(/\/us\/checkout$/);
  await expect(page.getByTestId("subtotal")).toHaveText("$18");
  await page.getByLabel("Country and currency").selectOption("uk");
  await expect(
    page.getByRole("heading", { name: "Your next big idea starts here." }),
  ).toBeVisible();
  await page.goto("/uk/services/branded-mugs");
  await expect(page.getByText("£14", { exact: true }).first()).toBeVisible();
  await page.getByLabel("Country and currency").selectOption("ca");
  await expect(page.getByText("$25", { exact: true }).first()).toBeVisible();
  await page.goto("/us/cart");
  await expect(page.getByTestId("subtotal")).toHaveText("$18");
  await page
    .getByRole("button", { name: "Remove Custom ceramic mugs" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your next big idea starts here." }),
  ).toBeVisible();
});

test("gallery and responsive navigation work without horizontal overflow", async ({
  page,
}, testInfo) => {
  await page.goto("/ng");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Studio", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
  await page.goto("/ng/services/brand-identity");
  await page.getByRole("button", { name: "Show detail image" }).click();
  await expect(
    page.getByRole("button", { name: "Show detail image" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Enlarge service image" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(page).toHaveTitle("Brand identity design in Nigeria | Branda");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Brand identity design in Nigeria",
  );
});

test("checkout validates inputs and never trusts client prices", async ({
  request,
}) => {
  const response = await request.post("/api/checkout", {
    data: {
      market: "us",
      contact: { name: "Alex Morgan", email: "alex@example.test" },
      items: [
        { slug: "branded-mugs", optionId: "essential", quantity: 2, price: 1 },
      ],
      total: 1,
    },
  });
  expect(response.status()).toBe(201);
  expect(await response.json()).toMatchObject({
    subtotal: 3600,
    tax: 288,
    total: 3888,
  });
  const invalid = await request.post("/api/checkout", {
    data: {
      market: "us",
      contact: { name: "Alex Morgan", email: "alex@example.test" },
      items: [{ slug: "branded-mugs", optionId: "essential", quantity: -1 }],
    },
  });
  expect(invalid.status()).toBe(400);
  const missing = await request.get("/xx/services/anything");
  expect(missing.status()).toBe(404);
});
