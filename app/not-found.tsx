import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main id="main-content" className="page-shell py-28 text-center">
      <p className="text-sm font-semibold text-brand">BRANDA / 404</p>
      <h1 className="mt-5 font-display text-4xl">
        A little off the beaten path.
      </h1>
      <p className="mt-4 text-muted">
        This service or market couldn’t be found. There’s plenty more to
        explore.
      </p>
      <Link href="/ng" className={buttonVariants({ className: "mt-7" })}>
        Back to Branda
      </Link>
    </main>
  );
}
