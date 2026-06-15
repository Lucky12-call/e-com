import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();

  const [product, categories] = await Promise.all([
    Product.findOne({ slug }).lean(),
    Category.find({}).sort("name").lean(),
  ]);

  if (!product) notFound();

  const serialized = JSON.parse(JSON.stringify(product));
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm
        categories={serializedCategories}
        initialData={serialized}
        slug={slug}
      />
    </div>
  );
}
