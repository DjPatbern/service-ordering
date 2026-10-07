"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dialog } from "radix-ui";
import { ArrowUpRight, ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { markets, marketCodes, type Market } from "@/lib/markets";
import { useCart } from "@/features/cart/store";
import { categories } from "@/features/catalog/types";
import { cn } from "@/lib/utils";
export function Header({ market }: { market: Market }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const count = useCart((state) =>
    state.carts[market].reduce((sum, line) => sum + line.quantity, 0),
  );
  const current = markets[market];
  function changeMarket(value: string) {
    const path = pathname.replace(/^\/(ng|us|uk|ca)(?=\/|$)/, `/${value}`);
    router.push(`${path}${params.size ? `?${params.toString()}` : ""}`);
  }
  return (
    <>
      <div className="bg-brand px-4 py-2.5 text-center text-[11px] font-medium tracking-wide text-white/95 sm:text-xs">
        One brand. Endless possibilities.{" "}
        <span className="mx-2 text-white/35">|</span> Made with care, made for
        you <span aria-hidden="true">✳</span>
      </div>
      <header className="border-b border-line bg-cream">
        <div className="page-shell flex h-21 items-center justify-between gap-2">
          <Link
            href={`/${market}`}
            aria-label="Branda home"
            className="shrink-0 text-[28px] leading-none font-extrabold tracking-[-2px] text-brand sm:text-[34px]"
          >
            branda<span className="text-lime-700">✳</span>
          </Link>
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 text-sm font-medium xl:flex"
          >
            <Link
              href={`/${market}#services`}
              className="flex items-center gap-1.5 text-brand"
            >
              Explore services <ChevronDown size={14} />
            </Link>
            <Link href={`/${market}#how-it-works`} className="hover:text-brand">
              How it works
            </Link>
            <Link href={`/${market}#our-promise`} className="hover:text-brand">
              The Branda difference{" "}
              <ArrowUpRight className="inline" size={13} />
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2 sm:gap-5">
            <div className="relative flex min-h-11 items-center gap-1.5 rounded-md text-xs focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand sm:gap-2 sm:text-sm">
              <span aria-hidden="true" className="text-base sm:text-lg">
                {current.flag}
              </span>
              <span
                aria-hidden="true"
                className="text-[11px] font-medium sm:text-sm"
              >
                <span className="hidden sm:inline">{current.name} · </span>
                {current.currency}
              </span>
              <ChevronDown size={12} aria-hidden="true" />
              <select
                aria-label="Country and currency"
                value={market}
                onChange={(event) => changeMarket(event.target.value)}
                className="absolute inset-0 w-full cursor-pointer opacity-0"
              >
                {marketCodes.map((code) => (
                  <option value={code} key={code}>
                    {markets[code].name} · {markets[code].currency}
                  </option>
                ))}
              </select>
            </div>
            <span className="hidden h-6 w-px bg-line sm:block" />
            <Link
              href={`/${market}/cart`}
              aria-label={`Shopping bag, ${count} items`}
              className="relative flex min-h-11 shrink-0 items-center gap-1 rounded-lg text-sm sm:gap-2 sm:px-1.5"
            >
              <ShoppingBag size={20} strokeWidth={1.6} />
              <span className="hidden sm:inline">Bag</span>
              <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1.5 py-0.5 text-[10px] text-white">
                {count}
              </span>
            </Link>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger
                aria-label="Open navigation"
                className="grid size-9 shrink-0 place-items-center sm:size-11 xl:hidden"
              >
                <Menu size={22} />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm" />
                <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-[min(88vw,360px)] bg-cream p-7 shadow-xl">
                  <Dialog.Title className="text-2xl font-bold text-brand">
                    Explore Branda
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-sm text-muted">
                    Everything your brand needs, together.
                  </Dialog.Description>
                  <Dialog.Close
                    aria-label="Close navigation"
                    className="absolute top-5 right-4 grid size-11 place-items-center"
                  >
                    <X size={20} />
                  </Dialog.Close>
                  <nav
                    className="mt-8 flex flex-col gap-1"
                    aria-label="Mobile navigation"
                  >
                    {["All", ...categories].map((category) => (
                      <Link
                        onClick={() => setOpen(false)}
                        className={cn(
                          "border-b border-line py-4 text-lg",
                          params.get("category") === category && "text-brand",
                        )}
                        href={`/${market}${category === "All" ? "" : `?category=${category}`}#services`}
                        key={category}
                      >
                        {category === "All" ? "All services" : category}
                      </Link>
                    ))}
                    <Link
                      onClick={() => setOpen(false)}
                      className="py-4"
                      href={`/${market}#how-it-works`}
                    >
                      How it works
                    </Link>
                  </nav>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </header>
    </>
  );
}
