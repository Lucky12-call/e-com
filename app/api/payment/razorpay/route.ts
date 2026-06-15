import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { amount, currency = "INR", receipt } = await request.json();

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency,
      receipt,
    });

    return Response.json({ success: true, data: order });
  } catch (error) {
    console.error("Razorpay order error:", error);
    return Response.json({ success: false, error: "Failed to create payment order" }, { status: 500 });
  }
}
