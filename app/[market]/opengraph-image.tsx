import { ImageResponse } from "next/og";
import { isMarket, markets } from "@/lib/markets";
export const alt = "Branda — Big ideas. Beautifully branded.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const { market } = await params;
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
          fontSize: 32,
        }}
      >
        <span style={{ fontWeight: 700 }}>branda*</span>
        <span>
          {isMarket(market) ? markets[market].name : "Your branding ecosystem"}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 82,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        <span>Big ideas.</span>
        <span>Beautifully branded.</span>
      </div>
      <div style={{ fontSize: 24 }}>
        Digital · Gifts · Create · Studio · Prints
      </div>
    </div>,
    size,
  );
}
