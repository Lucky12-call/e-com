import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/models/Product";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: product });
  } catch (error) {
    console.error("Get product error:", error);
    return Response.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const body = await request.json();
    const product = await Product.findOneAndUpdate({ slug }, body, { new: true });
    if (!product) {
      return Response.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return Response.json({ success: true, data: product });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    await Product.findOneAndUpdate({ slug }, { isActive: false });
    return Response.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
