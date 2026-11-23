"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { useCart } from "./cart";
import { states, type Product } from "./schema";
import { naira, brand } from "@/lib/brand";
import { Button, buttonVariants } from "@/components/ui/button";
export function Checkout({
  products,
  connected,
}: {
  products: Product[];
  connected: boolean;
}) {
  const items = useCart((s) => s.items);
  const ready = useCart((s) => s.ready);
  const clear = useCart((s) => s.clear);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const key = useRef("");
  if (!ready) return <p role="status">Preparing your checkout…</p>;
  if (!items.length)
    return (
      <div className="py-15 text-center">
        <h2 className="text-2xl font-bold">Your bag is empty.</h2>
        <Link href="/shop" className={buttonVariants({ className: "mt-5" })}>
          Explore the store
        </Link>
      </div>
    );
  const lines = items.map((item) => ({
    ...item,
    product: products.find((p) => p.slug === item.slug),
  }));
  const valid = lines.every(
    (line) => line.product?.purchasable && line.product.stock >= line.quantity,
  );
  const subtotal = lines.reduce(
    (sum, line) => sum + (line.product?.price || 0) * line.quantity,
    0,
  );
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    if (!key.current) key.current = crypto.randomUUID();
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: key.current,
          items,
          consent: form.get("consent") === "on",
          customer: Object.fromEntries(
            ["name", "phone", "email", "address", "city", "state", "notes"].map(
              (name) => [name, form.get(name)],
            ),
          ),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      try {
        sessionStorage.setItem("zhoppin-last-order", `/orders/${data.token}`);
      } catch {}
      clear();
      window.location.assign(data.whatsappUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
      setBusy(false);
    }
  }
  return (
    <form
      onSubmit={submit}
      className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]"
    >
      <section className="rounded-xl border border-line p-5 sm:p-8">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <MapPin size={20} className="text-brand" />
          Where’s your upgrade heading?
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          We’ll use these details to prepare your order, then continue with you
          on WhatsApp.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {[
            ["name", "Full name", "text", "name"],
            ["phone", "Phone / WhatsApp number", "tel", "tel"],
            ["email", "Email address", "email", "email"],
            ["city", "City / town", "text", "address-level2"],
          ].map(([name, label, type, auto]) => (
            <label key={name} className="text-xs font-semibold">
              {label} *
              <input
                name={name}
                type={type}
                autoComplete={auto}
                required
                maxLength={name === "email" ? 200 : 120}
                placeholder={name === "phone" ? "08133872007" : undefined}
                className="field mt-2"
              />
            </label>
          ))}
          <label className="text-xs font-semibold sm:col-span-2">
            Street address / nearest landmark *
            <textarea
              name="address"
              required
              minLength={10}
              maxLength={500}
              autoComplete="street-address"
              className="field mt-2"
              rows={3}
            />
          </label>
          <label className="text-xs font-semibold sm:col-span-2">
            State *
            <select
              name="state"
              required
              defaultValue=""
              className="field mt-2"
            >
              <option value="" disabled>
                Select your state
              </option>
              {states.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold sm:col-span-2">
            Anything we should know?{" "}
            <span className="font-normal text-muted">(optional)</span>
            <textarea
              name="notes"
              maxLength={1000}
              className="field mt-2"
              rows={3}
            />
          </label>
        </div>
        <label className="mt-6 flex items-start gap-3 text-xs leading-6">
          <input
            name="consent"
            type="checkbox"
            required
            className="mt-1 size-4 shrink-0 accent-brand"
          />
          <span>
            I agree to the{" "}
            <Link href="/privacy" className="text-brand underline">
              order and privacy terms
            </Link>{" "}
            and understand that delivery and stock will be confirmed before
            payment. My cart details and private tracking link will be sent to
            WhatsApp.
          </span>
        </label>
      </section>
      <aside className="rounded-xl bg-cream p-6">
        <h2 className="text-xl font-bold">Review your request</h2>
        <ul className="mt-4 divide-y divide-line">
          {lines.map((line) => (
            <li
              key={line.slug}
              className="flex justify-between gap-4 py-4 text-sm"
            >
              <span>
                {line.product?.name || "Unavailable product"}
                <span className="mt-1 block text-xs text-muted">
                  Qty {line.quantity}
                </span>
              </span>
              <strong className="shrink-0">
                {naira((line.product?.price || 0) * line.quantity)}
              </strong>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-5 font-bold">
          <span>Product subtotal</span>
          <span>{naira(subtotal)}</span>
        </div>
        <p className="mt-4 text-xs leading-6 text-muted">
          Delivery is confirmed on WhatsApp. Your private tracking page remains
          available for fulfilment updates. Product prices are as listed; no
          extra tax is added by this checkout.
        </p>
        <div className="mt-5 rounded-lg bg-white p-4 text-xs leading-6 text-muted">
          1. Create your order
          <br />
          2. Review the prepared cart message in WhatsApp
          <br />
          3. Confirm delivery and complete your order in chat
        </div>
        {!connected && (
          <p className="mt-4 text-sm text-brand">
            Online checkout is being connected. Please{" "}
            <a href={brand.whatsapp} className="underline">
              contact us on WhatsApp
            </a>{" "}
            to order.
          </p>
        )}
        {!valid && (
          <p className="mt-4 text-sm text-brand">
            Some items are no longer ready to order.{" "}
            <Link href="/cart" className="underline">
              Review your bag.
            </Link>
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-brand">
            {error}
          </p>
        )}
        <Button
          type="submit"
          disabled={busy || !connected || !valid}
          className="mt-6 w-full"
        >
          <MessageCircle size={16} />
          {busy ? "Preparing WhatsApp…" : "Continue order on WhatsApp"}
          <ArrowRight size={15} />
        </Button>
        <p className="mt-3 text-center text-[10px] text-muted">
          WhatsApp opens with your cart and private tracking link ready to send.
        </p>
      </aside>
    </form>
  );
}
