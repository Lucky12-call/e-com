import mongoose, { Schema, Document } from "mongoose";

export interface IReviewDocument extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  isApproved: boolean;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    images: [{ type: String }],
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1, isApproved: 1 });
ReviewSchema.index({ userId: 1 });

export const Review = mongoose.models.Review || mongoose.model<IReviewDocument>("Review", ReviewSchema);
