import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ success: false, error: "Name, email and password are required" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ success: false, error: "Email already registered" }, { status: 409 });
    }

    const user = await User.create({ name, email, phone, password });

    return Response.json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email },
    }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return Response.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
