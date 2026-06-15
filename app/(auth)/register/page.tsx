"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import gsap from "gsap";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
  { label: "Contains uppercase", test: (p: string) => /[A-Z]/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" });
      gsap.fromTo(".reg-header", { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out" });
      gsap.fromTo(".reg-social", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.35, ease: "power2.out" });
      gsap.fromTo(".reg-divider", { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.4, delay: 0.45, ease: "power2.out" });
      if (formRef.current) {
        gsap.fromTo(formRef.current.children, { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, delay: 0.5, ease: "power2.out" });
      }
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      if (cardRef.current) {
        gsap.to(cardRef.current, { x: -8, duration: 0.08, yoyo: true, repeat: 5, ease: "power2.inOut" });
      }
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      toast.success("Account created! Welcome to Silk & Grace");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
      if (cardRef.current) {
        gsap.to(cardRef.current, { x: -8, duration: 0.08, yoyo: true, repeat: 5, ease: "power2.inOut" });
      }
    } finally {
      setLoading(false);
    }
  };

  const passedRules = PASSWORD_RULES.filter((r) => r.test(form.password));

  return (
    <div className="w-full max-w-md px-4">
      <div ref={cardRef} className="bg-white rounded-3xl shadow-2xl shadow-black/5 p-8 md:p-10 border border-gray-100">
        {/* Header */}
        <div className="reg-header text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-black tracking-tight">Silk & Grace</h1>
            <p className="text-[10px] text-gray-400 tracking-[0.25em] uppercase">Premium Indian Sarees</p>
          </Link>
          <p className="text-gray-500 text-sm mt-3">Create your account to get started</p>
        </div>

        {/* Google Sign Up */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="reg-social w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="reg-divider relative mb-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs uppercase text-gray-400 tracking-wider">or</span>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Full Name</Label>
            <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === "name" ? "border-black ring-2 ring-black/5" : "border-gray-200"}`}>
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Priya Sharma"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="reg-email" className="text-gray-700">Email address</Label>
            <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === "email" ? "border-black ring-2 ring-black/5" : "border-gray-200"}`}>
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="reg-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700">Phone <span className="text-gray-400 text-xs">(optional)</span></Label>
            <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === "phone" ? "border-black ring-2 ring-black/5" : "border-gray-200"}`}>
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="reg-password" className="text-gray-700">Password</Label>
            <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === "password" ? "border-black ring-2 ring-black/5" : "border-gray-200"}`}>
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Min 8 characters"
                required
                className="w-full pl-10 pr-12 py-3 rounded-xl text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password strength */}
            {form.password.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-1">
                  {PASSWORD_RULES.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < passedRules.length ? "bg-green-500" : "bg-gray-200"}`} />
                  ))}
                </div>
                <div className="space-y-1">
                  {PASSWORD_RULES.map((r) => (
                    <div key={r.label} className="flex items-center gap-1.5 text-[11px]">
                      <CheckCircle className={`w-3 h-3 transition-colors ${r.test(form.password) ? "text-green-500" : "text-gray-300"}`} />
                      <span className={r.test(form.password) ? "text-green-600" : "text-gray-400"}>{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl gap-2 text-sm font-semibold shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 hover:-translate-y-0.5 transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-semibold hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
