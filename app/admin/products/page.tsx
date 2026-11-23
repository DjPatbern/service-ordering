import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/server/auth";
import { getProducts } from "@/lib/server/catalog";
import { AdminShell } from "@/features/admin/shell";
import { AdminAction } from "@/features/admin/forms";
import { buttonVariants } from "@/components/ui/button";
import { naira } from "@/lib/brand";
export const metadata = {
  title: "Manage products",
  robots: { index: false, follow: false },
};
export default async function Products() {
  if (!(await getAdmin())) redirect("/admin/login");
  const products = await getProducts(true);
  return (
    <AdminShell title="Your products">
      <div className="mb-7 flex flex-wrap gap-3">
        <Link href="/admin/products/new" className={buttonVariants()}>
          Add a product
        </Link>
        <AdminAction action="seed" label="Import supplied solar offers" />
      </div>
      <p className="mb-5 text-xs leading-6 text-muted">
        Import adds missing flyer products as enquiry-only; it does not
        overwrite existing edits. Enable checkout only after verifying current
        prices and stock.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.slug}
            className="rounded-xl border border-line p-5"
          >
            <p className="eyebrow text-[9px]">{product.category}</p>
            <h2 className="mt-3 text-base font-bold">{product.name}</h2>
            <p className="mt-3 text-sm">
              {naira(product.price)} · {product.stock} available
            </p>
            <p className="mt-2 text-xs text-muted">
              {product.published ? "Published" : "Draft"} ·{" "}
              {product.purchasable
                ? product.stock > 0
                  ? "Checkout enabled"
                  : "Checkout enabled · out of stock"
                : "Enquiry-only"}
            </p>
            {product.featured && (
              <p className="mt-3 inline-flex rounded-full bg-[#fff0f3] px-3 py-1 text-[10px] font-bold text-brand">
                Product of the Week
              </p>
            )}
            <Link
              href={`/admin/products/${product.slug}`}
              className="mt-5 inline-block text-sm font-bold text-brand"
            >
              Edit product →
            </Link>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
