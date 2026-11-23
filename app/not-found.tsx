import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main-content" className="page-shell py-28 text-center">
      <p className="eyebrow">ZHOPPIN / 404</p>
      <h1 className="mt-5 text-4xl font-bold tracking-tight">
        This upgrade took a detour.
      </h1>
      <p className="mt-4 text-muted">
        We couldn’t find this product or order. There’s plenty more to explore.
      </p>
      <Link href="/shop" className={buttonVariants({ className: "mt-7" })}>
        Explore the store
      </Link>
    </main>
  );
}
