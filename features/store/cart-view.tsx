"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "./cart";
import type { Product } from "./schema";
import { naira } from "@/lib/brand";
import { buttonVariants } from "@/components/ui/button";
export function CartView({ products }: { products: Product[] }) {
  const items = useCart((s) => s.items);
  const ready = useCart((s) => s.ready);
  const change = useCart((s) => s.change);
  const remove = useCart((s) => s.remove);
  if (!ready)
    return (
      <p role="status" className="py-16 text-muted">
        Opening your bag…
      </p>
    );
  if (!items.length)
    return (
      <div className="rounded-xl border border-line bg-cream py-16 text-center">
        <ShoppingBag size={35} className="mx-auto text-brand" />
        <h2 className="mt-5 text-2xl font-bold">
          Your next upgrade is waiting.
        </h2>
        <p className="mt-3 text-sm text-muted">
          Your bag is empty. Let’s find something good.
        </p>
        <Link href="/shop" className={buttonVariants({ className: "mt-6" })}>
          Explore the store
          <ArrowRight size={16} />
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
  return (
    <div className="grid items-start gap-7 lg:grid-cols-[1.5fr_1fr]">
      <ul className="divide-y divide-line rounded-xl border border-line px-4 sm:px-6">
        {lines.map((line) => (
          <li key={line.slug} className="flex gap-3 py-6">
            {line.product && (
              <Image
                src={line.product.image}
                alt=""
                width={90}
                height={100}
                className="h-22 w-18 rounded-lg object-cover object-top sm:w-24"
              />
            )}
            <div className="flex-1">
              <Link href={`/shop/${line.slug}`} className="text-sm font-bold">
                {line.product?.name || "Unavailable product"}
              </Link>
              <p className="mt-2 text-xs text-muted">
                {line.product ? naira(line.product.price) : "Price unavailable"}
              </p>
              {(!line.product?.purchasable ||
                line.product.stock < line.quantity) && (
                <p className="mt-2 text-xs text-brand">
                  Please remove this item or reduce its quantity. Current stock
                  cannot fulfil it.
                </p>
              )}
              <label className="mt-3 flex items-center gap-2 text-xs">
                Qty
                <select
                  aria-label={`Quantity for ${line.product?.name || line.slug}`}
                  className="rounded border border-line p-2"
                  value={line.quantity}
                  onChange={(e) => change(line.slug, Number(e.target.value))}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </label>
            </div>
            <button
              aria-label={`Remove ${line.product?.name || line.slug}`}
              onClick={() => remove(line.slug)}
              className="grid size-10 shrink-0 place-items-center text-muted"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
      <aside className="rounded-xl bg-cream p-6">
        <h2 className="text-xl font-bold">Your order at a glance</h2>
        <div className="mt-6 flex justify-between text-sm">
          <span>Product subtotal</span>
          <strong>{naira(subtotal)}</strong>
        </div>
        <div className="mt-4 flex justify-between gap-3 text-sm">
          <span>Delivery</span>
          <span className="text-right text-muted">Quoted before payment</span>
        </div>
        <p className="mt-5 border-t border-line pt-5 text-xs leading-6 text-muted">
          Send your delivery details first. We’ll confirm stock and the complete
          total before you transfer any money.
        </p>
        {valid ? (
          <Link
            href="/checkout"
            className={buttonVariants({ className: "mt-5 w-full" })}
          >
            Continue to checkout
            <ArrowRight size={16} />
          </Link>
        ) : (
          <p className="mt-5 text-sm font-semibold text-brand">
            Please review unavailable items to continue.
          </p>
        )}
      </aside>
    </div>
  );
}
