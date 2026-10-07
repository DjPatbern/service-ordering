import type { Market } from "@/lib/markets";
import type { Filters } from "./query";

export function catalogHref(market: Market, filters: Partial<Filters> = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (
      value !== undefined &&
      value !== "" &&
      value !== "All" &&
      !(key === "sort" && value === "popular") &&
      !(key === "page" && value === 1)
    )
      params.set(key, String(value));
  }
  return `/${market}${params.size ? `?${params}` : ""}`;
}
