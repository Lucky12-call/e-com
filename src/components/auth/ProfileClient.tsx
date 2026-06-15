"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Package, Heart, MapPin } from "lucide-react";
import Link from "next/link";

interface Props {
  user: { _id: string; name: string; email: string; phone?: string; image?: string; role: string };
}

export default function ProfileClient({ user }: Props) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (data.success) toast.success("Profile updated!");
      else throw new Error(data.error);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    { href: "/profile/orders", icon: Package, label: "My Orders" },
    { href: "/wishlist", icon: Heart, label: "Wishlist" },
    { href: "/profile/addresses", icon: MapPin, label: "Addresses" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-black font-bold text-2xl">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              user.name[0].toUpperCase()
            )}
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.role === "admin" && (
              <span className="text-xs bg-gray-100 text-black px-2 py-0.5 rounded-full font-medium">Admin</span>
            )}
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Email</label>
            <Input value={user.email} disabled className="bg-gray-50 text-gray-400" />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="+91 98765 43210" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-4">
        {quickLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center hover:bg-gray-50 transition-colors gap-2"
          >
            <Icon className="w-6 h-6 text-black" />
            <span className="text-sm font-medium text-black">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
