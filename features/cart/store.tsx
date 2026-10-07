"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { marketCodes, type Market } from "@/lib/markets";
import { services } from "@/features/catalog/data";
import { cartLineSchema, lineKey, type CartLine } from "./pricing";

type CartState = {
  carts: Record<Market, CartLine[]>;
  hydrated: boolean;
  add: (market: Market, item: CartLine) => void;
  remove: (market: Market, key: string) => void;
  setQuantity: (market: Market, key: string, quantity: number) => void;
  clear: (market: Market) => void;
};
const emptyCarts = (): CartState["carts"] => ({
  ng: [],
  us: [],
  uk: [],
  ca: [],
});
function sanitizeCarts(value: unknown): CartState["carts"] {
  const carts = emptyCarts();
  if (!value || typeof value !== "object") return carts;
  for (const market of marketCodes) {
    const items = (value as Record<string, unknown>)[market];
    if (!Array.isArray(items)) continue;
    for (const item of items.slice(0, 50)) {
      const parsed = cartLineSchema.safeParse(item);
      if (!parsed.success) continue;
      const service = services.find(
        (service) => service.slug === parsed.data.slug,
      );
      if (
        service?.options.some((option) => option.id === parsed.data.optionId) &&
        !carts[market].some((line) => lineKey(line) === lineKey(parsed.data))
      )
        carts[market].push(parsed.data);
    }
  }
  return carts;
}
function createCartStore() {
  return createStore<CartState>()(
    persist(
      (set) => ({
        carts: emptyCarts(),
        hydrated: false,
        add: (market, item) =>
          set((state) => {
            const valid = cartLineSchema.parse(item);
            const existing = state.carts[market].find(
              (line) => lineKey(line) === lineKey(valid),
            );
            return {
              carts: {
                ...state.carts,
                [market]: existing
                  ? state.carts[market].map((line) =>
                      lineKey(line) === lineKey(valid)
                        ? {
                            ...line,
                            quantity: Math.min(
                              99,
                              line.quantity + valid.quantity,
                            ),
                          }
                        : line,
                    )
                  : [...state.carts[market], valid],
              },
            };
          }),
        remove: (market, key) =>
          set((state) => ({
            carts: {
              ...state.carts,
              [market]: state.carts[market].filter(
                (line) => lineKey(line) !== key,
              ),
            },
          })),
        setQuantity: (market, key, quantity) =>
          set((state) => ({
            carts: {
              ...state.carts,
              [market]: state.carts[market].map((line) =>
                lineKey(line) === key
                  ? {
                      ...line,
                      quantity: Math.min(99, Math.max(1, Math.trunc(quantity))),
                    }
                  : line,
              ),
            },
          })),
        clear: (market) =>
          set((state) => ({ carts: { ...state.carts, [market]: [] } })),
      }),
      {
        name: "branda-cart-v1",
        version: 1,
        storage: createJSONStorage(() => localStorage),
        skipHydration: true,
        partialize: (state) => ({ carts: state.carts }),
        merge: (persisted, current) => ({
          ...current,
          carts: sanitizeCarts(
            (persisted as { carts?: unknown } | undefined)?.carts,
          ),
        }),
      },
    ),
  );
}
type CartStore = ReturnType<typeof createCartStore>;
const CartContext = createContext<CartStore | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(createCartStore);
  useEffect(() => {
    Promise.resolve(store.persist.rehydrate()).finally(() =>
      store.setState({ hydrated: true }),
    );
  }, [store]);
  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
}
export function useCart<T>(selector: (state: CartState) => T): T {
  const store = useContext(CartContext);
  if (!store) throw new Error("CartProvider is required.");
  return useStore(store, selector);
}
