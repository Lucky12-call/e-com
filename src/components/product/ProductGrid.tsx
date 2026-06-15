"use client";
import React, { useRef, useEffect } from "react";
import ProductCard from "./ProductCard";
import type { IProduct } from "@/types";
import { ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProductGridProps {
  products: IProduct[];
  emptyMessage?: string;
}

export default function ProductGrid({ products, emptyMessage = "No products found" }: ProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current || products.length === 0) return;

    const children = gridRef.current.children;
    gsap.fromTo(
      children,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [products]);

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-50 flex items-center justify-center">
          <ShoppingBag className="w-9 h-9 text-gray-300" />
        </div>
        <p className="text-gray-500 text-base font-medium mb-1">No products found</p>
        <p className="text-gray-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
