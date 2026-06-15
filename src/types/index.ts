export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  _id?: string;
  userId: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stock: number;
  images: string[];
  category: string | ICategory;
  fabric: string;
  color: string[];
  occasion: string[];
  brand: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  soldCount: number;
  careInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICart {
  _id: string;
  userId?: string;
  sessionId?: string;
  items: ICartItem[];
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: {
    product: IProduct;
    quantity: number;
    price: number;
  }[];
  shippingAddress: IAddress;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface ICoupon {
  _id: string;
  code: string;
  type: "fixed" | "percentage" | "free_shipping";
  value: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface IReview {
  _id: string;
  productId: string;
  userId: string;
  user: IUser;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  isApproved: boolean;
  createdAt: Date;
}

export interface IWishlist {
  _id: string;
  userId: string;
  products: string[];
  createdAt: Date;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string[];
  fabric?: string[];
  occasion?: string[];
  brand?: string[];
  rating?: number;
  inStock?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "popular" | "rating";
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
