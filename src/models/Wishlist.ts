import mongoose, { Schema, Document } from "mongoose";

export interface IWishlistDocument extends Document {
  userId: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

const WishlistSchema = new Schema<IWishlistDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

WishlistSchema.index({ userId: 1 });

export const Wishlist =
  mongoose.models.Wishlist || mongoose.model<IWishlistDocument>("Wishlist", WishlistSchema);
