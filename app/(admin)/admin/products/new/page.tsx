import { connectDB } from "@/lib/db/mongoose";
import { Category } from "@/models/Category";
import ProductForm from "@/components/admin/ProductForm";

async function getCategories() {
  await connectDB();
  const cats = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(cats));
}

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
