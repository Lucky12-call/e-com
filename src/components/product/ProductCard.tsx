"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import type { IProduct } from "@/types";
import { toast } from "sonner";
import gsap from "gsap";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const inWishlist = mounted && isInWishlist(product._id);
  const discount = calculateDiscount(product.price, product.discountPrice);

  useEffect(() => { setMounted(true); }, []);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;

    const handleEnter = () => {
      gsap.to(card, { y: -4, duration: 0.3, ease: "power2.out" });
      if (imageRef.current) gsap.to(imageRef.current, { scale: 1.06, duration: 0.5, ease: "power2.out" });
      if (actionsRef.current) gsap.to(actionsRef.current.children, { opacity: 1, x: 0, stagger: 0.06, duration: 0.3, ease: "back.out(1.7)" });
    };

    const handleLeave = () => {
      gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
      if (imageRef.current) gsap.to(imageRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
      if (actionsRef.current) gsap.to(actionsRef.current.children, { opacity: 0, x: 20, stagger: 0.04, duration: 0.2, ease: "power2.in" });
    };

    card.addEventListener("mouseenter", handleEnter);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mouseenter", handleEnter);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  useEffect(() => {
    if (actionsRef.current) gsap.set(actionsRef.current.children, { opacity: 0, x: 20 });
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success("Added to cart!");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist!");
  };

  const imgSrc = product.images?.[0] || "/placeholder-saree.svg";

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div ref={cardRef} className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <div ref={imageRef} className="absolute inset-0">
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                -{discount}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-black text-white text-[10px] font-medium px-2 py-0.5 rounded-md shadow-sm">
                Featured
              </span>
            )}
          </div>

          {/* Right-side hover action buttons */}
          <div ref={actionsRef} className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleWishlist}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-all duration-200"
            >
              <Heart className={`w-4 h-4 transition-colors ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-all duration-200 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full">Sold Out</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {product.brand && (
            <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">{product.brand}</p>
          )}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1.5 group-hover:text-black transition-colors">{product.name}</h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.round(product.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-black text-base">
              {formatPrice(product.discountPrice ?? product.price)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {/* Fabric tag */}
          {product.fabric && (
            <div className="mt-2.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100">
                {product.fabric}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
