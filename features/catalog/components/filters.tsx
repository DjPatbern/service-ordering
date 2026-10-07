"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { industries, useCases } from "../types";
import type { Filters } from "../query";
import { catalogHref } from "../urls";
import type { Market } from "@/lib/markets";
import { Button } from "@/components/ui/button";
export function CatalogFilters({
  filters,
  market,
}: {
  filters: Filters;
  market: Market;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function update(key: keyof Filters, value: string) {
    startTransition(() =>
      router.push(
        `${catalogHref(market, { ...filters, [key]: value, page: 1 })}#services`,
        { scroll: false },
      ),
    );
  }
  const active = Boolean(
    filters.q ||
    filters.useCase !== "All" ||
    filters.industry !== "All" ||
    filters.urgency !== "All" ||
    filters.category !== "All",
  );
  return (
    <div aria-busy={pending} className={pending ? "opacity-60" : ""}>
      <form
        action={`/${market}#services`}
        role="search"
        className="flex flex-wrap gap-3 rounded-xl border border-line bg-white p-3"
      >
        <div className="relative w-full min-w-0 lg:w-auto lg:flex-[2]">
          <Search className="absolute top-3.5 left-3 text-muted" size={16} />
          <input
            key={filters.q}
            name="q"
            defaultValue={filters.q}
            placeholder="What can we help you create?"
            aria-label="Search services"
            maxLength={100}
            className="h-11 w-full rounded-lg bg-[#f7f8f3] pr-12 pl-10 text-xs outline-offset-2"
          />
          <button
            aria-label="Search"
            type="submit"
            className="absolute top-1 right-1 grid size-9 place-items-center rounded-md text-brand hover:bg-green-100"
          >
            <span aria-hidden="true">↵</span>
          </button>
        </div>
        <input type="hidden" name="category" value={filters.category} />
        <input type="hidden" name="sort" value={filters.sort} />
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 lg:w-auto lg:flex-[3]">
          <SlidersHorizontal
            size={15}
            className="mx-2 hidden text-muted xl:block"
          />
          {[
            { name: "useCase", label: "Use case", values: useCases },
            { name: "industry", label: "Industry", values: industries },
            { name: "urgency", label: "Turnaround", values: ["3", "5", "7"] },
          ].map(({ name, label, values }) => (
            <select
              key={name}
              aria-label={label}
              name={name}
              value={filters[name as keyof Filters]}
              onChange={(event) =>
                update(name as keyof Filters, event.target.value)
              }
              className="h-11 min-w-25 flex-1 rounded-lg border border-line bg-white px-2 text-xs"
            >
              <option value="All">{label}: All</option>
              {values.map((value) => (
                <option value={value} key={value}>
                  {name === "urgency" ? `Within ${value} days` : value}
                </option>
              ))}
            </select>
          ))}
        </div>
      </form>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          {active ? (
            <>
              <span>Tailored to your search</span>
              <Button
                variant="ghost"
                size="small"
                className="min-h-8 px-2 text-xs"
                onClick={() =>
                  startTransition(() =>
                    router.push(`/${market}#services`, { scroll: false }),
                  )
                }
              >
                Clear filters <X size={12} />
              </Button>
            </>
          ) : (
            <span>A little inspiration for your next big thing.</span>
          )}
          {pending && <span role="status">Updating…</span>}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted">
          <ArrowUpDown size={13} />
          <span className="hidden sm:inline">Sort by:</span>
          <select
            aria-label="Sort services"
            value={filters.sort}
            onChange={(event) => update("sort", event.target.value)}
            className="min-h-10 max-w-44 bg-transparent font-medium text-ink"
          >
            <option value="popular">Most popular</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>
    </div>
  );
}
