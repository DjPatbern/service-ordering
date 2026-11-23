import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/server/auth";
import { getCategories } from "@/lib/server/catalog";
import { AdminShell } from "@/features/admin/shell";
import { CategoryManager } from "@/features/admin/forms";

export const metadata = {
  title: "Manage categories",
  robots: { index: false, follow: false },
};

export default async function CategoriesPage() {
  if (!(await getAdmin())) redirect("/admin/login");
  return (
    <AdminShell title="Product categories">
      <CategoryManager categories={await getCategories()} />
    </AdminShell>
  );
}
