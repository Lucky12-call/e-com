"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    tag: "New Season",
    title: "Kanjivaram Silk",
    subtitle: "Collection",
    description: "Handwoven by master artisans — each saree is a masterpiece of South Indian heritage.",
    cta: "Shop Kanjivaram",
    href: "/products?category=kanjivaram-saree",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&h=1080&fit=crop&q=85",
  },
  {
    id: 2,
    tag: "Bridal 2026",
    title: "Your Perfect",
    subtitle: "Wedding Saree",
    description: "Make every moment unforgettable with our curated bridal collection for your special day.",
    cta: "Explore Bridal",
    href: "/products?occasion=Wedding",
    image: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=1920&h=1080&fit=crop&q=85",
  },
  {
    id: 3,
    tag: "Heritage Weaves",
    title: "Banarasi",
    subtitle: "Brocade",
    description: "Celebrate every occasion draped in the rich tradition of centuries-old Banarasi weaving.",
    cta: "Shop Banarasi",
    href: "/products?category=banarasi-saree",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1920&h=1080&fit=crop&q=85",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const DURATION = 6000;

  const animateIn = useCallback(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (tagRef.current) tl.fromTo(tagRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
    if (titleRef.current) tl.fromTo(titleRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.15");
    if (descRef.current) tl.fromTo(descRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45 }, "-=0.25");
    if (ctaRef.current) tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");

    if (imageWrapRef.current) {
      gsap.fromTo(imageWrapRef.current, { scale: 1.08 }, { scale: 1, duration: 6.5, ease: "none" });
    }
  }, []);

  useEffect(() => { animateIn(); }, [current, animateIn]);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, DURATION);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current]);

  const goTo = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent(i);
  };

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ height: "clamp(500px, 80vh, 780px)" }}>
      {/* ── Background ── */}
      <div ref={imageWrapRef} className="absolute inset-[-4%]">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* ── Main Content ── */}
      <div className="relative z-10 h-full flex flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          {/* Tag */}
          <div ref={tagRef} className="mb-5">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {slide.tag}
            </span>
          </div>

          {/* Title */}
          <h1 ref={titleRef} className="mb-5">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold text-white leading-[1.05] tracking-tight">
              {slide.title}
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold text-white/50 leading-[1.05] tracking-tight">
              {slide.subtitle}
            </span>
          </h1>

          {/* Description */}
          <p ref={descRef} className="text-sm sm:text-base text-white/50 mb-8 max-w-md leading-relaxed">
            {slide.description}
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-3">
            <Link
              href={slide.href}
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              {slide.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-white/80 border border-white/25 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-200"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="absolute bottom-12 left-0 right-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 sm:gap-10">
          {[
            { value: "500+", label: "Sarees" },
            { value: "50K+", label: "Customers" },
            { value: "4.8★", label: "Rating" },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div className="w-px h-8 bg-white/15" />}
              <div>
                <p className="text-lg sm:text-xl font-bold text-white">{s.value}</p>
                <p className="text-[10px] text-white/35 uppercase tracking-wider">{s.label}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Slide Dots at Bottom ── */}
      <div className="absolute bottom-5 left-0 right-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className="group flex items-center gap-2 transition-all duration-300"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 h-2 bg-white"
                      : "w-2 h-2 bg-white/40 group-hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
