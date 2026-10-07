import { z } from "zod";
import { cartLineSchema, lineKey } from "@/features/cart/pricing";
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(150).optional().default(""),
  brief: z
    .string()
    .trim()
    .max(2000, "Please keep your brief under 2,000 characters.")
    .optional()
    .default(""),
});
export const checkoutSchema = z.object({
  market: z.enum(["ng", "us", "uk", "ca"]),
  contact: contactSchema,
  items: z
    .array(cartLineSchema)
    .min(1, "Add a service before checking out.")
    .max(50)
    .refine(
      (items) => new Set(items.map(lineKey)).size === items.length,
      "Duplicate service options are not allowed.",
    ),
});
export const confirmationSchema = z.object({
  id: z.string(),
  market: z.enum(["ng", "us", "uk", "ca"]),
  createdAt: z.string(),
  subtotal: z.number().int().nonnegative(),
  tax: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  lines: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
      option: z.string(),
      quantity: z.number().int().positive(),
      total: z.number().int().nonnegative(),
    }),
  ),
});
export type Confirmation = z.infer<typeof confirmationSchema>;
