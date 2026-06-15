import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, Users, TrendingUp, Clock, CheckCircle, Truck, DollarSign } from "lucide-react";

async function getStats() {
  await connectDB();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalProducts, totalOrders, totalUsers,
    revenueData, recentOrders, pendingOrders
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    User.countDocuments({ role: "user" }),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .lean(),
    Order.countDocuments({ orderStatus: "pending" }),
  ]);

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: revenueData[0]?.total ?? 0,
    recentOrders: JSON.parse(JSON.stringify(recentOrders)),
    pendingOrders,
  };
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: "bg-gray-50 text-black" },
    { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: ShoppingCart, color: "bg-blue-50 text-blue-800" },
    { label: "Total Customers", value: stats.totalUsers.toLocaleString(), icon: Users, color: "bg-green-50 text-green-800" },
    { label: "Active Products", value: stats.totalProducts.toLocaleString(), icon: Package, color: "bg-purple-50 text-purple-800" },
    { label: "Pending Orders", value: stats.pendingOrders.toLocaleString(), icon: Clock, color: "bg-orange-50 text-orange-800" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-gray-600 hover:underline">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Order #", "Customer", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order: {
                _id: string;
                orderNumber: string;
                userId: { name: string; email: string };
                total: number;
                orderStatus: string;
                createdAt: string;
              }) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-black">{order.orderNumber}</td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium text-gray-800">{order.userId?.name}</p>
                      <p className="text-xs text-gray-500">{order.userId?.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
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
