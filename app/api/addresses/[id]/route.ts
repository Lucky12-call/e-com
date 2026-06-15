import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Address } from "@/models/Address";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const body = await req.json();

    if (body.isDefault) {
      await Address.updateMany({ userId: session.user.id }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: id, user: session.user.id },
      body,
      { new: true }
    );

    if (!address) {
      return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: address });
  } catch (error) {
    console.error("PUT /api/addresses/[id] error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const address = await Address.findOneAndDelete({ _id: id, user: session.user.id });
    if (!address) {
      return NextResponse.json({ success: false, error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Address deleted" });
  } catch (error) {
    console.error("DELETE /api/addresses/[id] error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
