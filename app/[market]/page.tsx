import { catalogHref } from "@/features/catalog/urls";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Gift,
  Grid2X2,
  Monitor,
  Palette,
  Printer,
  Camera,
  SearchX,
} from "lucide-react";
import { isMarket, markets } from "@/lib/markets";
import { cn } from "@/lib/utils";
import { categories } from "@/features/catalog/types";
import {
  parseFilters,
  PAGE_SIZE,
  type SearchParams,
} from "@/features/catalog/query";
import { getServices } from "@/features/catalog/repository";
import { Hero, BrandStory } from "@/features/catalog/components/hero";
import { CatalogFilters } from "@/features/catalog/components/filters";
import { ServiceCard } from "@/features/catalog/components/service-card";
import { buttonVariants } from "@/components/ui/button";
type Props = {
  params: Promise<{ market: string }>;
  searchParams: Promise<SearchParams>;
};
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { market } = await params;
  if (!isMarket(market)) return {};
  const filters = parseFilters(await searchParams);
  const title = `${filters.category === "All" ? "Branding services" : `${filters.category} services`} in ${markets[market].name}`;
  return {
    title,
    description: markets[market].description,
    alternates: {
      canonical: catalogHref(market, filters),
      languages: Object.fromEntries(
        Object.entries(markets).map(([code, value]) => [
          value.locale,
          `/${code}`,
        ]),
      ),
    },
    openGraph: {
      title,
      description: markets[market].description,
      url: catalogHref(market, filters),
      type: "website",
    },
  };
}
const icons = {
  All: Grid2X2,
  Digital: Monitor,
  Gifts: Gift,
  Create: Palette,
  Studio: Camera,
  Prints: Printer,
};
export default async function CatalogPage({ params, searchParams }: Props) {
  const { market } = await params;
  if (!isMarket(market)) notFound();
  const filters = parseFilters(await searchParams);
  const result = await getServices(filters, market);
  return (
    <main id="main-content">
      <Hero market={market} />
      <section id="services" className="page-shell scroll-mt-6 pt-13 pb-5">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[2px] text-brand uppercase">
              The possibilities start here
            </p>
            <h2 className="font-display text-4xl tracking-[-1px] sm:text-[42px]">
              What’s next for your brand?
            </h2>
          </div>
          <p className="max-w-63 text-xs leading-6 text-muted">
            Five creative worlds. One connected brand.
            <br />
            Find just what you need to move forward.
          </p>
        </div>
        <nav
          aria-label="Service categories"
          className="mb-6 flex gap-2 overflow-x-auto pb-1"
        >
          {["All", ...categories].map((category) => {
            const Icon = icons[category as keyof typeof icons];
            const selected = filters.category === category;
            return (
              <Link
                key={category}
                href={`${catalogHref(market, { ...filters, category: category as typeof filters.category, page: 1 })}#services`}
                scroll={false}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg border px-5 text-xs font-medium transition-colors",
                  selected
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-white hover:border-brand hover:text-brand",
                )}
              >
                <Icon size={16} strokeWidth={1.5} />
                {category === "All" ? "All services" : category}
              </Link>
            );
          })}
        </nav>
        <CatalogFilters market={market} filters={filters} />
        <div
          className="my-4 flex items-center gap-2 text-xs text-muted"
          aria-live="polite"
        >
          <span className="font-semibold text-ink">
            {result.total} services
          </span>
          <span>
            to bring your ideas to life{filters.q ? ` for “${filters.q}”` : ""}
          </span>
        </div>
        {result.services.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {result.services.map((service) => (
              <ServiceCard
                key={service.slug}
                service={service}
                market={market}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-white py-16 text-center">
            <SearchX className="mx-auto mb-4 text-brand" size={35} />
            <h3 className="font-display text-2xl">
              A fresh search could be the start.
            </h3>
            <p className="mx-auto mt-3 max-w-sm px-4 text-sm leading-6 text-muted">
              We couldn’t find services matching these filters. Try a broader
              search or explore all five categories.
            </p>
            <Link
              href={`/${market}#services`}
              className={buttonVariants({
                variant: "secondary",
                className: "mt-5",
              })}
            >
              Explore all services
            </Link>
          </div>
        )}
        {result.total > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-9">
            <p className="text-xs text-muted">
              Showing {(result.page - 1) * PAGE_SIZE + 1}–
              {Math.min(result.page * PAGE_SIZE, result.total)} of{" "}
              {result.total} services
            </p>
            <nav aria-label="Pagination" className="flex items-center gap-2">
              {result.page > 1 && (
                <Link
                  aria-label="Previous page"
                  href={`${catalogHref(market, { ...filters, page: result.page - 1 })}#services`}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "icon",
                  })}
                >
                  <ArrowLeft size={15} />
                </Link>
              )}
              {Array.from({ length: result.pages }, (_, i) => i + 1).map(
                (page) => (
                  <Link
                    key={page}
                    href={`${catalogHref(market, { ...filters, page })}#services`}
                    aria-label={`Page ${page}`}
                    aria-current={page === result.page ? "page" : undefined}
                    className={buttonVariants({
                      variant: page === result.page ? "primary" : "ghost",
                      size: "icon",
                    })}
                  >
                    {page}
                  </Link>
                ),
              )}
              {result.page < result.pages && (
                <Link
                  aria-label="Next page"
                  href={`${catalogHref(market, { ...filters, page: result.page + 1 })}#services`}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "icon",
                  })}
                >
                  <ArrowRight size={15} />
                </Link>
              )}
            </nav>
          </div>
        )}
      </section>
      <BrandStory market={market} />
    </main>
  );
}
