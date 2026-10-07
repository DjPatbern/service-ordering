import { ImageResponse } from "next/og";
import { getService } from "@/features/catalog/repository";
import { isMarket, markets, money } from "@/lib/markets";
export const alt = "Explore creative services with Branda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({
  params,
}: {
  params: Promise<{ market: string; slug: string }>;
}) {
  const { market, slug } = await params;
  const service = await getService(slug);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px",
        background: "#eeefdc",
        color: "#28523b",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 30,
        }}
      >
        <span style={{ fontWeight: 700 }}>branda*</span>
        <span>
          {service?.category} /{" "}
          {isMarket(market) ? markets[market].name : "Branda"}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <span style={{ fontSize: 76, fontWeight: 700, letterSpacing: -3 }}>
          {service?.name || "A world of branding"}
        </span>
        <span style={{ fontSize: 30 }}>
          {service?.tagline || "Big ideas. Beautifully branded."}
        </span>
      </div>
      <div style={{ fontSize: 26 }}>
        {service && isMarket(market)
          ? `From ${money(service.prices[market], market)} · Thoughtfully made for your brand`
          : "Explore Branda"}
      </div>
    </div>,
    size,
  );
}
