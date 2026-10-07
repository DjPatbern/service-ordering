import type { Metadata } from "next";
import { Toaster } from "sonner";
import { CartProvider } from "@/features/cart/store";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Branda — Big ideas. Beautifully branded.",
    template: "%s | Branda",
  },
  description:
    "Your complete branding ecosystem. Discover design, digital, gifts, studio and print services made for your next big move.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only fixed top-3 left-3 z-100 rounded-lg bg-brand px-4 py-3 text-white focus:not-sr-only"
        >
          Skip to content
        </a>
        <CartProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
