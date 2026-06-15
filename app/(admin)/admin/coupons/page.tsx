import { connectDB } from "@/lib/db/mongoose";
import { Coupon } from "@/models/Coupon";
import { formatPrice } from "@/lib/utils";
import AdminCouponManager from "@/components/admin/AdminCouponManager";

async function getCoupons() {
  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(coupons));
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Coupons</h1>
      <AdminCouponManager initialCoupons={coupons} />
    </div>
  );
}
