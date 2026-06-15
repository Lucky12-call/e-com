import mongoose, { Schema, Document } from "mongoose";

export interface ICouponDocument extends Document {
  code: string;
  type: "fixed" | "percentage" | "free_shipping";
  value: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date;
}

const CouponSchema = new Schema<ICouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["fixed", "percentage", "free_shipping"], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0 },
    maxUses: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1 });

export const Coupon =
  mongoose.models.Coupon || mongoose.model<ICouponDocument>("Coupon", CouponSchema);
