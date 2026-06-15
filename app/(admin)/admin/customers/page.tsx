import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

async function getCustomers() {
  await connectDB();
  const users = await User.find({ role: "user" }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(users));
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Customers ({customers.length})</h1>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                {["Name", "Email", "Phone", "Joined", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((user: {
                _id: string;
                name: string;
                email: string;
                phone?: string;
                createdAt: string;
                isEmailVerified: boolean;
              }) => (
                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-black flex items-center justify-center font-bold text-sm">
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{user.email}</td>
                  <td className="px-5 py-3 text-gray-600">{user.phone || "—"}</td>
                  <td className="px-5 py-3 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.isEmailVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {user.isEmailVerified ? "Verified" : "Unverified"}
                    </span>
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
