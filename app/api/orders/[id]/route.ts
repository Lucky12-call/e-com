import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/models/Order";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id)
      .populate("items.product", "name images slug")
      .lean();

    if (!order) {
      return Response.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const isOwner = order.userId.toString() === session.user.id;
    const isAdmin = (session.user as { role?: string }).role === "admin";

    if (!isOwner && !isAdmin) {
      return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return Response.json({ success: true, data: order });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const order = await Order.findByIdAndUpdate(id, body, { new: true });

    if (!order) {
      return Response.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: order });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}
