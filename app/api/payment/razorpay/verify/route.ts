import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import crypto from "crypto";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/models/Order";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = await request.json();

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return Response.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    await connectDB();
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
      razorpayOrderId,
      razorpayPaymentId,
    });

    return Response.json({ success: true, message: "Payment verified" });
  } catch (error) {
    return Response.json({ success: false, error: "Payment verification failed" }, { status: 500 });
  }
}
