"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn, ArrowRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import gsap from "gsap";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" });
      gsap.fromTo(".login-header", { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out" });
      gsap.fromTo(".login-social", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.35, ease: "power2.out" });
      gsap.fromTo(".login-divider", { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.4, delay: 0.45, ease: "power2.out" });
      if (formRef.current) {
        gsap.fromTo(formRef.current.children, { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, delay: 0.5, ease: "power2.out" });
      }
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
      if (cardRef.current) {
        gsap.to(cardRef.current, { x: -8, duration: 0.08, yoyo: true, repeat: 5, ease: "power2.inOut" });
      }
    } else {
      toast.success("Welcome back!");
      router.push(callbackUrl);
    }
  };

  const handleGoogle = () => signIn("google", { callbackUrl });

  return (
    <div className="w-full max-w-md px-4">
      <div ref={cardRef} className="bg-white rounded-3xl shadow-2xl shadow-black/5 p-8 md:p-10 border border-gray-100">
        {/* Header */}
        <div className="login-header text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-black tracking-tight">Silk & Grace</h1>
            <p className="text-[10px] text-gray-400 tracking-[0.25em] uppercase">Premium Indian Sarees</p>
          </Link>
          <p className="text-gray-500 text-sm mt-3">Welcome back! Sign in to continue</p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          className="login-social w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 mb-6"
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
        <div className="login-divider relative mb-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs uppercase text-gray-400 tracking-wider">or</span>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email address</Label>
            <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === "email" ? "border-black ring-2 ring-black/5" : "border-gray-200"}`}>
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-black transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === "password" ? "border-black ring-2 ring-black/5" : "border-gray-200"}`}>
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
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
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-black font-semibold hover:underline underline-offset-2">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center animate-pulse">
          <div className="h-8 w-40 bg-gray-200 rounded mx-auto mb-4" />
          <div className="h-4 w-56 bg-gray-100 rounded mx-auto" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
