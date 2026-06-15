import mongoose, { Schema, Document } from "mongoose";

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

export interface ICartDocument extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: typeof CartItemSchema[];
  couponCode?: string;
}

const CartSchema = new Schema<ICartDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String },
    items: [CartItemSchema],
    couponCode: { type: String },
  },
  { timestamps: true }
);

CartSchema.index({ userId: 1 });
CartSchema.index({ sessionId: 1 });

export const Cart = mongoose.models.Cart || mongoose.model<ICartDocument>("Cart", CartSchema);
