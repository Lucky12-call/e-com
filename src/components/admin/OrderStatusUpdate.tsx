"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];

interface Props {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusUpdate({ orderId, currentStatus }: Props) {
  const router = useRouter();

  const handleChange = async (status: string) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus: status }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Order status updated");
      router.refresh();
    } else {
      toast.error("Failed to update status");
    }
  };

  return (
    <select
      defaultValue={currentStatus}
      onChange={(e) => handleChange(e.target.value)}
      className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-500"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
