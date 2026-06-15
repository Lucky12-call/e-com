"use client";
import React from "react";
import { Star, Quote } from "lucide-react";
import { useStaggerChildren, useTextReveal } from "@/hooks/useGsapAnimations";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Absolutely stunning Kanjivaram saree! The quality is exceptional and it arrived beautifully packed. Will definitely order again.",
    product: "Pure Silk Kanjivaram",
  },
  {
    name: "Anitha Reddy",
    location: "Hyderabad",
    rating: 5,
    text: "Bought a Banarasi for my daughter's wedding. The weaving is exquisite and the colors are even more vibrant in person!",
    product: "Banarasi Brocade",
  },
  {
    name: "Meera Nair",
    location: "Kochi",
    rating: 4,
    text: "Great collection and fast delivery. The cotton saree is very comfortable for daily wear. The packaging was elegant.",
    product: "Handloom Cotton",
  },
  {
    name: "Sunita Patel",
    location: "Surat",
    rating: 5,
    text: "Third order from Silk & Grace! Every time the quality is consistent and the variety keeps improving. My go-to store.",
    product: "Crepe Silk Saree",
  },
];

export default function TestimonialsSection() {
  const headerRef = useTextReveal();
  const gridRef = useStaggerChildren();

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="text-center mb-10">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-medium mb-2">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">What Our Customers Say</h2>
          <p className="text-gray-500 max-w-md mx-auto">Real reviews from real saree lovers across India</p>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-400 relative"
            >
              <Quote className="absolute top-4 right-4 w-6 h-6 text-gray-100 group-hover:text-gray-200 transition-colors" />

              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-black text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location} · {t.product}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
