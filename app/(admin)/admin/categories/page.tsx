import { connectDB } from "@/lib/db/mongoose";
import { Category } from "@/models/Category";
import AdminCategoryManager from "@/components/admin/AdminCategoryManager";

async function getCategories() {
  await connectDB();
  const cats = await Category.find().sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(cats));
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Categories</h1>
      <AdminCategoryManager categories={categories} />
    </div>
  );
}
