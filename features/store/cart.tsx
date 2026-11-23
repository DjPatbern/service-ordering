"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { cartItemSchema, type CartItem } from "./schema";
type State = {
  items: CartItem[];
  ready: boolean;
  add: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  change: (slug: string, quantity: number) => void;
  clear: () => void;
};
function createCart() {
  return createStore<State>()(
    persist(
      (set) => ({
        items: [],
        ready: false,
        add: (slug, quantity) =>
          set((state) => ({
            items: state.items.some((item) => item.slug === slug)
              ? state.items.map((item) =>
                  item.slug === slug
                    ? { slug, quantity: Math.min(10, item.quantity + quantity) }
                    : item,
                )
              : [...state.items, cartItemSchema.parse({ slug, quantity })],
          })),
        remove: (slug) =>
          set((state) => ({
            items: state.items.filter((item) => item.slug !== slug),
          })),
        change: (slug, quantity) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.slug === slug
                ? { slug, quantity: Math.max(1, Math.min(10, quantity)) }
                : item,
            ),
          })),
        clear: () => set({ items: [] }),
      }),
      {
        name: "zhoppin-bag-v1",
        storage: createJSONStorage(() => localStorage),
        skipHydration: true,
        partialize: (state) => ({ items: state.items }),
        merge: (saved, current) => {
          const items = (saved as { items?: unknown })?.items;
          const valid = Array.isArray(items)
            ? items
                .map((item) => cartItemSchema.safeParse(item))
                .filter((result) => result.success)
                .map((result) => result.data!)
                .slice(0, 30)
            : [];
          return {
            ...current,
            items: valid.filter(
              (item, index) =>
                valid.findIndex((other) => other.slug === item.slug) === index,
            ),
          };
        },
      },
    ),
  );
}
const Context = createContext<ReturnType<typeof createCart> | null>(null);
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(createCart);
  useEffect(() => {
    Promise.resolve(store.persist.rehydrate()).finally(() =>
      store.setState({ ready: true }),
    );
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useCart<T>(selector: (state: State) => T) {
  const store = useContext(Context);
  if (!store) throw new Error("StoreProvider is required");
  return useStore(store, selector);
}
