"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Star, Check, X, Trash2 } from "lucide-react";

interface ReviewData {
  _id: string;
  rating: number;
  title: string;
  body: string;
  isApproved: boolean;
  createdAt: string;
  userId: { name: string; email: string };
  productId: { name: string; slug: string };
}

interface Props {
  initialReviews: ReviewData[];
}

export default function AdminReviewModeration({ initialReviews }: Props) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  const updateReview = async (id: string, update: Record<string, unknown>) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    return res.json();
  };

  const approve = async (id: string) => {
    const data = await updateReview(id, { isApproved: true });
    if (data.success) {
      setReviews((r) => r.map((rev) => rev._id === id ? { ...rev, isApproved: true } : rev));
      toast.success("Review approved");
    }
  };

  const reject = async (id: string) => {
    const data = await updateReview(id, { isApproved: false });
    if (data.success) {
      setReviews((r) => r.map((rev) => rev._id === id ? { ...rev, isApproved: false } : rev));
      toast.success("Review rejected");
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if ((await res.json()).success) {
      setReviews((r) => r.filter((rev) => rev._id !== id));
      toast.success("Review deleted");
    }
  };

  const filtered = reviews.filter((r) => {
    if (filter === "pending") return !r.isApproved;
    if (filter === "approved") return r.isApproved;
    return true;
  });

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-black text-white" : "bg-gray-100 text-black hover:bg-gray-200"}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({reviews.filter((r) => f === "all" ? true : f === "pending" ? !r.isApproved : r.isApproved).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((review) => (
          <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-400 text-gray-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${review.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {review.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <p className="font-medium text-gray-900">{review.title}</p>
                <p className="text-sm text-gray-600 mt-1">{review.body}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  <span>By: {review.userId?.name}</span>
                  <span>Product: {review.productId?.name}</span>
                  <span>{new Date(review.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4 flex-shrink-0">
                {!review.isApproved && (
                  <button onClick={() => approve(review._id)} className="p-1.5 rounded text-green-600 hover:bg-green-50" title="Approve">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                {review.isApproved && (
                  <button onClick={() => reject(review._id)} className="p-1.5 rounded text-yellow-600 hover:bg-yellow-50" title="Reject">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => deleteReview(review._id)} className="p-1.5 rounded text-red-500 hover:bg-red-50" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">No reviews in this category</div>
        )}
      </div>
    </div>
  );
}
