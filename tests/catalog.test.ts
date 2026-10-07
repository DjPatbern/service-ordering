import { catalogHref } from "@/features/catalog/urls";
import { describe, expect, it } from "vitest";
import { services } from "@/features/catalog/data";
import { parseFilters, queryServices } from "@/features/catalog/query";
describe("server catalogue queries", () => {
  it("normalizes invalid URLs into usable defaults", () => {
    expect(
      parseFilters({ page: "-2", sort: "unknown", category: "invalid" }),
    ).toMatchObject({ page: 1, sort: "popular", category: "All", q: "" });
    expect(parseFilters({ category: ["Gifts", "Create"] }).category).toBe(
      "Gifts",
    );
  });
  it("finds a service even when its name is misspelled", () => {
    expect(
      queryServices(
        services,
        parseFilters({ q: "ceramc mugs" }),
        "ng",
      ).services.map((service) => service.slug),
    ).toContain("branded-mugs");
  });
  it("combines category, use case and urgency filters", () => {
    const result = queryServices(
      services,
      parseFilters({
        category: "Prints",
        useCase: "Everyday essentials",
        urgency: "3",
      }),
      "ng",
    );
    expect(result.total).toBe(3);
    expect(
      result.services.every(
        (service) => service.category === "Prints" && service.days <= 3,
      ),
    ).toBe(true);
  });
  it("sorts using the selected market's prices", () => {
    const result = queryServices(
      services,
      parseFilters({ sort: "price-asc" }),
      "us",
    );
    const prices = result.services.map((service) => service.prices.us);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(result.services[0].slug).toBe("branded-mugs");
  });
  it("clamps pagination to the last available page", () => {
    const result = queryServices(services, parseFilters({ page: "99" }), "ng");
    expect(result.page).toBe(3);
    expect(result.services).toHaveLength(4);
  });
  it("returns an empty result without invalid pagination", () => {
    const result = queryServices(
      services,
      parseFilters({ q: "zzzzzzzzzzzz" }),
      "ng",
    );
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
  });
  it("round trips shareable query parameters", () => {
    const href = catalogHref("uk", {
      category: "Gifts",
      useCase: "Team & clients",
      page: 2,
    });
    expect(
      parseFilters(
        Object.fromEntries(new URL(href, "https://example.test").searchParams),
      ),
    ).toMatchObject({ category: "Gifts", useCase: "Team & clients", page: 2 });
  });
});
