"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function FestivalBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const codeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(".fest-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
        .fromTo(titleRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" }, "-=0.2")
        .fromTo(".fest-desc", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3")
        .fromTo(codeRef.current, { scale: 0 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" }, "-=0.1")
        .fromTo(".fest-cta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-black text-white relative overflow-hidden"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.03),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <p className="fest-sub text-gray-400 text-xs uppercase tracking-[0.25em] mb-4 font-medium">
          Limited Time Only
        </p>
        <h2
          ref={titleRef}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Festival Season Sale
        </h2>
        <p className="fest-desc text-gray-400 mb-8 max-w-lg mx-auto text-lg">
          Up to 40% off on our festive collections. Use code{" "}
          <span
            ref={codeRef}
            className="inline-block bg-white text-black px-3 py-1 rounded font-bold text-base"
          >
            FESTIVE20
          </span>
        </p>
        <Link
          href="/products?tag=sale"
          className="fest-cta inline-flex items-center gap-2 px-10 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-base"
        >
          Shop the Sale
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
