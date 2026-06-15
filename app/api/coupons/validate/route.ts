import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Coupon } from "@/models/Coupon";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { code, subtotal } = await request.json();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!coupon) {
      return Response.json({ success: false, error: "Invalid or expired coupon" }, { status: 400 });
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return Response.json({ success: false, error: "Coupon usage limit reached" }, { status: 400 });
    }

    if (subtotal < coupon.minOrderValue) {
      return Response.json(
        { success: false, error: `Minimum order value ₹${coupon.minOrderValue} required` },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.type === "fixed") discount = coupon.value;
    else if (coupon.type === "percentage") discount = Math.round((subtotal * coupon.value) / 100);
    else if (coupon.type === "free_shipping") discount = 99; // shipping charge

    return Response.json({
      success: true,
      data: { discount, type: coupon.type, value: coupon.value },
    });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to validate coupon" }, { status: 500 });
  }
}
