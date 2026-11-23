import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "./schema";
import { naira } from "@/lib/brand";
export function ProductCard({ product }: { product: Product }) {
  return (
    <article
      data-testid="product-card"
      className="group overflow-hidden rounded-xl border border-line bg-white"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="relative block overflow-hidden bg-[#f6f5f4]"
        aria-hidden="true"
        tabIndex={-1}
      >
        <Image
          src={product.image}
          alt={`${product.name} promotional product reference`}
          width={800}
          height={1080}
          sizes="(max-width:639px) 90vw,(max-width:1023px) 45vw,30vw"
          className="aspect-[1.16] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold shadow-sm">
          {product.purchasable && product.stock > 0
            ? "Ready to order"
            : "Ask about availability"}
        </span>
      </Link>
      <div className="p-5">
        <p className="eyebrow text-[9px]">{product.category}</p>
        <h3 className="mt-2 text-base font-bold">
          <Link href={`/shop/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-2 text-xs leading-5 text-muted">{product.specs[0]}</p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-2 border-t border-line pt-4">
          <div>
            <p className="text-[10px] text-muted">
              {product.purchasable
                ? "Product price"
                : "Advertised price · confirm with us"}
            </p>
            <p className="mt-1 text-lg font-bold tracking-tight">
              {naira(product.price)}
            </p>
          </div>
          <Link
            href={`/shop/${product.slug}`}
            aria-label={`View ${product.name}`}
            className="flex min-h-10 items-center gap-1 text-xs font-semibold text-brand"
          >
            View details
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
