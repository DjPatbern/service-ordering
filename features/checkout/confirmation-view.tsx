"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Check, ReceiptText } from "lucide-react";
import { confirmationSchema } from "./schema";
import { money, type Market } from "@/lib/markets";
import { buttonVariants } from "@/components/ui/button";
import { OrderTotals } from "@/features/cart/components/order-totals";
const subscribe = () => () => {};
export function ConfirmationView({ market }: { market: Market }) {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return sessionStorage.getItem(`branda-confirmation-${market}`) || "";
      } catch {
        return "";
      }
    },
    () => null,
  );
  if (raw === null)
    return (
      <p role="status" className="py-20 text-center text-muted">
        Opening your confirmation…
      </p>
    );
  let data: unknown;
  try {
    data = JSON.parse(raw || "null");
  } catch {
    data = null;
  }
  const parsed = confirmationSchema.safeParse(data);
  if (!parsed.success || parsed.data.market !== market)
    return (
      <section className="py-16 text-center">
        <ReceiptText className="mx-auto text-brand" size={35} />
        <h1 className="mt-5 font-display text-4xl">
          Your next chapter is still unwritten.
        </h1>
        <p className="mt-4 text-sm text-muted">
          There isn’t a confirmed order in this tab yet.
        </p>
        <Link
          href={`/${market}#services`}
          className={buttonVariants({ className: "mt-6" })}
        >
          Explore services
        </Link>
      </section>
    );
  const order = parsed.data;
  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="mx-auto grid size-18 place-items-center rounded-full bg-[#e5ecd7] text-brand">
          <Check size={32} />
        </span>
        <p className="mt-6 text-[10px] font-semibold tracking-[2px] text-brand uppercase">
          A big idea. One step closer.
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">
          Looking good, already.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">
          Your demo order is confirmed. This is a preview of the Branda
          experience — no payment was taken or services booked.
        </p>
        <p className="mt-4 text-xs font-semibold">
          Order reference: {order.id}
        </p>
      </div>
      <section className="mt-8 rounded-xl border border-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-2xl">Your brand’s next chapter</h2>
        <ul className="my-5 divide-y divide-line">
          {order.lines.map((line) => (
            <li
              key={`${line.slug}-${line.option}`}
              className="flex justify-between gap-4 py-4"
            >
              <div>
                <p className="text-sm font-semibold">{line.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {line.option} · Qty {line.quantity}
                </p>
              </div>
              <span className="text-sm font-medium">
                {money(line.total, market)}
              </span>
            </li>
          ))}
        </ul>
        <OrderTotals {...order} market={market} />
      </section>
      <div className="mt-7 text-center">
        <Link href={`/${market}#services`} className={buttonVariants()}>
          Keep the ideas coming <ArrowRight size={16} />
        </Link>
        <p className="mt-4 text-xs text-muted">
          This receipt is available in this browser tab. No email is sent.
        </p>
      </div>
    </div>
  );
}
