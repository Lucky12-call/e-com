import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Category } from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
    return Response.json({ success: true, data: categories });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const category = await Category.create(body);
    return Response.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}
