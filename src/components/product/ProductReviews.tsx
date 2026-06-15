"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { IReview } from "@/types";

interface Props {
  productId: string;
}

export default function ProductReviews({ productId }: Props) {
  const { data: session } = useSession();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { data: reviews = [], isLoading } = useQuery<IReview[]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const json = await res.json();
      return json.data ?? [];
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, body }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Review submitted for moderation!");
      setShowForm(false);
      setTitle(""); setBody(""); setRating(5);
      qc.invalidateQueries({ queryKey: ["reviews", productId] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Customer Reviews</h2>
        {session && !showForm && (
          <Button variant="outline" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
          <h3 className="font-semibold text-black mb-4">Your Review</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-700 mb-2">Rating</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setRating(i + 1)}>
                    <Star
                      className={`w-6 h-6 transition-colors ${i < rating ? "fill-yellow-400 text-gray-400" : "text-gray-300 hover:text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Input
              placeholder="Review title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Share your experience with this saree..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
            <div className="flex gap-3">
              <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !title || !body}>
                {mutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to review!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{(review.user as { name: string })?.name || "Customer"}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-400 text-gray-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <p className="font-medium text-gray-800 text-sm mb-1">{review.title}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
