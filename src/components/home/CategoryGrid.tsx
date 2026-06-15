"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStaggerChildren, useTextReveal } from "@/hooks/useGsapAnimations";

const categories = [
  {
    name: "Kanjivaram",
    slug: "kanjivaram-saree",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
  },
  {
    name: "Banarasi",
    slug: "banarasi-saree",
    image: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=400&h=500&fit=crop",
  },
  {
    name: "Silk Sarees",
    slug: "silk-sarees",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=500&fit=crop",
  },
  {
    name: "Cotton",
    slug: "cotton-saree",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=500&fit=crop",
  },
  {
    name: "Wedding",
    slug: "wedding-sarees",
    image: "https://images.unsplash.com/photo-1727430228383-aa1fb59db8bf?w=400&h=500&fit=crop",
  },
  {
    name: "Party Wear",
    slug: "party-wear-sarees",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop",
  },
];

export default function CategoryGrid() {
  const headerRef = useTextReveal();
  const gridRef = useStaggerChildren();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-10">
          <p className="text-gray-500 text-xs uppercase tracking-[0.2em] font-medium mb-2">Collections</p>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">Shop By Category</h2>
          <p className="text-gray-500 max-w-md mx-auto">Explore our curated collections of India&apos;s finest weaving traditions</p>
        </div>
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-100"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-white font-semibold text-sm">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
