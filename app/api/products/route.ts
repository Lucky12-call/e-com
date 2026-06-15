import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/models/Product";
import type { ProductFilters } from "@/types";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sort = searchParams.get("sort") || "newest";
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const fabric = searchParams.get("fabric");
    const color = searchParams.get("color");
    const occasion = searchParams.get("occasion");
    const tag = searchParams.get("tag");
    const featured = searchParams.get("featured");

    const query: Record<string, unknown> = { isActive: true };

    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = parseInt(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = parseInt(maxPrice);
    }
    if (fabric) query.fabric = { $in: fabric.split(",") };
    if (color) query.color = { $in: color.split(",") };
    if (occasion) query.occasion = { $in: occasion.split(",") };
    if (tag === "new") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.createdAt = { $gte: thirtyDaysAgo };
    }
    if (tag === "sale") query.discountPrice = { $exists: true, $gt: 0 };
    if (featured === "true") query.isFeatured = true;
    if (search) query.$text = { $search: search };

    const sortMap: Record<string, string> = {
      newest: "-createdAt",
      price_asc: "price",
      price_desc: "-price",
      popular: "-soldCount",
      rating: "-averageRating",
    };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortMap[sort] || sortMap.newest)
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .lean(),
      Product.countDocuments(query),
    ]);

    return Response.json({
      success: true,
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Products API error:", error);
    return Response.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const product = await Product.create(body);
    return Response.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return Response.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
