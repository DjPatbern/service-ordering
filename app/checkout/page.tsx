import { getProducts } from "@/lib/server/catalog";
import { databaseConfigured } from "@/lib/server/db";
import { Checkout } from "@/features/store/checkout";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};
export default async function CheckoutPage() {
  return (
    <main id="main-content" className="page-shell min-h-[65vh] py-12">
      <p className="eyebrow">One step closer</p>
      <h1 className="mt-3 mb-8 text-4xl font-bold tracking-tight">
        Let’s get the details right.
      </h1>
      <Checkout
        products={await getProducts()}
        connected={databaseConfigured()}
      />
    </main>
  );
}
