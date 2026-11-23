import { z } from "zod";
export const defaultCategories = [
  "Solar & power",
  "Smartphones",
  "Laptops",
  "Lifestyle",
] as const;
export const categoryNameSchema = z
  .string()
  .trim()
  .min(2)
  .max(60)
  .regex(/^[\p{L}\p{N}][\p{L}\p{N} &+,'/-]*$/u, "Use a clear category name.");
export const categorySchema = z.object({ name: categoryNameSchema });
export const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and hyphens for the URL.",
    ),
  name: z.string().trim().min(3).max(120),
  category: categoryNameSchema,
  description: z.string().trim().min(20).max(4000),
  price: z.number().int().min(100).max(10000000000),
  image: z
    .string()
    .regex(
      /^\/(?:products\/[a-z0-9-]+\.jpg|api\/media\/[a-f0-9]{24})$/,
      "Upload an image or choose an existing catalogue image.",
    ),
  specs: z.array(z.string().trim().min(1).max(160)).max(12),
  published: z.boolean(),
  purchasable: z.boolean(),
  stock: z.number().int().min(0).max(100000),
  featured: z.boolean().default(false),
});
export type Product = z.infer<typeof productSchema>;
export const cartItemSchema = z.object({
  slug: z.string().min(3).max(100),
  quantity: z.number().int().min(1).max(10),
});
export type CartItem = z.infer<typeof cartItemSchema>;
export const states = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;
export const orderInputSchema = z.object({
  idempotencyKey: z.uuid(),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    phone: z
      .string()
      .trim()
      .regex(
        /^(?:\+234|0)[789][01]\d{8}$/,
        "Enter a valid Nigerian mobile number.",
      ),
    email: z.email().max(200),
    address: z.string().trim().min(10).max(500),
    city: z.string().trim().min(2).max(100),
    state: z.enum(states),
    notes: z.string().trim().max(1000).default(""),
  }),
  items: z
    .array(cartItemSchema)
    .min(1)
    .max(30)
    .refine(
      (items) => new Set(items.map((item) => item.slug)).size === items.length,
      "Duplicate products are not allowed.",
    ),
  consent: z.literal(true, {
    error: "Please agree to the order and privacy terms.",
  }),
});
export const statuses = [
  "awaiting_delivery_quote",
  "awaiting_payment",
  "payment_submitted",
  "payment_rejected",
  "paid",
  "dispatched",
  "completed",
  "cancelled",
] as const;
export type OrderStatus = (typeof statuses)[number];
export const statusLabels: Record<OrderStatus, string> = {
  awaiting_delivery_quote: "Delivery quote pending",
  awaiting_payment: "Ready for bank transfer",
  payment_submitted: "Payment under review",
  payment_rejected: "Payment needs attention",
  paid: "Payment verified",
  dispatched: "On the way",
  completed: "Delivered",
  cancelled: "Cancelled",
};
export type OrderLine = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
};
export function priceOrder(items: CartItem[], products: Product[]) {
  return items.map((item) => {
    const parsed = cartItemSchema.parse(item);
    const product = products.find((p) => p.slug === parsed.slug);
    if (
      !product ||
      !product.published ||
      !product.purchasable ||
      product.stock < parsed.quantity
    )
      throw new Error(
        "A product is unavailable or its requested quantity exceeds available stock. Please review your cart.",
      );
    return {
      ...parsed,
      name: product.name,
      price: product.price,
      total: product.price * parsed.quantity,
    };
  });
}
export function canTransition(from: OrderStatus, to: OrderStatus) {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    awaiting_delivery_quote: ["awaiting_payment", "cancelled"],
    awaiting_payment: ["payment_submitted", "cancelled"],
    payment_submitted: ["paid", "payment_rejected", "cancelled"],
    payment_rejected: ["payment_submitted", "cancelled"],
    paid: ["dispatched"],
    dispatched: ["completed"],
    completed: [],
    cancelled: [],
  };
  return transitions[from].includes(to);
}
