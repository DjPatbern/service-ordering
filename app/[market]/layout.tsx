import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isMarket, marketCodes } from "@/lib/markets";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
export function generateStaticParams() {
  return marketCodes.map((market) => ({ market }));
}
export default async function MarketLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
  if (!isMarket(market)) notFound();
  return (
    <>
      <Suspense fallback={<div className="h-30 border-b border-line" />}>
        <Header market={market} />
      </Suspense>
      {children}
      <Footer market={market} />
    </>
  );
}
