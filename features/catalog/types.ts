import type { Market } from "@/lib/markets";
export const categories = [
  "Digital",
  "Gifts",
  "Create",
  "Studio",
  "Prints",
] as const;
export type Category = (typeof categories)[number];
export const useCases = [
  "Brand launch",
  "Everyday essentials",
  "Events",
  "Team & clients",
] as const;
export const industries = [
  "All businesses",
  "Food & hospitality",
  "Fashion & lifestyle",
  "Tech & startups",
] as const;
export type ServiceOption = {
  id: string;
  name: string;
  multiplier: number;
  detail: string;
};
export type Service = {
  slug: string;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  prices: Record<Market, number>;
  image: string;
  gallery: string[];
  days: number;
  popularity: number;
  useCase: (typeof useCases)[number];
  industry: (typeof industries)[number];
  included: string[];
  options: ServiceOption[];
  badge?: string;
  discount?: number;
};
