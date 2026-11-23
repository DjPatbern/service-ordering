import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import type { OrderDocument } from "@/lib/server/orders";
import { statusLabels } from "@/features/store/schema";
import { AdminShell } from "@/features/admin/shell";
import { naira } from "@/lib/brand";
export const metadata = {
  title: "Manage orders",
  robots: { index: false, follow: false },
};
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  if (!(await getAdmin())) redirect("/admin/login");
  const db = await getDb();
  const collection = db.collection<OrderDocument>("orders");
  const total = await collection.countDocuments();
  const pages = Math.max(1, Math.ceil(total / 30));
  const page = Math.min(
    pages,
    Math.max(1, Math.floor(Number((await searchParams).page) || 1)),
  );
  const orders = await collection
    .find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * 30)
    .limit(30)
    .toArray();
  return (
    <AdminShell title="Your orders">
      <p className="mb-5 text-sm text-muted">
        {total} order requests · Open an order to confirm delivery, inspect
        payment proof and update fulfilment.
      </p>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-150 text-left text-xs">
          <thead className="bg-cream">
            <tr>
              {["Reference", "Customer", "State", "Status", "Total", ""].map(
                (h, i) => (
                  <th key={i} className="p-4 font-semibold">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id.toHexString()}
                className="border-t border-line"
              >
                <td className="p-4 font-bold">{order.reference}</td>
                <td className="p-4">{order.customer.name}</td>
                <td className="p-4">{order.customer.state}</td>
                <td className="p-4">{statusLabels[order.status]}</td>
                <td className="p-4">
                  {order.total === null ? "Quote pending" : naira(order.total)}
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="font-bold text-brand"
                  >
                    Review →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length && (
          <p className="p-8 text-center text-sm text-muted">
            No order requests yet. Publish a product with confirmed pricing and
            stock to enable checkout.
          </p>
        )}
      </div>
      <nav
        aria-label="Order pages"
        className="mt-5 flex justify-between text-sm"
      >
        {page > 1 ? (
          <Link href={`/admin?page=${page - 1}`}>← Previous</Link>
        ) : (
          <span />
        )}
        <span>
          {page} / {pages}
        </span>
        {page < pages ? (
          <Link href={`/admin?page=${page + 1}`}>Next →</Link>
        ) : (
          <span />
        )}
      </nav>
    </AdminShell>
  );
}
