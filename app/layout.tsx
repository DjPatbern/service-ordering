import type { Metadata } from "next";
import { Toaster } from "sonner";
import { StoreProvider } from "@/features/store/cart";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { brand, siteUrl } from "@/lib/brand";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "zhoppin.ng — Your next upgrade starts here",
    template: "%s | zhoppin.ng",
  },
  description: brand.description,
  referrer: "no-referrer",
  openGraph: {
    title: "zhoppin.ng — Your next upgrade starts here",
    description: brand.description,
    siteName: "zhoppin.ng",
    locale: "en_NG",
    type: "website",
  },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG">
      <body>
        <a
          href="#main-content"
          className="sr-only fixed top-3 left-3 z-100 rounded-lg bg-brand px-4 py-3 text-white focus:not-sr-only"
        >
          Skip to content
        </a>
        <StoreProvider>
          <Header />
          {children}
          <Footer />
          <Toaster richColors position="bottom-right" />
        </StoreProvider>
      </body>
    </html>
  );
}
