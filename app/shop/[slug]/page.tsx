import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Check, Truck, ShieldCheck } from "lucide-react";
import { getProduct, getProducts } from "@/lib/server/catalog";
import { databaseConfigured } from "@/lib/server/db";
import { BuyPanel } from "@/features/store/buy-panel";
import { ProductCard } from "@/features/store/product-card";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}
export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const related = (await getProducts())
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);
  return (
    <main id="main-content" className="page-shell py-7 pb-16">
      <nav
        aria-label="Breadcrumb"
        className="mb-7 flex flex-wrap items-center gap-2 text-xs text-muted"
      >
        <Link href="/shop">The store</Link>
        <ChevronRight size={12} />
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <ChevronRight size={12} />
        <span>{product.name}</span>
      </nav>
      <div className="grid items-start gap-9 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-xl border border-line bg-cream">
          <Image
            src={product.image}
            alt={`${product.name} product flyer — confirm current offer details with Zhoppin`}
            width={800}
            height={1080}
            priority
            sizes="(max-width:1023px)90vw,45vw"
            className="h-auto w-full"
          />
        </div>
        <div className="lg:sticky lg:top-8">
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight">
            {product.name}
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted">
            {product.description}
          </p>
          <BuyPanel product={product} connected={databaseConfigured()} />
          <h2 className="mt-8 text-base font-bold">The details that matter</h2>
          <ul className="mt-4 space-y-3">
            {product.specs.map((spec) => (
              <li key={spec} className="flex gap-3 text-sm leading-6">
                <Check size={16} className="mt-1 shrink-0 text-brand" />
                {spec}
              </li>
            ))}
          </ul>
          <div className="mt-7 grid gap-4 border-t border-line pt-5 text-xs text-muted">
            <span className="flex items-center gap-2">
              <Truck size={17} />
              Nationwide delivery · quote before payment
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} />
              Bank transfers are manually verified
            </span>
          </div>
          <p className="mt-5 text-[11px] leading-6 text-muted">
            Flyers are supplied reference materials. Older promotional text,
            phone numbers, instalment offers and performance claims may differ
            from the current offer. Confirm specifications and warranty terms
            with us; the website’s checkout total and contact details take
            precedence.
          </p>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-7 text-3xl font-bold tracking-tight">
            More possibilities to explore.
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
