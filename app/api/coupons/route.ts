import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Coupon } from "@/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return Response.json({ success: true, data: coupons });
  } catch {
    return Response.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const coupon = await Coupon.create(body);
    return Response.json({ success: true, data: coupon }, { status: 201 });
  } catch {
    return Response.json({ success: false, error: "Failed to create coupon" }, { status: 500 });
  }
}
