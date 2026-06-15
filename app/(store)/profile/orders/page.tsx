import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/models/Order";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Package } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-700",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const orders = await Order.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .populate("items.product", "name images")
    .lean();

  const serialized = JSON.parse(JSON.stringify(orders));

  if (serialized.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-black mb-3">No orders yet</h2>
        <p className="text-gray-500 mb-8">Start shopping and your orders will appear here!</p>
        <Link href="/products" className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-black mb-8">My Orders</h1>
      <div className="space-y-4">
        {serialized.map((order: {
          _id: string;
          orderNumber: string;
          items: { product: { name: string; images: string[] }; quantity: number; price: number }[];
          total: number;
          orderStatus: string;
          paymentStatus: string;
          createdAt: string;
        }) => (
          <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-black">{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100"}`}>
                  {order.orderStatus}
                </span>
                <p className="text-sm font-bold text-black mt-1">{formatPrice(order.total)}</p>
              </div>
            </div>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {item.product?.images?.[0] && (
                    <img src={item.product.images[0]} alt={item.product?.name} className="w-10 h-12 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.product?.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity} · {formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
