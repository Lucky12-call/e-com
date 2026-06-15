"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { ICoupon } from "@/types";

interface Props {
  initialCoupons: ICoupon[];
}

export default function AdminCouponManager({ initialCoupons }: Props) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrderValue: "0",
    maxUses: "100",
    expiresAt: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, value: parseFloat(form.value), minOrderValue: parseFloat(form.minOrderValue), maxUses: parseInt(form.maxUses) }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons([data.data, ...coupons]);
        setForm({ code: "", type: "percentage", value: "", minOrderValue: "0", maxUses: "100", expiresAt: "" });
        toast.success("Coupon created!");
      }
    } catch { toast.error("Failed to create coupon"); }
    finally { setLoading(false); }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const res = await fetch(`/api/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if ((await res.json()).success) {
      setCoupons(coupons.map((c) => c._id === id ? { ...c, isActive: !isActive } : c));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Create Coupon</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Code *</label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SAVE20" required />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Type *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border rounded-md px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-black">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Value *</label>
              <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === "percentage" ? "20" : "200"} required />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Min Order (₹)</label>
              <Input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Max Uses</label>
              <Input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Expires At *</label>
              <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="gap-2">
            <Plus className="w-4 h-4" />
            {loading ? "Creating..." : "Create Coupon"}
          </Button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">All Coupons</h2>
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-gray-600" />
                  <span className="font-bold text-black">{coupon.code}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {coupon.type === "percentage" ? `${coupon.value}% off` :
                   coupon.type === "fixed" ? `₹${coupon.value} off` : "Free shipping"} ·
                  Min ₹{coupon.minOrderValue} · {coupon.usedCount}/{coupon.maxUses} used
                </p>
                <p className="text-xs text-gray-400">Expires: {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}</p>
              </div>
              <button
                onClick={() => toggleActive(coupon._id, coupon.isActive)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${coupon.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {coupon.isActive ? "Active" : "Disabled"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
