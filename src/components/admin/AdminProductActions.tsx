"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  productId: string;
  slug: string;
}

export default function AdminProductActions({ productId, slug }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Product deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/products/${slug}/edit`}
        className="p-1.5 rounded text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button
        onClick={handleDelete}
        className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
