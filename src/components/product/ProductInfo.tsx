"use client";
import React, { useState } from "react";
import { Heart, ShoppingCart, Zap, Star, Truck, RefreshCw, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IProduct } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  product: IProduct;
}

export default function ProductInfo({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product._id);
  const discount = calculateDiscount(product.price, product.discountPrice);
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/checkout");
  };

  const handleWishlist = () => {
    toggleWishlist(product._id);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">{product.brand}</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.averageRating) ? "fill-yellow-400 text-gray-400" : "text-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <span className="text-2xl sm:text-3xl font-bold text-black">
          {formatPrice(product.discountPrice ?? product.price)}
        </span>
        {discount > 0 && (
          <>
            <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
            <Badge variant="destructive">{discount}% OFF</Badge>
          </>
        )}
      </div>

      {/* Stock */}
      <div>
        {product.stock > 0 ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-green-700 font-medium">
              {product.stock <= 5 ? `Only ${product.stock} left!` : "In Stock"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm text-red-600 font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {product.occasion.map((occ) => (
          <Badge key={occ} variant="secondary">{occ}</Badge>
        ))}
        {product.color.map((col) => (
          <Badge key={col} variant="outline">{col}</Badge>
        ))}
      </div>

      {/* Quantity + Wishlist */}
      {product.stock > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-50 text-black font-medium"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-semibold min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2 hover:bg-gray-50 text-black font-medium"
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={handleWishlist}
            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 w-full">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white text-black text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 shadow transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <Zap className="w-4 h-4" />
          Buy Now
        </button>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
      </div>

      {/* Delivery info */}
      <div className="border border-gray-200 rounded-xl p-3 sm:p-4 space-y-3">
        {[
          { icon: Truck, text: "Free delivery on orders above ₹999" },
          { icon: RefreshCw, text: "7-day easy returns & exchanges" },
          { icon: Package, text: "Secure packaging with premium gift wrapping" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-start gap-3 text-sm text-gray-600">
            <Icon className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
