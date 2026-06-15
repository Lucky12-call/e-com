"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Shield, Truck, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import gsap from "gsap";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, couponCode, applyCoupon, removeCoupon } =
    useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".cart-item", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power2.out" });
      gsap.fromTo(".cart-summary", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power2.out" });
    }, containerRef);
    return () => ctx.revert();
  }, [mounted]);

  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax - discount;

  const handleRemoveItem = (productId: string) => {
    const el = document.getElementById(`cart-item-${productId}`);
    if (el) {
      gsap.to(el, {
        opacity: 0, x: -40, height: 0, padding: 0, margin: 0, duration: 0.35, ease: "power2.in",
        onComplete: () => { removeItem(productId); toast.success("Removed from cart"); },
      });
    } else {
      removeItem(productId);
      toast.success("Removed from cart");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        applyCoupon(couponInput.toUpperCase());
        setDiscount(data.data.discount);
        toast.success(`Coupon applied! You save ${formatPrice(data.data.discount)}`);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  if (mounted && items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-black mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven&apos;t added any beautiful sarees yet. Start exploring our collection!</p>
        <Link href="/products">
          <Button size="lg" className="gap-2 rounded-xl h-12 px-8 shadow-lg shadow-black/10">
            Explore Sarees <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">Shopping Cart</h1>
          {mounted && <p className="text-sm text-gray-500 mt-1">{items.length} {items.length === 1 ? "item" : "items"} in your cart</p>}
        </div>
        <Link href="/products" className="text-sm text-gray-500 hover:text-black transition-colors underline-offset-2 hover:underline">
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {mounted && items.map(({ product, quantity }) => (
            <div
              key={product._id}
              id={`cart-item-${product._id}`}
              className="cart-item flex gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow overflow-hidden"
            >
              <Link href={`/products/${product.slug}`} className="flex-shrink-0 group">
                <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-gray-50">
                  <Image
                    src={product.images[0] || "/placeholder-saree.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="96px"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/products/${product.slug}`} className="font-medium text-gray-900 hover:text-black line-clamp-2 text-sm">
                  {product.name}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  {product.brand && <span className="text-xs text-gray-500">{product.brand}</span>}
                  {product.fabric && <><span className="text-gray-300">|</span><span className="text-xs text-gray-500">{product.fabric}</span></>}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-gray-200">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-black text-sm">
                      {formatPrice((product.discountPrice ?? product.price) * quantity)}
                    </p>
                    {product.discountPrice && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(product.price * quantity)}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRemoveItem(product._id)}
                className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="cart-summary bg-white border border-gray-200 rounded-2xl p-6 sticky top-24 shadow-sm">
            <h2 className="text-lg font-bold text-black mb-5">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-5">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0 gap-1"
                >
                  <Tag className="w-3 h-3" />
                  Apply
                </Button>
              </div>
              {couponCode && (
                <div className="flex items-center justify-between mt-2 text-xs bg-green-50 rounded-lg px-3 py-2">
                  <span className="text-green-700 font-medium">{couponCode} applied</span>
                  <button onClick={() => { removeCoupon(); setDiscount(0); }} className="text-red-400 hover:text-red-600 font-medium">Remove</button>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({mounted ? items.length : 0} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold text-black text-lg mb-6">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full gap-2 h-12 rounded-xl shadow-lg shadow-black/10 text-sm font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            {/* Trust badges */}
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
              {[
                { icon: Shield, text: "Secure checkout" },
                { icon: Truck, text: "Free shipping above ₹999" },
                { icon: Package, text: "Easy 7-day returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
