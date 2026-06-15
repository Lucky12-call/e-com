import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await connectDB();
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        "paymentDetails.transactionId": session.payment_intent,
        "paymentDetails.paidAt": new Date(),
        status: "processing",
      });
      console.log(`✅ Order ${orderId} payment confirmed via Stripe`);
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await connectDB();
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "failed",
        status: "cancelled",
      });
    }
  }

  return NextResponse.json({ received: true });
}
