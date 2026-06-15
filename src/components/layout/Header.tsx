"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Heart, Search, User, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const navLinks = [
  { name: "All Sarees", href: "/products" },
  { name: "Silk", href: "/products?fabric=Silk" },
  { name: "Cotton", href: "/products?fabric=Cotton" },
  { name: "Banarasi", href: "/products?category=banarasi-saree" },
  { name: "Kanjivaram", href: "/products?category=kanjivaram-saree" },
  { name: "Wedding", href: "/products?occasion=Wedding" },
  { name: "Party Wear", href: "/products?occasion=Party" },
];

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const headerRef = useRef<HTMLElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!headerRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(topBarRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" })
      .fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3");
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
      )}
    >
      {/* Top bar */}
      <div ref={topBarRef} className="bg-black text-white text-xs py-2 text-center tracking-wide">
        Free shipping on orders above ₹999 &nbsp;|&nbsp; Use code{" "}
        <span className="font-semibold">WELCOME10</span> for 10% off
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-black tracking-tight leading-none">Silk & Grace</span>
              <span className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Premium Indian Sarees</span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sarees, fabrics, occasions..."
                className="w-full pl-4 pr-12 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-400 bg-gray-50 text-black placeholder-gray-400"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-gray-50 text-gray-700 hover:text-black">
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative p-2 rounded-full hover:bg-gray-50 text-gray-700 hover:text-black">
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-50 text-gray-700">
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-3 h-3 hidden md:block" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-black">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                  </div>
                  <Link href="/profile" className="block px-3 py-2 text-sm hover:bg-gray-50 text-gray-700">My Profile</Link>
                  <Link href="/profile/orders" className="block px-3 py-2 text-sm hover:bg-gray-50 text-gray-700">My Orders</Link>
                  {(session.user as { role?: string })?.role === "admin" && (
                    <Link href="/admin" className="block px-3 py-2 text-sm hover:bg-gray-50 text-gray-700 font-medium">Admin Panel</Link>
                  )}
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center gap-1 px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                Sign In
              </Link>
            )}

            <button className="md:hidden p-2 text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 h-10 border-t border-gray-100 text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-600 hover:text-black transition-colors font-medium">
              {link.name}
            </Link>
          ))}
          <Link href="/products?tag=new" className="text-red-600 font-medium hover:text-red-700">New Arrivals</Link>
          <Link href="/products?tag=sale" className="text-green-600 font-medium hover:text-green-700">Sale</Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sarees..."
              className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-gray-400"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block py-2 text-gray-700 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
          </div>
          {!session && (
            <Link href="/login" className="block text-center py-2 bg-black text-white rounded-full font-medium" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
