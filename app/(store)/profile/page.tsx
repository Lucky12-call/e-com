import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/models/User";
import ProfileClient from "@/components/auth/ProfileClient";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectDB();
  const user = await User.findById(session.user.id).lean();
  if (!user) redirect("/login");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-black mb-8">My Profile</h1>
      <ProfileClient user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
