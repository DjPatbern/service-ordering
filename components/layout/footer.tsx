import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/features/catalog/types";
import { markets, type Market } from "@/lib/markets";
export function Footer({ market }: { market: Market }) {
  return (
    <footer className="border-t border-line bg-[#f0f0e7] pt-12 pb-6">
      <div className="page-shell">
        <div className="grid gap-10 pb-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link
              href={`/${market}`}
              className="text-3xl font-extrabold tracking-[-1.8px] text-brand"
            >
              branda✳
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
              Big ideas deserve beautiful branding.
              <br />
              Let’s make something that feels like you.
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-xs font-semibold tracking-widest uppercase">
              Your brand, everywhere
            </h2>
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/${market}?category=${category}#services`}
                  className="hover:text-brand"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xs font-semibold tracking-widest uppercase">
              A little more Branda
            </h2>
            <Link
              href={`/${market}#how-it-works`}
              className="mb-3 flex items-center gap-2 text-sm text-muted"
            >
              How it works <ArrowUpRight size={13} />
            </Link>
            <Link
              href={`/${market}#our-promise`}
              className="text-sm text-muted"
            >
              Our promise to your brand
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-xs text-muted">
          <span>
            © {new Date().getFullYear()} Branda. Built for what’s next.
          </span>
          <span>
            {markets[market].flag} {markets[market].name} ·{" "}
            {markets[market].currency} <span className="mx-2">/</span> A service
            ordering demo
          </span>
        </div>
      </div>
    </footer>
  );
}
