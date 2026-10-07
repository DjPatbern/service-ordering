"use client";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Trash2,
  LockKeyhole,
} from "lucide-react";
import { useCart } from "../store";
import { calculateOrder, lineKey } from "../pricing";
import { markets, money, type Market } from "@/lib/markets";
import { Button, buttonVariants } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { OrderTotals } from "./order-totals";
export function EmptyCart({ market }: { market: Market }) {
  return (
    <div className="rounded-2xl border border-line bg-white px-6 py-18 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#edf0e3] text-brand">
        <ShoppingBag size={26} strokeWidth={1.4} />
      </span>
      <h2 className="mt-6 font-display text-3xl">
        Your next big idea starts here.
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
        Your bag is empty. Discover thoughtful services and find something that
        feels like your brand.
      </p>
      <Link
        href={`/${market}#services`}
        className={buttonVariants({ className: "mt-7" })}
      >
        Explore services <ArrowRight size={16} />
      </Link>
    </div>
  );
}
export function CartView({ market }: { market: Market }) {
  const items = useCart((state) => state.carts[market]);
  const hydrated = useCart((state) => state.hydrated);
  const setQuantity = useCart((state) => state.setQuantity);
  const remove = useCart((state) => state.remove);
  if (!hydrated)
    return (
      <div
        role="status"
        className="h-72 animate-pulse rounded-xl bg-stone-100 p-8 text-sm text-muted"
      >
        Opening your bag…
      </div>
    );
  if (!items.length) return <EmptyCart market={market} />;
  const order = calculateOrder(items, market);
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.65fr_1fr]">
      <div>
        <div className="mb-4 flex justify-between text-xs text-muted">
          <span>
            {items.length} {items.length === 1 ? "service" : "services"} in your
            bag
          </span>
          <span>
            {markets[market].flag} {markets[market].name}
          </span>
        </div>
        <ul className="divide-y divide-line rounded-xl border border-line bg-white px-4 sm:px-6">
          {order.lines.map((line) => (
            <li key={lineKey(line)} className="flex gap-4 py-6 sm:gap-6">
              <Link
                href={`/${market}/services/${line.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="shrink-0"
              >
                <Image
                  src={line.service.image}
                  alt=""
                  width={125}
                  height={110}
                  className="h-22 w-22 rounded-lg object-cover sm:h-28 sm:w-30"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-semibold tracking-widest text-brand uppercase">
                  {line.service.category}
                </span>
                <h2 className="mt-1 text-sm font-semibold">
                  <Link href={`/${market}/services/${line.slug}`}>
                    {line.service.name}
                  </Link>
                </h2>
                <p className="mt-1.5 text-xs text-muted">
                  {line.option.name} · {money(line.unitPrice, market)} each
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <QuantitySelector
                    value={line.quantity}
                    onChange={(quantity) =>
                      setQuantity(market, lineKey(line), quantity)
                    }
                    label={`${line.service.name} quantity`}
                  />
                  <p className="text-sm font-semibold">
                    {money(line.total, market)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-2 shrink-0 text-muted"
                aria-label={`Remove ${line.service.name}`}
                onClick={() => remove(market, lineKey(line))}
              >
                <Trash2 size={16} />
              </Button>
            </li>
          ))}
        </ul>
        <Link
          href={`/${market}#services`}
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-xs font-medium"
        >
          <ArrowLeft size={14} />
          Keep exploring
        </Link>
      </div>
      <aside className="rounded-xl border border-line bg-[#f1f2e9] p-6 lg:sticky lg:top-6">
        <h2 className="mb-6 font-display text-2xl">
          A little closer to what’s next.
        </h2>
        <OrderTotals {...order} market={market} />
        <Link
          href={`/${market}/checkout`}
          className={buttonVariants({ className: "mt-6 w-full" })}
        >
          Continue to checkout <ArrowRight size={16} />
        </Link>
        <p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted">
          <LockKeyhole size={12} />
          Demo checkout · No payment required
        </p>
        <p className="mt-5 border-t border-line pt-4 text-xs leading-5 text-muted">
          Your bag is saved separately for each market, so your local pricing
          stays clear.
        </p>
      </aside>
    </div>
  );
}
