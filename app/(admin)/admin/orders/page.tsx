import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/models/Order";
import { formatPrice } from "@/lib/utils";
import OrderStatusUpdate from "@/components/admin/OrderStatusUpdate";

async function getOrders() {
  await connectDB();
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .lean();
  return JSON.parse(JSON.stringify(orders));
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-100 text-gray-700",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Orders</h1>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", "Update"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order: {
                _id: string;
                orderNumber: string;
                userId: { name: string; email: string };
                items: unknown[];
                total: number;
                paymentStatus: string;
                orderStatus: string;
                createdAt: string;
              }) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-black text-xs">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{order.userId?.name}</p>
                    <p className="text-xs text-gray-500">{order.userId?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.items.length} item(s)</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100"}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusUpdate orderId={order._id} currentStatus={order.orderStatus} />
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
