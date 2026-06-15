"use client";
import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useTextReveal, useStaggerChildren } from "@/hooks/useGsapAnimations";

export default function Footer() {
  const nlRef = useTextReveal();
  const linksRef = useStaggerChildren();

  return (
    <footer className="bg-black text-white">
      {/* Newsletter */}
      <div className="border-b border-gray-800 py-14">
        <div ref={nlRef} className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-3">Join Our Newsletter</h3>
          <p className="text-gray-400 mb-6 text-sm max-w-md mx-auto">
            Get exclusive offers, new arrivals, and festive collection updates
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-full text-sm bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-all"
            />
            <button
              type="submit"
              className="group px-6 py-3 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              Subscribe
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div ref={linksRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-2">Silk & Grace</h2>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Premium Indian Sarees curated for every occasion. Celebrating the timeless elegance of
              Indian weaving traditions.
            </p>
            <div className="flex gap-3">
              {[
                { label: "Instagram", svg: "M7.8 2h8.4C19 2 22 5 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C5 22 2 19 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" },
                { label: "Facebook", svg: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                { label: "Twitter", svg: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" },
                { label: "Youtube", svg: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" },
              ].map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label={item.label}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.svg} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ["All Sarees", "/products"],
                ["New Arrivals", "/products?tag=new"],
                ["Best Sellers", "/products?sort=popular"],
                ["Sale", "/products?tag=sale"],
                ["Wedding Collection", "/products?occasion=Wedding"],
                ["Silk Sarees", "/products?fabric=Silk"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Customer Service</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ["My Account", "/profile"],
                ["Track Order", "/profile/orders"],
                ["Return Policy", "/returns"],
                ["Shipping Info", "/shipping"],
                ["Size Guide", "/size-guide"],
                ["FAQs", "/faq"],
                ["Contact Us", "/contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                <span>123 Textile Market, Surat, Gujarat 395002, India</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0 text-gray-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0 text-gray-500" />
                <span>support@silkandgrace.com</span>
              </li>
            </ul>
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2">We accept</p>
              <div className="flex gap-2">
                {["UPI", "Cards", "NetBanking", "COD"].map((m) => (
                  <span key={m} className="px-2 py-0.5 text-[10px] rounded bg-gray-800 text-gray-300 border border-gray-700">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>&copy; 2026 Silk & Grace. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
