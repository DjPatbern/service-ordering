import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/server/auth";
import { LoginForm } from "@/features/admin/forms";
export const metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};
export default async function Login() {
  if (await getAdmin()) redirect("/admin");
  const configured = Boolean(
    process.env.MONGODB_URI &&
    process.env.ADMIN_EMAIL &&
    process.env.ADMIN_PASSWORD_HASH &&
    process.env.AUTH_SECRET,
  );
  return (
    <main id="main-content" className="page-shell min-h-[65vh] py-15">
      <section className="mx-auto max-w-md rounded-2xl border border-line p-7 sm:p-9">
        <p className="eyebrow">For the team behind the store</p>
        <h1 className="mt-4 text-3xl font-bold">Welcome back.</h1>
        <p className="mt-3 text-sm text-muted">
          Sign in to manage products, orders and payments.
        </p>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="mt-6 rounded-lg bg-cream p-4 text-sm leading-6 text-muted">
            Admin access is not connected yet. The store owner needs to
            configure the database and admin credentials using the setup guide.
          </p>
        )}
      </section>
    </main>
  );
}
