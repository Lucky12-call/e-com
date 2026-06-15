"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle, MapPin, Truck, CreditCard, ClipboardCheck, ArrowRight, ArrowLeft, Shield, Package, Loader2 } from "lucide-react";
import gsap from "gsap";

type Step = 1 | 2 | 3 | 4;

interface Address {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Delhi","Jammu & Kashmir"
];

const stepInfo = [
  { label: "Address", icon: MapPin },
  { label: "Delivery", icon: Truck },
  { label: "Payment", icon: CreditCard },
  { label: "Review", icon: ClipboardCheck },
];

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getSubtotal, couponCode, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState<Address>({
    name: session?.user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => { setMounted(true); }, []);

  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  // Animate step transitions
  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" });
  }, [step]);

  if (mounted && items.length === 0) {
    router.push("/cart");
    return null;
  }

  const goStep = (s: Step) => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0, x: s > step ? -20 : 20, duration: 0.2,
        onComplete: () => setStep(s),
      });
    } else {
      setStep(s);
    }
  };

  const handlePlaceOrder = async () => {
    if (!session) { router.push("/login"); return; }
    setLoading(true);
    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
          shippingAddress: address, paymentMethod, couponCode,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error);

      if (paymentMethod === "razorpay") {
        const payRes = await fetch("/api/payment/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total, receipt: orderData.data.orderNumber }),
        });
        const payData = await payRes.json();
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: payData.data.amount, currency: "INR",
          name: "Silk & Grace", description: `Order ${orderData.data.orderNumber}`,
          order_id: payData.data.id,
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            await fetch("/api/payment/razorpay/verify", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature, orderId: orderData.data._id }),
            });
            clearCart();
            router.push(`/profile/orders?success=${orderData.data.orderNumber}`);
          },
          prefill: { name: address.name, contact: address.phone, email: session.user?.email },
          theme: { color: "#000000" },
        };
        // @ts-expect-error Razorpay loaded via CDN
        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        clearCart();
        router.push(`/profile/orders?success=${orderData.data.orderNumber}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      {/* Progress bar */}
      <div className="mb-8">
        <Progress value={(step / 4) * 100} className="h-1.5 mb-6" />
        <div className="flex justify-between">
          {stepInfo.map((s, i) => {
            const Icon = s.icon;
            const isActive = i + 1 === step;
            const isDone = i + 1 < step;
            return (
              <button
                key={s.label}
                onClick={() => isDone ? goStep((i + 1) as Step) : undefined}
                className={`flex flex-col items-center gap-1.5 transition-all ${isDone ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDone ? "bg-green-500 text-white shadow-lg shadow-green-500/25" :
                  isActive ? "bg-black text-white shadow-lg shadow-black/20" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium transition-colors ${isActive || isDone ? "text-black" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div ref={contentRef} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
            {/* Step 1: Address */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black">Shipping Address</h2>
                    <p className="text-xs text-gray-500">Where should we deliver your sarees?</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="Your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} type="tel" placeholder="+91 98765 43210" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Address Line 1 *</Label>
                    <Input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="House no., Street, Area" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Address Line 2</Label>
                    <Input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} placeholder="Landmark (optional)" />
                  </div>
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <Label>State *</Label>
                    <Select value={address.state} onValueChange={(v) => setAddress({ ...address, state: v })}>
                      <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pincode *</Label>
                    <Input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} maxLength={6} placeholder="395002" />
                  </div>
                </div>
                <Button
                  className="mt-8 h-12 px-8 rounded-xl gap-2 shadow-lg shadow-black/10"
                  onClick={() => goStep(2)}
                  disabled={!address.name || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode}
                >
                  Continue to Delivery <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Delivery */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black">Delivery Method</h2>
                    <p className="text-xs text-gray-500">Choose how you want to receive your order</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "standard", label: "Standard Delivery", time: "5-7 business days", price: subtotal >= 999 ? "Free" : "₹99", recommended: true },
                    { id: "express", label: "Express Delivery", time: "2-3 business days", price: "₹199", recommended: false },
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm ${
                      opt.id === "standard" ? "border-black bg-gray-50/50" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <input type="radio" name="delivery" defaultChecked={opt.id === "standard"} className="accent-black w-4 h-4" />
                      <Truck className="w-5 h-5 text-gray-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                          {opt.recommended && <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full">Recommended</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.time}</p>
                      </div>
                      <span className={`text-sm font-bold ${opt.price === "Free" ? "text-green-600" : "text-gray-900"}`}>{opt.price}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <Button variant="outline" onClick={() => goStep(1)} className="gap-2 h-12 px-6 rounded-xl">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button onClick={() => goStep(3)} className="gap-2 h-12 px-8 rounded-xl shadow-lg shadow-black/10">
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black">Payment Method</h2>
                    <p className="text-xs text-gray-500">Select your preferred payment option</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "razorpay", label: "UPI / Cards / NetBanking", desc: "Pay securely via Razorpay", icon: CreditCard },
                    { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive your order", icon: Package },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <label key={opt.id} className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer transition-all hover:shadow-sm ${
                        paymentMethod === opt.id ? "border-black bg-gray-50/50" : "border-gray-200 hover:border-gray-300"
                      }`}>
                        <input type="radio" name="payment" value={opt.id} checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id)} className="accent-black w-4 h-4" />
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 mt-5 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => goStep(2)} className="gap-2 h-12 px-6 rounded-xl">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button onClick={() => goStep(4)} className="gap-2 h-12 px-8 rounded-xl shadow-lg shadow-black/10">
                    Review Order <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-black">Review Your Order</h2>
                    <p className="text-xs text-gray-500">Please confirm everything looks right</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.map(({ product, quantity }) => (
                    <div key={product._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-14 h-18 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 relative">
                        <Image src={product.images?.[0] || "/placeholder-saree.svg"} alt={product.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {quantity}</p>
                      </div>
                      <span className="font-semibold text-sm">{formatPrice((product.discountPrice ?? product.price) * quantity)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-5" />

                {/* Shipping Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Shipping To</p>
                    <p className="text-sm font-semibold text-gray-900">{address.name}</p>
                    <p className="text-xs text-gray-600 mt-1">{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                    <p className="text-xs text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                    <p className="text-xs text-gray-600">{address.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Payment</p>
                    <div className="flex items-center gap-2">
                      {paymentMethod === "razorpay" ? <CreditCard className="w-4 h-4 text-gray-700" /> : <Package className="w-4 h-4 text-gray-700" />}
                      <p className="text-sm font-semibold text-gray-900">
                        {paymentMethod === "razorpay" ? "Razorpay (UPI / Cards)" : "Cash on Delivery"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => goStep(3)} className="gap-2 h-12 px-6 rounded-xl">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 gap-2 h-12 rounded-xl shadow-lg shadow-black/10 text-base"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                    ) : (
                      <>Place Order &middot; {formatPrice(total)}</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24 shadow-sm">
            <h3 className="font-bold text-black text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {mounted && items.map(({ product, quantity }) => (
                <div key={product._id} className="flex justify-between text-sm text-gray-700">
                  <span className="line-clamp-1 flex-1 mr-2">{product.name} <span className="text-gray-400">x{quantity}</span></span>
                  <span className="font-medium">{formatPrice((product.discountPrice ?? product.price) * quantity)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-600"><span>GST (5%)</span><span>{formatPrice(tax)}</span></div>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-black text-lg">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>

            {/* Trust badges */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5">
              {[
                { icon: Shield, text: "Secure checkout" },
                { icon: Truck, text: "Free shipping above ₹999" },
                { icon: Package, text: "Premium gift wrapping" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
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
