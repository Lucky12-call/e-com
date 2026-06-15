import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Address } from "@/models/Address";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const addresses = await Address.find({ userId: session.user.id }).sort("-isDefault -createdAt");
    return NextResponse.json({ success: true, data: addresses });
  } catch (error) {
    console.error("GET /api/addresses error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    // If setting as default, unset others
    if (body.isDefault) {
      await Address.updateMany({ userId: session.user.id }, { isDefault: false });
    }

    const address = await Address.create({
      ...body,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true, data: address }, { status: 201 });
  } catch (error) {
    console.error("POST /api/addresses error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
