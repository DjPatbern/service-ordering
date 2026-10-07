import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  ChevronRight,
  Clock3,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { getService, getRecommendations } from "@/features/catalog/repository";
import { services } from "@/features/catalog/data";
import { Gallery } from "@/features/catalog/components/gallery";
import { OrderOptions } from "@/features/catalog/components/order-options";
import { ServiceCard } from "@/features/catalog/components/service-card";
import { isMarket, marketCodes, markets, money } from "@/lib/markets";
type Props = { params: Promise<{ market: string; slug: string }> };
export function generateStaticParams() {
  return marketCodes.flatMap((market) =>
    services.map((service) => ({ market, slug: service.slug })),
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market, slug } = await params;
  if (!isMarket(market)) return {};
  const service = await getService(slug);
  if (!service) return {};
  const title = `${service.name} in ${markets[market].name}`;
  return {
    title,
    description: service.description,
    alternates: {
      canonical: `/${market}/services/${slug}`,
      languages: Object.fromEntries(
        marketCodes.map((code) => [
          markets[code].locale,
          `/${code}/services/${slug}`,
        ]),
      ),
    },
    openGraph: {
      title,
      description: service.tagline,
      url: `/${market}/services/${slug}`,
      type: "website",
    },
  };
}
export default async function ServicePage({ params }: Props) {
  const { market, slug } = await params;
  if (!isMarket(market)) notFound();
  const [service, recommendations] = await Promise.all([
    getService(slug),
    getRecommendations(slug),
  ]);
  if (!service) notFound();
  return (
    <main id="main-content" className="page-shell pb-16">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 py-6 text-xs text-muted"
      >
        <Link href={`/${market}#services`} className="hover:text-brand">
          All services
        </Link>
        <ChevronRight size={12} />
        <Link href={`/${market}?category=${service.category}#services`}>
          {service.category}
        </Link>
        <ChevronRight size={12} />
        <span aria-current="page" className="text-ink">
          {service.name}
        </span>
      </nav>
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <Gallery images={service.gallery} name={service.name} />
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-[10px] font-semibold tracking-[2px] text-brand uppercase">
              Branda {service.category}
            </span>
            {service.badge && (
              <span className="rounded-full bg-[#e9eddc] px-2.5 py-1 text-[10px] font-medium text-brand">
                {service.badge}
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            {service.name}
          </h1>
          <p className="mt-4 text-base text-muted">{service.tagline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-sm">
              <span className="text-muted">From </span>
              <span className="text-xl font-semibold">
                {money(service.prices[market], market)}
              </span>
            </p>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Clock3 size={14} />
              {service.days} working days after brief approval
            </span>
          </div>
          <OrderOptions service={service} market={market} />
        </div>
      </div>
      <section
        className="mt-12 grid gap-8 border-t border-line pt-9 md:grid-cols-2 lg:gap-14"
        aria-label="Service information"
      >
        <div>
          <h2 className="font-display text-2xl">
            Thoughtful details. A lasting impression.
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            {service.description}
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#eff1e7] p-5">
            <MessageCircle size={20} className="mt-1 shrink-0 text-brand" />
            <div>
              <h3 className="text-sm font-semibold">
                A little collaboration goes a long way.
              </h3>
              <p className="mt-2 text-xs leading-6 text-muted">
                After ordering, the next step is sharing your brief, brand files
                and inspiration with the creative team. The timeline starts once
                your brief is approved.
              </p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-display text-2xl">What’s included</h2>
          <ul className="mt-5 space-y-4">
            {service.included.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#eaf0df] text-brand">
                  <Check size={13} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-6 text-muted">
            Physical services include production. Delivery arrangements and any
            additional costs are confirmed before a real order is placed. This
            demo does not collect payment.
          </p>
        </div>
      </section>
      <section className="mt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[10px] font-semibold tracking-[2px] text-brand uppercase">
              Better together
            </p>
            <h2 className="font-display text-3xl">
              Build a little more of your brand.
            </h2>
          </div>
          <Link
            href={`/${market}#services`}
            className="flex items-center gap-2 text-xs font-semibold"
          >
            Explore all services <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {recommendations.map((item) => (
            <ServiceCard key={item.slug} service={item} market={market} />
          ))}
        </div>
      </section>
    </main>
  );
}
