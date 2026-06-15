"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import gsap from "gsap";

interface Props {
  images: string[];
  name: string;
}

export default function ProductImageGallery({ images, name }: Props) {
  const [current, setCurrent] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const imgs = images.length > 0 ? images : ["/placeholder-saree.svg"];

  // Animate on mount
  useEffect(() => {
    if (imageContainerRef.current) {
      gsap.fromTo(
        imageContainerRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
    if (thumbsRef.current) {
      gsap.fromTo(
        thumbsRef.current.children,
        { opacity: 0, x: -15, scale: 0.85 },
        { opacity: 1, x: 0, scale: 1, stagger: 0.08, duration: 0.4, delay: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, []);

  // Animate on image change
  useEffect(() => {
    if (imageContainerRef.current) {
      gsap.fromTo(
        imageContainerRef.current.querySelector("img"),
        { opacity: 0.6, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [current]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Vertical Thumbnails (left side on desktop, bottom on mobile) */}
      {imgs.length > 1 && (
        <div
          ref={thumbsRef}
          className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden md:max-h-[600px] pb-1 md:pb-0 md:pr-1 scrollbar-thin"
        >
          {imgs.map((imgSrc, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              onMouseEnter={() => setCurrent(i)}
              className={`relative flex-shrink-0 w-16 h-20 md:w-[76px] md:h-[95px] rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === current
                  ? "border-black shadow-md"
                  : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={imgSrc} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="76px" />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 min-w-0">
        <div
          ref={imageContainerRef}
          className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in group"
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            src={imgs[current]}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500"
            style={
              zoomed
                ? { transform: "scale(2)", transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                : {}
            }
            priority
          />
          {!zoomed && (
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg">
              <ZoomIn className="w-4 h-4 text-black" />
            </div>
          )}

          {imgs.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((c) => (c - 1 + imgs.length) % imgs.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-4 h-4 text-black" />
              </button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % imgs.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-4 h-4 text-black" />
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
            {current + 1}/{imgs.length}
          </div>
        </div>
      </div>
    </div>
  );
}
