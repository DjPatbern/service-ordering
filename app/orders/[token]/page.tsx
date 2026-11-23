import { notFound } from "next/navigation";
import { Clock3, CheckCircle2 } from "lucide-react";
import { getOrderByToken } from "@/lib/server/orders";
import { statusLabels } from "@/features/store/schema";
import { CopyOrderLink, RefreshOrder } from "@/features/store/payment";
import { buttonVariants } from "@/components/ui/button";
import { naira, siteUrl, whatsappFor } from "@/lib/brand";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Your private order",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function OrderPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();
  const payable =
    order.status === "awaiting_payment" || order.status === "payment_rejected";
  return (
    <main id="main-content" className="page-shell max-w-5xl py-12">
      <p className="eyebrow">Your next upgrade</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        {statusLabels[order.status]}
      </h1>
      <p className="mt-4 text-sm text-muted">
        Order <strong className="text-ink">{order.reference}</strong> ·{" "}
        {new Date(order.createdAt).toLocaleDateString("en-NG", {
          timeZone: "Africa/Lagos",
          dateStyle: "medium",
        })}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <CopyOrderLink />
        <RefreshOrder />
      </div>
      <p className="mt-3 text-xs leading-6 text-muted">
        Keep this link private: it provides access to your order. Save it to
        check updates or upload your payment proof later.
      </p>
      {order.status === "awaiting_delivery_quote" && (
        <div className="mt-7 flex gap-3 rounded-xl bg-[#fff0f3] p-5">
          <Clock3 className="shrink-0 text-brand" size={22} />
          <div>
            <h2 className="text-sm font-bold">
              Your request is with our team.
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              We’ll confirm stock and the delivery charge, then contact you
              using the details you provided. Bank details appear here once the
              total is ready. Please don’t transfer yet.
            </p>
          </div>
        </div>
      )}
      {order.status === "payment_submitted" && (
        <div className="mt-7 flex items-center gap-3 rounded-xl bg-cream p-5 text-sm">
          <CheckCircle2 className="text-brand" size={22} />
          Receipt received. Payment is awaiting manual bank verification.
        </div>
      )}
      <section className="mt-7 rounded-xl border border-line p-5 sm:p-7">
        <h2 className="text-xl font-bold">Order summary</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.lines.map((line) => (
            <li
              key={line.slug}
              className="flex justify-between gap-4 py-4 text-sm"
            >
              <span>
                {line.name}
                <span className="mt-1 block text-xs text-muted">
                  {line.quantity} × {naira(line.price)}
                </span>
              </span>
              <strong>{naira(line.total)}</strong>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-3 border-t border-line pt-5 text-sm">
          <div className="flex justify-between">
            <dt>Products</dt>
            <dd>{naira(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>
              {order.shipping === null
                ? "Quote pending"
                : naira(order.shipping)}
            </dd>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <dt>Total</dt>
            <dd>
              {order.total === null
                ? "Pending delivery quote"
                : naira(order.total)}
            </dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-line pt-5 text-xs leading-6 text-muted">
          <strong className="text-ink">Deliver to {order.customer.name}</strong>
          <br />
          {order.customer.address}, {order.customer.city},{" "}
          {order.customer.state}
          <br />
          {order.customer.phone}
        </div>
      </section>
      {payable && order.total !== null && (
        <section className="mt-7 rounded-xl bg-ink p-6 text-white sm:p-8">
          <p className="text-xs font-bold tracking-widest text-white/60 uppercase">
            Complete in WhatsApp
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            Your confirmed total is {naira(order.total)}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">
            Continue with our team to confirm payment and delivery. Keep this
            tracking link private and return here for fulfilment updates.
          </p>
          <a
            href={whatsappFor(
              `Hi Zhoppin, I’m ready to complete order ${order.reference}. My confirmed total is ${naira(order.total)}. Tracking link: ${siteUrl}/orders/${token}`,
            )}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              className: "mt-6 bg-white text-ink hover:bg-white/90",
            })}
          >
            Continue order on WhatsApp
          </a>
        </section>
      )}
      <section className="mt-7 rounded-xl bg-cream p-6">
        <h2 className="text-lg font-bold">Order updates</h2>
        <ol className="mt-4 space-y-4">
          {order.history.map((event, index) => (
            <li key={index} className="border-l-2 border-brand/20 pl-4">
              <p className="text-xs leading-6">{event.message}</p>
              <time className="mt-1 block text-[10px] text-muted">
                {new Date(event.at).toLocaleString("en-NG", {
                  timeZone: "Africa/Lagos",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </time>
            </li>
          ))}
        </ol>
      </section>
      <a
        href={whatsappFor(
          `Hi Zhoppin, I have a question about order ${order.reference}.`,
        )}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-block text-sm font-bold text-brand"
      >
        Need a hand? Chat about this order →
      </a>
    </main>
  );
}
