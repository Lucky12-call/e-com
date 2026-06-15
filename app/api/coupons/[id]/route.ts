import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Coupon } from "@/models/Coupon";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true });
    return Response.json({ success: true, data: coupon });
  } catch {
    return Response.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
