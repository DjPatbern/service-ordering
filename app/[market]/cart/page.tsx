import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isMarket } from "@/lib/markets";
import { CartView } from "@/features/cart/components/cart-view";
export const metadata: Metadata = {
  title: "Your bag",
  robots: { index: false, follow: false },
};
export default async function CartPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isMarket(market)) notFound();
  return (
    <main id="main-content" className="page-shell min-h-[65vh] py-12">
      <p className="text-[10px] font-semibold tracking-[2px] text-brand uppercase">
        Good things, coming together
      </p>
      <h1 className="mt-3 mb-8 font-display text-4xl sm:text-5xl">
        Your bag of possibilities.
      </h1>
      <CartView market={market} />
    </main>
  );
}
