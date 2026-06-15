import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/models/Product";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminProductActions from "@/components/admin/AdminProductActions";

async function getProducts() {
  await connectDB();
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .populate("category", "name")
    .lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product: {
                _id: string;
                slug: string;
                name: string;
                images: string[];
                brand: string;
                category: { name: string };
                price: number;
                discountPrice?: number;
                stock: number;
                isActive: boolean;
              }) => (
                <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        <img src={product.images[0]} alt={product.name} className="w-10 h-12 object-cover rounded" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{product.category?.name}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{formatPrice(product.discountPrice ?? product.price)}</p>
                    {product.discountPrice && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.stock === 0 ? "bg-red-100 text-red-700" :
                      product.stock <= 5 ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {product.stock === 0 ? "Out of Stock" : `${product.stock} in stock`}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <AdminProductActions productId={product._id} slug={product.slug} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
