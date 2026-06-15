"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scaleIn";
  delay?: number;
  stagger?: boolean;
}

export default function AnimatedSection({
  children,
  className = "",
  animation = "fadeUp",
  delay = 0,
  stagger = false,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const animationMap = {
      fadeUp: { from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0 } },
      fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      slideLeft: { from: { opacity: 0, x: -80 }, to: { opacity: 1, x: 0 } },
      slideRight: { from: { opacity: 0, x: 80 }, to: { opacity: 1, x: 0 } },
      scaleIn: { from: { opacity: 0, scale: 0.85 }, to: { opacity: 1, scale: 1 } },
    };

    const anim = animationMap[animation];
    const target = stagger ? ref.current.children : ref.current;

    gsap.fromTo(target, anim.from, {
      ...anim.to,
      duration: 0.8,
      delay,
      ease: "power3.out",
      stagger: stagger ? 0.12 : 0,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, [animation, delay, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
