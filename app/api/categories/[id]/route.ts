import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Category } from "@/models/Category";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    return Response.json({ success: true, data: category });
  } catch {
    return Response.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    await Category.findByIdAndUpdate(id, { isActive: false });
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
