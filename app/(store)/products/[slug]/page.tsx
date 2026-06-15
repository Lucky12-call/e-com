import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductReviews from "@/components/product/ProductReviews";
import ProductSection from "@/components/home/ProductSection";
import { demoProducts, getDemoProductBySlug } from "@/lib/demoData";
import type { IProduct } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    const { connectDB } = await import("@/lib/db/mongoose");
    const { Product } = await import("@/models/Product");
    await connectDB();
    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .lean();
    if (product) return JSON.parse(JSON.stringify(product)) as IProduct;
  } catch {
    // MongoDB not available
  }
  return getDemoProductBySlug(slug);
}

async function getRelated(product: IProduct): Promise<IProduct[]> {
  try {
    const { connectDB } = await import("@/lib/db/mongoose");
    const { Product } = await import("@/models/Product");
    await connectDB();
    const related = await Product.find({
      _id: { $ne: product._id },
      category: typeof product.category === "object" ? (product.category as { _id: string })._id : product.category,
      isActive: true,
    }).limit(8).lean();
    if (related.length > 0) return JSON.parse(JSON.stringify(related));
  } catch {
    // MongoDB not available
  }
  return demoProducts.filter((p) => p._id !== product._id && p.fabric === product.fabric).slice(0, 4);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Silk & Grace`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const related = await getRelated(product);

  const colorDisplay = Array.isArray(product.color)
    ? product.color.map((c) => (typeof c === "object" && c !== null ? (c as { name: string }).name : String(c))).join(", ")
    : "";

  const occasionDisplay = Array.isArray(product.occasion)
    ? product.occasion.map((o) => (typeof o === "string" ? o : String(o))).join(", ")
    : "";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex gap-2">
        <a href="/" className="hover:text-black">Home</a>
        <span>/</span>
        <a href="/products" className="hover:text-black">Sarees</a>
        <span>/</span>
        <span className="text-black truncate max-w-48">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-16">
        <ProductImageGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Product Details */}
      <div className="mb-16 bg-gray-50 rounded-2xl p-5 sm:p-6">
        <h3 className="text-xl font-bold text-black mb-4">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {[
            ["Fabric", product.fabric],
            ["Brand", product.brand],
            ["Occasion", occasionDisplay],
            ["Color", colorDisplay],
            ["SKU", product.sku],
          ].map(([label, value]) => (
            value ? (
              <div key={label} className="flex gap-2">
                <span className="text-gray-600 font-medium w-24">{label}:</span>
                <span className="text-gray-700">{value}</span>
              </div>
            ) : null
          ))}
        </div>
      </div>

      {/* Reviews */}
      <ProductReviews productId={product._id} />

      {/* Related Products */}
      {related.length > 0 && (
        <ProductSection
          title="You May Also Like"
          products={related}
          viewAllHref="/products"
        />
      )}
    </div>
  );
}
