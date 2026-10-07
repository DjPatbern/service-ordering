"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
import { useCart } from "@/features/cart/store";
import { calculateOrder, lineKey } from "@/features/cart/pricing";
import { OrderTotals } from "@/features/cart/components/order-totals";
import { EmptyCart } from "@/features/cart/components/cart-view";
import { money, markets, type Market } from "@/lib/markets";
import { Button } from "@/components/ui/button";
import { contactSchema, confirmationSchema } from "./schema";
export function CheckoutView({ market }: { market: Market }) {
  const items = useCart((state) => state.carts[market]);
  const hydrated = useCart((state) => state.hydrated);
  const clear = useCart((state) => state.clear);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  if (!hydrated)
    return (
      <p role="status" className="py-20 text-muted">
        Preparing your order summary…
      </p>
    );
  if (!items.length) return <EmptyCart market={market} />;
  const order = calculateOrder(items, market);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError("");
    setFieldErrors({});
    const form = new FormData(event.currentTarget);
    const parsed = contactSchema.safeParse(Object.fromEntries(form.entries()));
    if (!parsed.success) {
      const errors = Object.fromEntries(
        parsed.error.issues.map((issue) => [
          String(issue.path[0]),
          issue.message,
        ]),
      );
      setFieldErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ market, contact: parsed.data, items }),
      });
      const data: unknown = await response.json();
      if (!response.ok)
        throw new Error(
          typeof data === "object" && data && "error" in data
            ? String(data.error)
            : "We couldn’t confirm your order. Please try again.",
        );
      const confirmation = confirmationSchema.parse(data);
      // Keep only a receipt, never the customer's contact details, in this tab.
      sessionStorage.setItem(
        `branda-confirmation-${market}`,
        JSON.stringify(confirmation),
      );
      clear(market);
      router.push(`/${market}/confirmation`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]"
      noValidate
    >
      <section className="rounded-xl border border-line bg-white p-5 sm:p-8">
        <h2 className="font-display text-2xl">
          A few details, then you’re all set.
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Tell us a little about the person and the idea behind the brand.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          {[
            {
              name: "name",
              label: "Full name",
              type: "text",
              autocomplete: "name",
              placeholder: "Alex Morgan",
            },
            {
              name: "email",
              label: "Email address",
              type: "email",
              autocomplete: "email",
              placeholder: "alex@yourbrand.com",
            },
            {
              name: "company",
              label: "Company / brand name",
              type: "text",
              autocomplete: "organization",
              placeholder: "Your next big thing",
            },
          ].map((field) => (
            <div
              key={field.name}
              className={field.name === "company" ? "sm:col-span-2" : ""}
            >
              <label
                htmlFor={field.name}
                className="mb-2 block text-xs font-semibold"
              >
                {field.label}{" "}
                {field.name === "company" ? (
                  <span className="font-normal text-muted">(optional)</span>
                ) : (
                  <span className="text-brand">*</span>
                )}
              </label>
              <input
                className="field"
                id={field.name}
                name={field.name}
                type={field.type}
                autoComplete={field.autocomplete}
                placeholder={field.placeholder}
                required={field.name !== "company"}
                maxLength={field.name === "email" ? 200 : 150}
                aria-invalid={!!fieldErrors[field.name]}
                aria-describedby={
                  fieldErrors[field.name] ? `${field.name}-error` : undefined
                }
              />
              {fieldErrors[field.name] && (
                <p
                  id={`${field.name}-error`}
                  className="mt-2 text-xs text-red-700"
                >
                  {fieldErrors[field.name]}
                </p>
              )}
            </div>
          ))}
          <div className="sm:col-span-2">
            <label htmlFor="brief" className="mb-2 block text-xs font-semibold">
              What do you have in mind?{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="brief"
              name="brief"
              rows={4}
              maxLength={2000}
              placeholder="A little about your brand, your goals or a deadline you’re working towards…"
              className="field resize-y"
              aria-invalid={!!fieldErrors.brief}
              aria-describedby={fieldErrors.brief ? "brief-error" : undefined}
            />
            {fieldErrors.brief && (
              <p id="brief-error" className="mt-2 text-xs text-red-700">
                {fieldErrors.brief}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-[#f2f4e9] p-4">
          <ShieldCheck className="mt-0.5 shrink-0 text-brand" size={18} />
          <p className="text-xs leading-6 text-muted">
            You’re exploring a demo. No payment will be taken, no services will
            be booked and your contact details won’t be saved or emailed.
          </p>
        </div>
        <Link
          href={`/${market}/cart`}
          className="mt-6 inline-flex items-center gap-2 text-xs font-medium"
        >
          <ArrowLeft size={14} />
          Back to your bag
        </Link>
      </section>
      <aside className="rounded-xl border border-line bg-[#f1f2e9] p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Your order</h2>
          <span className="text-xs">
            {markets[market].flag} {markets[market].currency}
          </span>
        </div>
        <ul className="my-6 divide-y divide-line">
          {order.lines.map((line) => (
            <li key={lineKey(line)} className="flex gap-3 py-4">
              <Image
                src={line.service.image}
                alt=""
                width={64}
                height={64}
                className="size-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-xs font-semibold">{line.service.name}</p>
                <p className="mt-1 text-[11px] text-muted">
                  {line.option.name} · Qty {line.quantity}
                </p>
                <p className="mt-2 text-xs font-semibold">
                  {money(line.total, market)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <OrderTotals {...order} market={market} />
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {Object.keys(fieldErrors).length > 0 && (
          <p role="alert" className="mt-4 text-xs text-red-700">
            Please check the highlighted contact details.
          </p>
        )}
        <Button type="submit" disabled={submitting} className="mt-6 w-full">
          {submitting ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Confirming your order…
            </>
          ) : (
            <>
              Confirm demo order <ArrowRight size={16} />
            </>
          )}
        </Button>
        <p className="mt-3 text-center text-[10px] leading-5 text-muted">
          No payment details needed. Just a glimpse of what’s next.
        </p>
      </aside>
    </form>
  );
}
