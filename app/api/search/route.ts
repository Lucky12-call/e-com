import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!q || q.length < 2) {
      return Response.json({ success: true, data: [] });
    }

    const products = await Product.find({
      isActive: true,
      $text: { $search: q },
    })
      .select("name slug images price discountPrice")
      .limit(limit)
      .lean();

    return Response.json({ success: true, data: products });
  } catch (error) {
    return Response.json({ success: false, error: "Search failed" }, { status: 500 });
  }
}
