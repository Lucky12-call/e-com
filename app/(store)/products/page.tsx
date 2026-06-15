import { Suspense } from "react";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import ProductSort from "@/components/product/ProductSort";
import Pagination from "@/components/shared/Pagination";
import { demoProducts, demoCategories } from "@/lib/demoData";
import type { IProduct, ICategory } from "@/types";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    fabric?: string;
    color?: string;
    tag?: string;
    featured?: string;
    search?: string;
  }>;
}

async function getProducts(params: Awaited<PageProps["searchParams"]>) {
  try {
    const { connectDB } = await import("@/lib/db/mongoose");
    const { Product } = await import("@/models/Product");
    const { Category } = await import("@/models/Category");
    await connectDB();

    const page = parseInt(params.page || "1");
    const limit = 12;
    const sort = params.sort || "newest";
    const query: Record<string, unknown> = { isActive: true };

    if (params.category) {
      const cat = await Category.findOne({ slug: params.category }).lean();
      if (cat) query.category = (cat as { _id: unknown })._id;
    }
    if (params.minPrice || params.maxPrice) {
      query.price = {};
      if (params.minPrice) (query.price as Record<string, number>).$gte = parseInt(params.minPrice);
      if (params.maxPrice) (query.price as Record<string, number>).$lte = parseInt(params.maxPrice);
    }
    if (params.fabric) query.fabric = { $in: params.fabric.split(",") };
    if (params.tag === "sale") query.discountPrice = { $exists: true, $gt: 0 };
    if (params.featured === "true") query.isFeatured = true;

    const sortMap: Record<string, string> = {
      newest: "-createdAt", price_asc: "price", price_desc: "-price",
      popular: "-soldCount", rating: "-averageRating",
    };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(limit).populate("category", "name slug").lean(),
      Product.countDocuments(query),
    ]);

    if (products.length === 0 && !params.category && !params.fabric && !params.search) return null;

    return {
      products: JSON.parse(JSON.stringify(products)) as IProduct[],
      total, page, totalPages: Math.ceil(total / limit),
    };
  } catch {
    return null;
  }
}

async function getCategories(): Promise<ICategory[]> {
  try {
    const { connectDB } = await import("@/lib/db/mongoose");
    const { Category } = await import("@/models/Category");
    await connectDB();
    const cats = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
    if (cats.length > 0) return JSON.parse(JSON.stringify(cats));
    return demoCategories;
  } catch {
    return demoCategories;
  }
}

function filterDemoProducts(params: Awaited<PageProps["searchParams"]>) {
  let filtered = [...demoProducts];

  if (params.featured === "true") filtered = filtered.filter((p) => p.isFeatured);
  if (params.fabric) {
    const fabrics = params.fabric.split(",");
    filtered = filtered.filter((p) => fabrics.includes(p.fabric));
  }
  if (params.minPrice) filtered = filtered.filter((p) => p.price >= parseInt(params.minPrice!));
  if (params.maxPrice) filtered = filtered.filter((p) => p.price <= parseInt(params.maxPrice!));
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q));
  }
  if (params.tag === "sale") filtered = filtered.filter((p) => p.discountPrice);

  const sort = params.sort || "newest";
  if (sort === "price_asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "popular") filtered.sort((a, b) => b.soldCount - a.soldCount);
  else if (sort === "rating") filtered.sort((a, b) => b.averageRating - a.averageRating);

  const page = parseInt(params.page || "1");
  const limit = 12;
  const start = (page - 1) * limit;

  return {
    products: filtered.slice(start, start + limit),
    total: filtered.length, page,
    totalPages: Math.ceil(filtered.length / limit),
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [dbResult, categories] = await Promise.all([getProducts(params), getCategories()]);
  const { products, total, page, totalPages } = dbResult || filterDemoProducts(params);

  const title = params.search
    ? `Search: "${params.search}"`
    : params.category
      ? params.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "All Sarees";

  // Build active filter tags
  const activeTags: { label: string; key: string; value: string | null }[] = [];
  if (params.category) {
    const cat = categories.find((c) => c.slug === params.category);
    activeTags.push({ label: cat?.name || params.category, key: "category", value: null });
  }
  if (params.fabric) {
    params.fabric.split(",").forEach((f) => {
      activeTags.push({ label: f, key: "fabric", value: null });
    });
  }
  if (params.minPrice || params.maxPrice) {
    const label = params.maxPrice
      ? `₹${Number(params.minPrice || 0).toLocaleString()} - ₹${Number(params.maxPrice).toLocaleString()}`
      : `₹${Number(params.minPrice).toLocaleString()}+`;
    activeTags.push({ label, key: "price", value: null });
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{total} {total === 1 ? "product" : "products"} found</p>

        {/* Active filter tags */}
        {activeTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs text-gray-400">Active:</span>
            {activeTags.map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: filter button + sort toolbar */}
      <div className="flex items-center gap-3 mb-5 lg:hidden">
        <div className="flex-1">
          <ProductFilters categories={categories} currentParams={params} />
        </div>
        <Suspense fallback={<div className="w-[140px] h-10 bg-gray-100 animate-pulse rounded-xl" />}>
          <ProductSort currentSort={params.sort || "newest"} />
        </Suspense>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-[280px] flex-shrink-0">
          <div className="lg:sticky lg:top-24">
            <ProductFilters categories={categories} currentParams={params} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Desktop Toolbar */}
          <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{products.length}</span> of <span className="font-medium text-gray-900">{total}</span> results
            </p>
            <Suspense fallback={<div className="w-[180px] h-9 bg-gray-100 animate-pulse rounded-lg" />}>
              <ProductSort currentSort={params.sort || "newest"} />
            </Suspense>
          </div>

          {/* Product Grid */}
          <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-100 rounded-xl mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          }>
            <ProductGrid products={products} emptyMessage="Try adjusting your filters or browse all sarees." />
          </Suspense>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
