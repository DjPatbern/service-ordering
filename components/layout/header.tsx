"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, ArrowUpRight, Phone, Truck } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { Logo } from "./logo";
import { brand } from "@/lib/brand";
import { useCart } from "@/features/store/cart";
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const count = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  return (
    <>
      <div className="bg-ink text-white">
        <div className="page-shell flex min-h-9 items-center justify-between gap-3 py-2 text-[10px] sm:text-xs">
          <span className="flex items-center gap-2">
            <Truck size={13} />
            Your next upgrade. Delivered nationwide.
          </span>
          <a
            href={`tel:${brand.internationalPhone}`}
            className="hidden items-center gap-2 sm:flex"
          >
            <Phone size={12} />
            {brand.phone}
          </a>
        </div>
      </div>
      <header className="border-b border-line bg-white">
        <div className="page-shell flex h-22 items-center justify-between gap-4">
          <Logo />
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 text-sm lg:flex"
          >
            {[
              ["/", "Home"],
              ["/shop", "Shop products"],
              ["/#why-zhoppin", "Why Zhoppin"],
              ["/#contact", "Contact"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? "page" : undefined}
                className={
                  path === href
                    ? "font-semibold text-brand"
                    : "text-muted hover:text-brand"
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href={brand.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 text-xs font-semibold md:flex"
            >
              Let’s talk <ArrowUpRight size={15} />
            </a>
            <Link
              href="/cart"
              aria-label={`Shopping bag, ${count} items`}
              className="flex min-h-11 items-center gap-1.5"
            >
              <ShoppingBag size={20} />
              <span className="grid size-5 place-items-center rounded-full bg-brand text-[10px] text-white">
                {count}
              </span>
            </Link>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger
                aria-label="Open navigation"
                className="grid size-10 shrink-0 place-items-center lg:hidden"
              >
                <Menu size={22} />
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
                <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-[min(90vw,360px)] bg-white p-7">
                  <Dialog.Title className="text-xl font-bold">
                    Find your next upgrade.
                  </Dialog.Title>
                  <Dialog.Description className="mt-3 text-sm text-muted">
                    Welcome to zhoppin.ng.
                  </Dialog.Description>
                  <Dialog.Close
                    aria-label="Close navigation"
                    className="absolute top-3 right-3 p-2"
                  >
                    <X size={20} />
                  </Dialog.Close>
                  <nav
                    aria-label="Mobile navigation"
                    className="mt-8 flex flex-col"
                  >
                    {[
                      ["/", "Home"],
                      ["/shop", "Shop products"],
                      ["/#why-zhoppin", "Why Zhoppin"],
                      ["/#contact", "Contact"],
                      ["/cart", "Your bag"],
                    ].map(([href, label]) => (
                      <Link
                        onClick={() => setOpen(false)}
                        href={href}
                        key={href}
                        className="border-b border-line py-4"
                      >
                        {label}
                      </Link>
                    ))}
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
