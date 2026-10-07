"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/features/cart/store";
import { unitPrice } from "@/features/cart/pricing";
import { money, type Market } from "@/lib/markets";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { cn } from "@/lib/utils";
import type { Service } from "../types";
export function OrderOptions({
  service,
  market,
}: {
  service: Service;
  market: Market;
}) {
  const [optionId, setOptionId] = useState(service.options[0].id);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const add = useCart((state) => state.add);
  const hydrated = useCart((state) => state.hydrated);
  const price = unitPrice(service, optionId, market);
  function addToBag(orderNow: boolean) {
    add(market, { slug: service.slug, optionId, quantity });
    if (orderNow) router.push(`/${market}/checkout`);
    else
      toast.success(`${service.name} added to your bag`, {
        description: `${quantity} × ${service.options.find((option) => option.id === optionId)?.name}`,
        action: {
          label: "View bag",
          onClick: () => router.push(`/${market}/cart`),
        },
      });
  }
  return (
    <div className="mt-6 border-t border-line pt-6">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">
          Make it yours{" "}
          <span className="ml-2 text-xs font-normal text-muted">
            Choose your package
          </span>
        </legend>
        <div className="grid gap-2">
          {service.options.map((option) => (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors",
                optionId === option.id
                  ? "border-brand bg-[#f0f3e9]"
                  : "border-line bg-white hover:border-[#a8b39c]",
              )}
            >
              <input
                type="radio"
                name="service-option"
                value={option.id}
                checked={optionId === option.id}
                onChange={() => setOptionId(option.id)}
                className="mt-0.5 size-4 accent-brand"
              />
              <span className="flex-1">
                <span className="block text-sm font-semibold">
                  {option.name}
                </span>
                <span className="mt-1 block text-xs text-muted">
                  {option.detail}
                </span>
              </span>
              <span className="text-sm font-semibold">
                {money(unitPrice(service, option.id, market), market)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="my-6 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-medium">
            {service.category === "Prints" && service.slug !== "event-backdrop"
              ? "Number of batches"
              : "Quantity"}
          </p>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Your service total</p>
          <p
            className="mt-1 text-2xl font-semibold tracking-tight"
            aria-live="polite"
          >
            {money(price * quantity, market)}
          </p>
          <p className="mt-1 text-[10px] text-muted">Before estimated tax</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button
          disabled={!hydrated}
          variant="secondary"
          onClick={() => addToBag(false)}
        >
          <ShoppingBag size={16} />
          Add to cart
        </Button>
        <Button disabled={!hydrated} onClick={() => addToBag(true)}>
          Order now <ArrowRight size={16} />
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-muted">
        <span className="flex items-center gap-1">
          <ShieldCheck size={13} />
          Clear pricing
        </span>
        <span className="flex items-center gap-1">
          <Check size={13} />A dedicated creative team
        </span>
      </div>
    </div>
  );
}
