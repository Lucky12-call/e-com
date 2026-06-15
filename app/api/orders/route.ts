import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Coupon } from "@/models/Coupon";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const query =
      (session.user as { role?: string }).role === "admin"
        ? {}
        : { userId: session.user.id };

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("items.product", "name images slug")
        .lean(),
      Order.countDocuments(query),
    ]);

    return Response.json({
      success: true,
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, couponCode } = body;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return Response.json(
          { success: false, error: `Insufficient stock for ${product?.name}` },
          { status: 400 }
        );
      }
      const price = product.discountPrice ?? product.price;
      subtotal += price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price,
        name: product.name,
        image: product.images[0],
      });
    }

    const shippingCharge = subtotal >= 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05); // 5% GST
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
        $expr: { $lt: ["$usedCount", "$maxUses"] },
      });

      if (coupon && subtotal >= coupon.minOrderValue) {
        if (coupon.type === "fixed") discount = coupon.value;
        else if (coupon.type === "percentage") discount = Math.round((subtotal * coupon.value) / 100);
        else if (coupon.type === "free_shipping") discount = shippingCharge;
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }

    const total = subtotal + shippingCharge + tax - discount;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: session.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCharge,
      tax,
      discount,
      total,
      couponCode,
    });

    // Update stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }

    return Response.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return Response.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}
