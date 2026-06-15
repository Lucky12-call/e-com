import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Review } from "@/models/Review";
import { Product } from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const query: Record<string, unknown> = { isApproved: true };
    if (productId) query.productId = productId;

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name image")
      .lean();

    return Response.json({ success: true, data: reviews });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
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
    const { productId, rating, title, body: reviewBody } = body;

    const existing = await Review.findOne({ productId, userId: session.user.id });
    if (existing) {
      return Response.json({ success: false, error: "You already reviewed this product" }, { status: 400 });
    }

    const review = await Review.create({
      productId,
      userId: session.user.id,
      rating,
      title,
      body: reviewBody,
      isApproved: false,
    });

    // Recalculate average rating
    const reviews = await Review.find({ productId, isApproved: true });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(avg * 10) / 10,
      reviewCount: reviews.length,
    });

    return Response.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create review" }, { status: 500 });
  }
}
