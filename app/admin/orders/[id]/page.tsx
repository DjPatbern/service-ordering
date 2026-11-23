import Link from "next/link";
import Image from "next/image";
import { redirect, notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { getAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { accessToken, type OrderDocument } from "@/lib/server/orders";
import { statusLabels } from "@/features/store/schema";
import { AdminShell } from "@/features/admin/shell";
import { DeleteOrderButton, OrderActions } from "@/features/admin/forms";
import { naira } from "@/lib/brand";
export const metadata = {
  title: "Review order",
  robots: { index: false, follow: false },
};
export default async function Review({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getAdmin())) redirect("/admin/login");
  const { id } = await params;
  if (!ObjectId.isValid(id)) notFound();
  const order = await (
    await getDb()
  )
    .collection<OrderDocument>("orders")
    .findOne({ _id: new ObjectId(id) });
  if (!order) notFound();
  return (
    <AdminShell title={order.reference}>
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <section>
          <p className="mb-5 rounded-lg bg-cream p-4 text-sm font-bold">
            {statusLabels[order.status]}
          </p>
          <h2 className="text-lg font-bold">Customer & delivery</h2>
          <p className="mt-3 text-sm leading-7">
            {order.customer.name}
            <br />
            <a className="text-brand" href={`tel:${order.customer.phone}`}>
              {order.customer.phone}
            </a>
            <br />
            <a
              className="break-all text-brand"
              href={`mailto:${order.customer.email}`}
            >
              {order.customer.email}
            </a>
            <br />
            {order.customer.address}
            <br />
            {order.customer.city}, {order.customer.state}
          </p>
          {order.customer.notes && (
            <p className="mt-4 rounded-lg border border-line p-4 text-sm">
              Customer note: {order.customer.notes}
            </p>
          )}
          <h2 className="mt-7 text-lg font-bold">Items & total</h2>
          <ul className="mt-3 divide-y divide-line">
            {order.lines.map((line) => (
              <li
                key={line.slug}
                className="flex justify-between gap-3 py-3 text-sm"
              >
                <span>
                  {line.quantity} × {line.name}
                </span>
                <strong>{naira(line.total)}</strong>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            Delivery:{" "}
            {order.shipping === null ? "Not yet quoted" : naira(order.shipping)}
          </p>
          <p className="mt-3 text-xl font-bold">
            Total:{" "}
            {order.total === null ? "Awaiting quote" : naira(order.total)}
          </p>
          <Link
            href={`/orders/${accessToken(order.accessSeed)}`}
            target="_blank"
            className="mt-5 inline-block text-sm font-bold text-brand"
          >
            Open customer’s private order link ↗
          </Link>
          <p className="mt-2 text-xs leading-6 text-muted">
            Share this private link only with this customer. Contact them after
            confirming delivery; the site does not send automatic messages.
          </p>
          <OrderActions id={id} status={order.status} />
          <DeleteOrderButton id={id} reference={order.reference} />
        </section>
        <section className="rounded-xl border border-line p-6">
          <h2 className="text-lg font-bold">Payment coordination</h2>
          {order.proofId ? (
            <>
              <p className="mt-4 text-sm">Sender: {order.payerName}</p>
              <p className="mt-2 text-sm break-all">
                Transaction reference: {order.transferReference}
              </p>
              <a
                href={`/api/media/${order.proofId}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 block"
              >
                <Image
                  unoptimized
                  src={`/api/media/${order.proofId}`}
                  alt="Customer payment receipt — verify against actual bank credit"
                  width={800}
                  height={1000}
                  className="h-auto max-h-150 w-full rounded-lg object-contain"
                />
              </a>
              <p className="mt-3 text-xs leading-6 text-muted">
                Private receipt. Confirm funds directly in the bank account
                before marking this order paid.
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted">
              This order is completed with the customer on WhatsApp. Confirm the
              actual bank credit before marking it paid.
            </p>
          )}
          <h2 className="mt-8 text-lg font-bold">History</h2>
          <ol className="mt-4 space-y-4">
            {order.history.map((event, i) => (
              <li key={i} className="text-xs leading-6">
                <time className="block text-muted">
                  {new Date(event.at).toLocaleString("en-NG", {
                    timeZone: "Africa/Lagos",
                  })}
                </time>
                {event.message}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </AdminShell>
  );
}
