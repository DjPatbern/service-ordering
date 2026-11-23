import { getProducts } from "@/lib/server/catalog";
import { CartView } from "@/features/store/cart-view";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Your bag",
  robots: { index: false, follow: false },
};
export default async function Cart() {
  return (
    <main id="main-content" className="page-shell min-h-[65vh] py-12">
      <p className="eyebrow">Good choices, coming together</p>
      <h1 className="mt-3 mb-8 text-4xl font-bold tracking-tight">
        Your shopping bag.
      </h1>
      <CartView products={await getProducts()} />
    </main>
  );
}
