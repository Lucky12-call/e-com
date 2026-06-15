"use client";
import React from "react";
import { Truck, RefreshCw, Shield, Headphones } from "lucide-react";
import { useStaggerChildren } from "@/hooks/useGsapAnimations";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
  { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: Shield, title: "Secure Payment", desc: "100% secure transactions" },
  { icon: Headphones, title: "24/7 Support", desc: "Expert customer care" },
];

export default function FeaturesBar() {
  const ref = useStaggerChildren();

  return (
    <div className="bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-black text-sm">{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
