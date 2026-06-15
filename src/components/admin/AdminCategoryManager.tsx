"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { slugify } from "@/lib/utils";
import type { ICategory } from "@/types";

interface Props {
  categories: ICategory[];
}

export default function AdminCategoryManager({ categories: initial }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug: slugify(name), description }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories([...categories, data.data]);
        setName(""); setDescription("");
        toast.success("Category created!");
      }
    } catch {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setCategories(categories.filter((c) => c._id !== id));
      toast.success("Category deleted");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Create form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Add Category</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Silk Sarees" required />
          </div>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Premium silk weaves..." />
          </div>
          <Button type="submit" disabled={loading} className="gap-2">
            <Plus className="w-4 h-4" />
            {loading ? "Creating..." : "Create Category"}
          </Button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">All Categories ({categories.length})</h2>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-800">{cat.name}</p>
                <p className="text-xs text-gray-500">/{cat.slug}</p>
              </div>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${cat.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
                <button onClick={() => handleDelete(cat._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
