import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Wishlist } from "@/models/Wishlist";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const wishlist = await Wishlist.findOne({ userId: session.user.id })
      .populate("products", "name slug images price discountPrice averageRating")
      .lean();

    return Response.json({ success: true, data: wishlist?.products ?? [] });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { productId } = await request.json();

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: session.user.id },
      { $addToSet: { products: productId } },
      { upsert: true, new: true }
    );

    return Response.json({ success: true, data: wishlist });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update wishlist" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { productId } = await request.json();

    await Wishlist.findOneAndUpdate(
      { userId: session.user.id },
      { $pull: { products: productId } }
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update wishlist" }, { status: 500 });
  }
}
