import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { getCategories, getProducts } from "@/lib/server/catalog";
import { ProductCard } from "@/features/store/product-card";
import { brand, whatsappFor } from "@/lib/brand";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Shop tech, solar & everyday essentials",
  description: brand.description,
  alternates: { canonical: "/shop" },
};
export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const categories = await getCategories();
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const category =
    typeof params.category === "string" &&
    categories.some((c) => c === params.category)
      ? params.category
      : "";
  const sort =
    params.sort === "price-asc" || params.sort === "price-desc"
      ? params.sort
      : "featured";
  const products = (await getProducts()).filter(
    (product) =>
      (!category || product.category === category) &&
      (!q ||
        `${product.name} ${product.description} ${product.specs.join(" ")}`
          .toLowerCase()
          .includes(q.toLowerCase())),
  );
  if (sort !== "featured")
    products.sort((a, b) =>
      sort === "price-asc" ? a.price - b.price : b.price - a.price,
    );
  const pages = Math.max(1, Math.ceil(products.length / 9));
  const page = Math.min(
    pages,
    Math.max(1, Math.floor(Number(params.page) || 1)),
  );
  const visible = products.slice((page - 1) * 9, page * 9);
  function href(next: Record<string, string>) {
    const search = new URLSearchParams({
      ...(q ? { q } : {}),
      ...(category ? { category } : {}),
      sort,
      ...next,
    });
    return `/shop?${search}`;
  }
  return (
    <main id="main-content" className="page-shell min-h-[65vh] py-12">
      <p className="eyebrow">A smarter everyday starts here</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        Find your next upgrade.
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-7 text-muted">
        Explore our latest offers. For enquiry-only products, talk to us to
        confirm price and availability. For ready-to-order items, delivery is
        quoted before payment.
      </p>
      <nav
        aria-label="Product categories"
        className="mt-8 flex gap-2 overflow-x-auto pb-2"
      >
        {["", ...categories].map((item) => (
          <Link
            key={item}
            href={href({ category: item, page: "1" })}
            aria-current={category === item ? "page" : undefined}
            className={`shrink-0 rounded-full border px-5 py-3 text-xs font-semibold ${category === item ? "border-brand bg-brand text-white" : "border-line hover:border-brand"}`}
          >
            {item || "All products"}
          </Link>
        ))}
      </nav>
      <form
        action="/shop"
        className="mt-5 flex flex-wrap gap-3 rounded-xl border border-line bg-cream p-3"
        role="search"
      >
        <div className="relative min-w-0 flex-1 basis-60">
          <Search
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 left-4 text-muted"
          />
          <input
            name="q"
            defaultValue={q}
            aria-label="Search products"
            placeholder="Search your next upgrade…"
            maxLength={100}
            className="field !pl-11"
          />
        </div>
        <input type="hidden" name="category" value={category} />
        <select
          name="sort"
          defaultValue={sort}
          aria-label="Sort products"
          className="field w-auto flex-1 sm:flex-none"
        >
          <option value="featured">Featured first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <button
          className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white"
          type="submit"
        >
          Search
        </button>
      </form>
      <p className="my-5 text-xs text-muted">
        {products.length} {products.length === 1 ? "product" : "products"}
        {category ? ` in ${category}` : " to explore"}
      </p>
      {visible.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line bg-cream px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">
            Looking for something specific?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">
            We’re updating this collection. Tell us the model, specification or
            essential you need, and we’ll help you find it.
          </p>
          <a
            href={whatsappFor(
              `Hi Zhoppin, I’m looking for ${q || category || "a product"}. Can you help?`,
            )}
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand"
          >
            Ask us on WhatsApp
            <ArrowRight size={15} />
          </a>
          <Link
            href="/shop"
            className="mt-4 block text-xs text-muted underline"
          >
            Clear filters
          </Link>
        </div>
      )}
      <nav aria-label="Pagination" className="mt-8 flex justify-center gap-3">
        {Array.from({ length: pages }, (_, i) => i + 1).map((number) => (
          <Link
            key={number}
            href={href({ page: String(number) })}
            aria-current={page === number ? "page" : undefined}
            className={`grid size-10 place-items-center rounded-lg text-sm ${page === number ? "bg-brand text-white" : "border border-line"}`}
          >
            {number}
          </Link>
        ))}
      </nav>
    </main>
  );
}
