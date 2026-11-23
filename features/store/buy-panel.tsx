"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./cart";
import type { Product } from "./schema";
import { naira, whatsappFor } from "@/lib/brand";
import { Button, buttonVariants } from "@/components/ui/button";
export function BuyPanel({
  product,
  connected,
}: {
  product: Product;
  connected: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const add = useCart((state) => state.add);
  const ready = useCart((state) => state.ready);
  const router = useRouter();
  const available = product.purchasable && product.stock > 0 && connected;
  function buy(checkout: boolean) {
    add(product.slug, quantity);
    if (checkout) router.push("/checkout");
    else
      toast.success("Added to your bag", {
        action: { label: "View bag", onClick: () => router.push("/cart") },
      });
  }
  return (
    <div className="mt-7 rounded-xl border border-line bg-cream p-5">
      <p className="text-xs text-muted">
        {available
          ? "Product price"
          : product.purchasable && product.stock < 1
            ? "Currently out of stock"
            : "Advertised price — confirm before ordering"}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight">
        {naira(product.price)}
      </p>
      {available ? (
        <>
          <p className="mt-3 text-xs leading-6 text-muted">
            Delivery cost is confirmed after you submit your address. No payment
            is needed until you receive the full total.
          </p>
          <label className="mt-5 flex items-center justify-between text-sm font-semibold">
            Quantity
            <select
              aria-label="Quantity"
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="field w-22"
            >
              {Array.from(
                { length: Math.min(10, product.stock) },
                (_, i) => i + 1,
              ).map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button
              disabled={!ready}
              variant="secondary"
              onClick={() => buy(false)}
            >
              <ShoppingBag size={16} />
              Add to bag
            </Button>
            <Button disabled={!ready} onClick={() => buy(true)}>
              Request order
              <ArrowRight size={15} />
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm leading-6 text-muted">
            {product.purchasable && product.stock < 1
              ? "Checkout is enabled for this product, but available stock is currently zero. Ask us when the next unit will be ready."
              : "This offer is currently enquiry-only. We’ll confirm today’s price, stock, specifications and delivery to your location before you commit."}
          </p>
          <a
            href={whatsappFor(
              `Hi Zhoppin, I’m interested in ${product.name} (advertised at ${naira(product.price)}). Please confirm current price, availability and delivery.`,
            )}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ className: "mt-5 w-full" })}
          >
            <MessageCircle size={17} />
            Enquire on WhatsApp
          </a>
        </>
      )}
    </div>
  );
}
