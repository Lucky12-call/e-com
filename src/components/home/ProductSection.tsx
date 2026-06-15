"use client";
import React from "react";
import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import { useTextReveal } from "@/hooks/useGsapAnimations";
import type { IProduct } from "@/types";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: IProduct[];
  viewAllHref?: string;
}

export default function ProductSection({ title, subtitle, products, viewAllHref }: ProductSectionProps) {
  const headerRef = useTextReveal();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-black mb-1">{title}</h2>
            {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-black hover:underline underline-offset-4 flex items-center gap-1"
            >
              View All →
            </Link>
          )}
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
