import { z } from "zod";
import { services } from "@/features/catalog/data";
import { markets, type Market } from "@/lib/markets";
import type { Service } from "@/features/catalog/types";
export const cartLineSchema = z.object({
  slug: z.string().min(1),
  optionId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});
export type CartLine = z.infer<typeof cartLineSchema>;
export const lineKey = (line: Pick<CartLine, "slug" | "optionId">) =>
  `${line.slug}:${line.optionId}`;
export function unitPrice(service: Service, optionId: string, market: Market) {
  const option = service.options.find((option) => option.id === optionId);
  if (!option) throw new Error("This service option is no longer available.");
  return Math.round(service.prices[market] * option.multiplier);
}
export function calculateOrder(items: CartLine[], market: Market) {
  const lines = items.map((item) => {
    const parsed = cartLineSchema.parse(item);
    const service = services.find((service) => service.slug === parsed.slug);
    if (!service)
      throw new Error("A service in your cart is no longer available.");
    const option = service.options.find(
      (option) => option.id === parsed.optionId,
    );
    if (!option) throw new Error("A service option is no longer available.");
    const price = unitPrice(service, option.id, market);
    return {
      ...parsed,
      service,
      option,
      unitPrice: price,
      total: price * parsed.quantity,
    };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const tax = Math.round(subtotal * markets[market].taxRate);
  return { lines, subtotal, tax, total: subtotal + tax };
}
