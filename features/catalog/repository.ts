import { cache } from "react";
import { services } from "./data";
import { queryServices, type Filters } from "./query";
import type { Market } from "@/lib/markets";
// Async adapter: replace with a CMS/database without changing page components.
export const getService = cache(async (slug: string) =>
  services.find((service) => service.slug === slug),
);
export async function getServices(filters: Filters, market: Market) {
  return queryServices(services, filters, market);
}
export async function getRecommendations(slug: string) {
  const service = await getService(slug);
  if (!service) return [];
  const others = services.filter((item) => item.slug !== slug);
  return [
    ...others.filter((item) => item.category === service.category).slice(0, 1),
    ...others
      .filter(
        (item) =>
          item.category !== service.category &&
          (item.useCase === service.useCase || item.popularity > 85),
      )
      .slice(0, 3),
  ];
}
