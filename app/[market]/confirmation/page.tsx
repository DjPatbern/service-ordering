import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isMarket } from "@/lib/markets";
import { ConfirmationView } from "@/features/checkout/confirmation-view";
export const metadata: Metadata = {
  title: "Order confirmation",
  robots: { index: false, follow: false },
};
export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isMarket(market)) notFound();
  return (
    <main id="main-content" className="page-shell min-h-[65vh] py-14">
      <ConfirmationView market={market} />
    </main>
  );
}
