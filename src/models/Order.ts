import mongoose, { Schema, Document } from "mongoose";

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String },
});

const AddressSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: "India" },
});

export interface IOrderDocument extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  items: typeof OrderItemSchema[];
  shippingAddress: typeof AddressSchema;
  paymentMethod: "razorpay" | "stripe" | "cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  subtotal: number;
  shippingCharge: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string;
  trackingNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  stripeSessionId?: string;
  notes?: string;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    shippingAddress: { type: AddressSchema, required: true },
    paymentMethod: { type: String, enum: ["razorpay", "stripe", "cod"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String },
    trackingNumber: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    stripeSessionId: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);
