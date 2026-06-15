"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import type { ICategory } from "@/types";

interface Props {
  categories: ICategory[];
  initialData?: Record<string, unknown>;
  slug?: string;
}

const fabrics = ["Silk", "Cotton", "Georgette", "Chiffon", "Crepe", "Linen", "Net", "Banarasi Silk"];
const occasions = ["Wedding", "Festival", "Party", "Daily Wear", "Office", "Casual"];

export default function ProductForm({ categories, initialData, slug }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: (initialData?.name as string) || "",
    slug: (initialData?.slug as string) || "",
    description: (initialData?.description as string) || "",
    price: (initialData?.price as string) || "",
    discountPrice: (initialData?.discountPrice as string) || "",
    sku: (initialData?.sku as string) || "",
    stock: (initialData?.stock as string) || "0",
    category: (initialData?.category as string) || "",
    fabric: (initialData?.fabric as string) || "",
    brand: (initialData?.brand as string) || "",
    careInstructions: (initialData?.careInstructions as string) || "",
    isFeatured: (initialData?.isFeatured as boolean) || false,
    isActive: initialData?.isActive !== undefined ? (initialData.isActive as boolean) : true,
    images: (initialData?.images as string[]) || [],
    color: ((initialData?.color as string[]) || []).join(", "),
    occasion: (initialData?.occasion as string[]) || [],
    tags: ((initialData?.tags as string[]) || []).join(", "),
  });

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: slugify(name) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.success) urls.push(data.data.url);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      toast.success(`${urls.length} image(s) uploaded`);
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        ...form,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
        stock: parseInt(form.stock),
        color: form.color.split(",").map((c) => c.trim()).filter(Boolean),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const res = await fetch(slug ? `/api/products/${slug}` : "/api/products", {
        method: slug ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success(slug ? "Product updated!" : "Product created!");
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Basic Info */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 mb-2">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-700 mb-1 block">Product Name *</label>
            <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-700 mb-1 block">Slug</label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-700 mb-1 block">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 mb-2">Pricing & Inventory</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Price (₹) *</label>
            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} min="0" required />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Discount Price (₹)</label>
            <Input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} min="0" />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">SKU *</label>
            <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} required />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Stock *</label>
            <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} min="0" required />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 mb-2">Product Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded-md px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Fabric *</label>
            <select
              value={form.fabric}
              onChange={(e) => setForm({ ...form, fabric: e.target.value })}
              className="w-full border rounded-md px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Select fabric</option>
              {fabrics.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Brand *</label>
            <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Colors (comma-separated)</label>
            <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Red, Gold, Blue" />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Occasion</label>
            <div className="flex flex-wrap gap-2">
              {occasions.map((occ) => (
                <label key={occ} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.occasion.includes(occ)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...form.occasion, occ]
                        : form.occasion.filter((o) => o !== occ);
                      setForm({ ...form, occasion: updated });
                    }}
                    className="accent-black"
                  />
                  {occ}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Tags (comma-separated)</label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="bridal, silk, traditional" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-700 mb-1 block">Care Instructions</label>
            <textarea
              value={form.careInstructions}
              onChange={(e) => setForm({ ...form, careInstructions: e.target.value })}
              rows={2}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Dry clean only..."
            />
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-black" />
            Featured Product
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-black" />
            Active
          </label>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Product Images</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {form.images.map((url, i) => (
            <div key={i} className="relative w-24 h-32 rounded-lg overflow-hidden border">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <label className="w-24 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-500">
            <Upload className="w-5 h-5 mb-1" />
            <span className="text-xs">{uploading ? "Uploading..." : "Add Image"}</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : slug ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
