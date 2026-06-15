"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ICategory } from "@/types";
import gsap from "gsap";

interface Props {
  categories: ICategory[];
  currentParams: Record<string, string | undefined>;
}

const fabrics = ["Silk", "Cotton", "Georgette", "Chiffon", "Crepe", "Linen", "Net"];
const occasions = ["Wedding", "Festival", "Party", "Daily Wear", "Office", "Casual"];
const priceRanges = [
  { label: "Under ₹1,000", min: "0", max: "999" },
  { label: "₹1,000 – ₹3,000", min: "1000", max: "3000" },
  { label: "₹3,000 – ₹8,000", min: "3000", max: "8000" },
  { label: "₹8,000+", min: "8000", max: "" },
];

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-2 group">
        <span className="text-sm font-semibold text-gray-900 group-hover:text-black">{title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[500px] opacity-100 pb-1" : "max-h-0 opacity-0"}`}>
        {children}
      </div>
    </div>
  );
}

function FilterContent({ categories, currentParams, updateFilter, clearAll, hasActiveFilters, activePriceRange, router, pathname }: {
  categories: ICategory[];
  currentParams: Record<string, string | undefined>;
  updateFilter: (key: string, value: string | null) => void;
  clearAll: () => void;
  hasActiveFilters: boolean;
  activePriceRange: typeof priceRanges[0] | undefined;
  router: ReturnType<typeof useRouter>;
  pathname: string;
}) {
  return (
    <>
      {/* Categories */}
      <FilterSection title="Category">
        <div className="space-y-0.5 pt-1">
          {categories.map((cat) => {
            const isActive = currentParams.category === cat.slug;
            return (
              <button
                key={cat._id}
                onClick={() => updateFilter("category", isActive ? null : cat.slug)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                  isActive ? "bg-black text-white font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <Separator />

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="grid grid-cols-2 gap-2 pt-1">
          {priceRanges.map((range) => {
            const isActive = activePriceRange === range;
            return (
              <button
                key={range.label}
                onClick={() => {
                  if (isActive) {
                    updateFilter("minPrice", null);
                    setTimeout(() => updateFilter("maxPrice", null), 0);
                  } else {
                    const params = new URLSearchParams();
                    Object.entries(currentParams).forEach(([k, v]) => {
                      if (v && k !== "minPrice" && k !== "maxPrice" && k !== "page") params.set(k, v);
                    });
                    if (range.min) params.set("minPrice", range.min);
                    if (range.max) params.set("maxPrice", range.max);
                    router.push(`${pathname}?${params.toString()}`);
                  }
                }}
                className={`text-xs px-3 py-2 rounded-lg border transition-all ${
                  isActive ? "bg-black text-white border-black font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <Separator />

      {/* Fabric */}
      <FilterSection title="Fabric">
        <div className="flex flex-wrap gap-2 pt-1">
          {fabrics.map((fabric) => {
            const currentFabrics = currentParams.fabric?.split(",").filter(Boolean) || [];
            const isChecked = currentFabrics.includes(fabric);
            return (
              <button
                key={fabric}
                onClick={() => {
                  const updated = isChecked ? currentFabrics.filter((f) => f !== fabric) : [...currentFabrics, fabric];
                  updateFilter("fabric", updated.length ? updated.join(",") : null);
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  isChecked ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {fabric}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <Separator />

      {/* Occasion */}
      <FilterSection title="Occasion" defaultOpen={false}>
        <div className="flex flex-wrap gap-2 pt-1">
          {occasions.map((occ) => {
            const currentOcc = currentParams.occasion?.split(",").filter(Boolean) || [];
            const isActive = currentOcc.includes(occ);
            return (
              <button
                key={occ}
                onClick={() => {
                  const updated = isActive ? currentOcc.filter((o) => o !== occ) : [...currentOcc, occ];
                  updateFilter("occasion", updated.length ? updated.join(",") : null);
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  isActive ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {occ}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </>
  );
}

export default function ProductFilters({ categories, currentParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v && k !== key && k !== "page") params.set(k, v);
    });
    if (value) params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => router.push(pathname);

  const hasActiveFilters = Object.entries(currentParams).some(([k, v]) => v && k !== "sort" && k !== "page");
  const activeCount = Object.entries(currentParams).filter(([k, v]) => v && k !== "sort" && k !== "page").length;

  const activePriceRange = priceRanges.find(
    (r) => r.min === (currentParams.minPrice || "") && r.max === (currentParams.maxPrice || "")
  );

  // Animate drawer open/close
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      if (overlayRef.current) gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      if (drawerRef.current) gsap.fromTo(drawerRef.current, { y: "100%" }, { y: "0%", duration: 0.35, ease: "power3.out" });
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeDrawer = () => {
    if (overlayRef.current) gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
    if (drawerRef.current) {
      gsap.to(drawerRef.current, { y: "100%", duration: 0.25, ease: "power2.in", onComplete: () => setMobileOpen(false) });
    } else {
      setMobileOpen(false);
    }
  };

  const sharedProps = { categories, currentParams, updateFilter, clearAll, hasActiveFilters, activePriceRange, router, pathname };

  return (
    <>
      {/* ── Mobile: Filter trigger button ── */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 hover:border-gray-300 hover:shadow-sm transition-all w-full justify-center"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Mobile: Drawer overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div ref={overlayRef} onClick={closeDrawer} className="absolute inset-0 bg-black/40" />

          {/* Drawer */}
          <div ref={drawerRef} className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col">
            {/* Drawer handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-600" />
                <span className="text-base font-bold text-gray-900">Filters</span>
              </div>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button onClick={() => { clearAll(); closeDrawer(); }} className="text-xs text-gray-500 hover:text-black">
                    Clear all
                  </button>
                )}
                <button onClick={closeDrawer} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Drawer content */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-1">
              <FilterContent {...sharedProps} />
            </div>

            {/* Drawer footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
              {hasActiveFilters && (
                <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => { clearAll(); closeDrawer(); }}>
                  Reset
                </Button>
              )}
              <Button className="flex-1 h-11 rounded-xl shadow-lg shadow-black/10" onClick={closeDrawer}>
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop: Sidebar ── */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-50/80 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-bold text-gray-900">Filters</span>
          </div>
          {hasActiveFilters && (
            <button onClick={clearAll} className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors">
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>

        <div className="px-5 py-3 space-y-1">
          <FilterContent {...sharedProps} />
        </div>
      </div>
    </>
  );
}
