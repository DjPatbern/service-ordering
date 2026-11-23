import { redirect, notFound } from "next/navigation";
import { getAdmin } from "@/lib/server/auth";
import { getCategories, getProducts } from "@/lib/server/catalog";
import { AdminShell } from "@/features/admin/shell";
import { ProductForm } from "@/features/admin/forms";
export const metadata = {
  title: "Edit product",
  robots: { index: false, follow: false },
};
export default async function Edit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await getAdmin())) redirect("/admin/login");
  const { slug } = await params;
  const categories = await getCategories();
  const product =
    slug === "new"
      ? undefined
      : (await getProducts(true)).find((p) => p.slug === slug);
  if (slug !== "new" && !product) notFound();
  return (
    <AdminShell title={product ? "Edit product" : "Add a product"}>
      <div className="max-w-3xl">
        <ProductForm product={product} categories={categories} />
      </div>
    </AdminShell>
  );
}
