import ProductGrid from "@/components/product/ProductGrid";
import { demoProducts } from "@/lib/demoData";
import type { IProduct } from "@/types";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

async function searchProducts(query: string): Promise<IProduct[]> {
  if (!query || query.length < 2) return [];

  try {
    const { connectDB } = await import("@/lib/db/mongoose");
    const { Product } = await import("@/models/Product");
    await connectDB();
    const products = await Product.find({
      isActive: true,
      $text: { $search: query },
    }).limit(48).populate("category", "name slug").lean();
    if (products.length > 0) return JSON.parse(JSON.stringify(products));
  } catch {
    // MongoDB not available
  }

  const q = query.toLowerCase();
  return demoProducts.filter(
    (p) => p.name.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q)
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const products = await searchProducts(q || "");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-black mb-2">
        {q ? `Search Results for "${q}"` : "Search"}
      </h1>
      <p className="text-gray-500 mb-8 text-sm">
        {q ? `${products.length} results found` : "Enter a search term to find sarees"}
      </p>
      <ProductGrid products={products} emptyMessage={q ? `No results for "${q}". Try different keywords.` : "Start searching..."} />
    </div>
  );
}
