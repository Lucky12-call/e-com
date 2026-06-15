import { connectDB } from "@/lib/db/mongoose";
import { Review } from "@/models/Review";
import AdminReviewModeration from "@/components/admin/AdminReviewModeration";

async function getReviews() {
  await connectDB();
  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email")
    .populate("productId", "name slug")
    .lean();
  return JSON.parse(JSON.stringify(reviews));
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Review Moderation</h1>
      <AdminReviewModeration initialReviews={reviews} />
    </div>
  );
}
