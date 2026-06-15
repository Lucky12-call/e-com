import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Review } from "@/models/Review";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const review = await Review.findByIdAndUpdate(id, body, { new: true });
    return Response.json({ success: true, data: review });
  } catch {
    return Response.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    await Review.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false, error: "Failed" }, { status: 500 });
  }
}
