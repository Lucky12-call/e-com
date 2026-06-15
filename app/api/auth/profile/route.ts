import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models/User";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { name, phone } = await request.json();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { name, phone },
      { new: true }
    );

    return Response.json({ success: true, data: user });
  } catch (error) {
    return Response.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}
