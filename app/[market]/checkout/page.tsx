import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isMarket } from "@/lib/markets";
import { CheckoutView } from "@/features/checkout/checkout-view";
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};
export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isMarket(market)) notFound();
  return (
    <main id="main-content" className="page-shell min-h-[65vh] py-12">
      <p className="text-[10px] font-semibold tracking-[2px] text-brand uppercase">
        The start of something good
      </p>
      <h1 className="mt-3 mb-8 font-display text-4xl sm:text-5xl">
        Make it official.
      </h1>
      <CheckoutView market={market} />
    </main>
  );
}
