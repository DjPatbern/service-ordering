import Fuse from "fuse.js";
import { z } from "zod";
import type { Market } from "@/lib/markets";
import { categories, industries, useCases, type Service } from "./types";
export const filterSchema = z.object({
  q: z.string().trim().max(100).catch(""),
  category: z.enum(["All", ...categories]).catch("All"),
  useCase: z.enum(["All", ...useCases]).catch("All"),
  industry: z.enum(["All", ...industries]).catch("All"),
  urgency: z.enum(["All", "3", "5", "7"]).catch("All"),
  sort: z.enum(["popular", "price-asc", "price-desc"]).catch("popular"),
  page: z.coerce.number().int().min(1).max(1000).catch(1),
});
export type Filters = z.infer<typeof filterSchema>;
export type SearchParams = Record<string, string | string[] | undefined>;
export function parseFilters(params: SearchParams): Filters {
  return filterSchema.parse(
    Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value,
      ]),
    ),
  );
}
export const PAGE_SIZE = 8;
export function queryServices(
  services: Service[],
  filters: Filters,
  market: Market,
) {
  let result = filters.q
    ? new Fuse(services, {
        keys: [{ name: "name", weight: 3 }, "category", "tagline", "useCase"],
        threshold: 0.35,
        ignoreLocation: true,
      })
        .search(filters.q)
        .map(({ item }) => item)
    : [...services];
  result = result.filter(
    (service) =>
      (filters.category === "All" || service.category === filters.category) &&
      (filters.useCase === "All" || service.useCase === filters.useCase) &&
      (filters.industry === "All" ||
        service.industry === filters.industry ||
        service.industry === "All businesses") &&
      (filters.urgency === "All" || service.days <= Number(filters.urgency)),
  );
  result.sort((a, b) =>
    filters.sort === "price-asc"
      ? a.prices[market] - b.prices[market]
      : filters.sort === "price-desc"
        ? b.prices[market] - a.prices[market]
        : b.popularity - a.popularity,
  );
  const total = result.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(filters.page, pages);
  return {
    services: result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total,
    pages,
    page,
  };
}
