import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Service } from "../types";
import { money, type Market } from "@/lib/markets";
import { cn } from "@/lib/utils";
export function ServiceCard({
  service,
  market,
}: {
  service: Service;
  market: Market;
}) {
  return (
    <article
      className="group overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-[0_8px_30px_-15px_#334c3540]"
      data-testid="service-card"
    >
      <Link
        href={`/${market}/services/${service.slug}`}
        className="relative block overflow-hidden bg-stone-100"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={service.image}
          alt={`${service.name} — sample branded design`}
          width={600}
          height={460}
          sizes="(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 23vw"
          className="aspect-[1.3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
        {service.badge && (
          <span
            className={cn(
              "absolute top-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-semibold",
              service.discount && "bg-[#f4e6ce] text-[#805326]",
            )}
          >
            {service.badge}
          </span>
        )}
      </Link>
      <div className="p-4 sm:p-5">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span className="text-[9px] font-semibold tracking-[1.5px] text-brand uppercase">
            {service.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted">
            <Clock3 size={11} />
            {service.days} working days
          </span>
        </div>
        <h3 className="text-[15px] font-semibold tracking-[-.25px]">
          <Link
            href={`/${market}/services/${service.slug}`}
            className="hover:text-brand"
          >
            {service.name}
          </Link>
        </h3>
        <p className="mt-2 min-h-9 text-xs leading-5 text-muted">
          {service.tagline}
        </p>
        <div className="mt-4 flex items-end justify-between gap-1 border-t border-line pt-4">
          <div>
            <span className="block text-[10px] text-muted">Starting from</span>
            <span className="mt-1 inline-block text-base font-semibold">
              {money(service.prices[market], market)}
            </span>
            {service.discount && (
              <span className="ml-1.5 text-[10px] text-muted line-through">
                {money(
                  Math.round(
                    service.prices[market] / (1 - service.discount / 100),
                  ),
                  market,
                )}
              </span>
            )}
          </div>
          <Link
            href={`/${market}/services/${service.slug}`}
            aria-label={`Explore ${service.name}`}
            className="flex min-h-9 shrink-0 items-center gap-1 rounded-md px-1 text-[10px] font-semibold text-brand transition-colors hover:bg-[#edf1e4]"
          >
            View service <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
