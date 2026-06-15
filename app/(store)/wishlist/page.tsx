"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { IProduct } from "@/types";

export default function WishlistPage() {
  const { productIds, removeFromWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) { setLoading(false); return; }
    const fetches = productIds.map((id) =>
      fetch(`/api/products/${id}`).then((r) => r.json()).then((d) => d.data)
    );
    Promise.all(fetches)
      .then((prods) => setProducts(prods.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [productIds]);

  if (loading) return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-gray-500">Loading...</div>;

  if (productIds.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-black mb-3">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8">Save your favourite sarees here!</p>
        <Link href="/products"><Button size="lg">Explore Sarees</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-black mb-8">My Wishlist ({productIds.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Link href={`/products/${product.slug}`}>
              <div className="relative aspect-[3/4] bg-gray-50">
                <Image src={product.images[0] || "/placeholder-saree.jpg"} alt={product.name} fill className="object-cover" sizes="300px" />
              </div>
            </Link>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</p>
              <p className="font-bold text-black mb-3">{formatPrice(product.discountPrice ?? product.price)}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 text-xs gap-1"
                  onClick={() => { addItem(product); toast.success("Added to cart!"); }}
                >
                  <ShoppingCart className="w-3 h-3" />
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="px-2"
                  onClick={() => { removeFromWishlist(product._id); toast.success("Removed from wishlist"); }}
                >
                  <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
