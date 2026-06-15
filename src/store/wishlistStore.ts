"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  productIds: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      addToWishlist: (id) =>
        set((s) => ({ productIds: [...s.productIds, id] })),
      removeFromWishlist: (id) =>
        set((s) => ({ productIds: s.productIds.filter((p) => p !== id) })),
      isInWishlist: (id) => get().productIds.includes(id),
      toggleWishlist: (id) => {
        if (get().isInWishlist(id)) get().removeFromWishlist(id);
        else get().addToWishlist(id);
      },
    }),
    { name: "saree-wishlist" }
  )
);
