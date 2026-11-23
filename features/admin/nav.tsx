"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderTree, Package, ShoppingBag, Store } from "lucide-react";

const links = [
  { href: "/admin", label: "Orders", icon: ShoppingBag, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav
      className="mb-8 flex gap-2 overflow-x-auto rounded-2xl border border-line bg-cream p-2"
      aria-label="Admin navigation"
    >
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href || pathname.startsWith("/admin/orders/")
          : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-bold transition-colors ${
              active
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:bg-white hover:text-ink"
            }`}
          >
            <Icon size={16} /> {label}
          </Link>
        );
      })}
      <Link
        href="/shop"
        target="_blank"
        className="ml-auto flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-xs font-bold text-muted hover:bg-white hover:text-ink"
      >
        <Store size={16} /> View store ↗
      </Link>
    </nav>
  );
}
