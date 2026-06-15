import type { IProduct, ICategory } from "@/types";

// All verified working Unsplash image URLs for saree/Indian fashion
const IMG = {
  a: "https://images.unsplash.com/photo-1610030469983-98e550d6193c", // red/gold traditional saree
  b: "https://images.unsplash.com/photo-1612722432474-b971cdcea546", // saree on red background
  c: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb", // elegant saree drape
  d: "https://images.unsplash.com/photo-1727430228383-aa1fb59db8bf", // bridal red saree
  e: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944", // Indian traditional wear
  f: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4", // Indian fashion
  g: "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5", // ethnic wear
  h: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029", // textile/fabric
  i: "https://images.unsplash.com/photo-1614252369475-531eba835eb1", // Indian clothing
  j: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38", // traditional outfit
  k: "https://images.unsplash.com/photo-1594897030264-ab7d87efc473", // ethnic fashion
  l: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6", // festive wear
  m: "https://images.unsplash.com/photo-1589902860314-e910697dea18", // silk fabric detail
  n: "https://images.unsplash.com/photo-1590736704728-f4730bb30770", // traditional textile
};

function img(id: string, w = 600, h = 800) {
  return `${id}?w=${w}&h=${h}&fit=crop`;
}

function demo(overrides: Partial<IProduct> & { _id: string; name: string; slug: string }): IProduct {
  return {
    description: "Exquisite handcrafted saree made with premium fabric. Features beautiful traditional patterns and superior craftsmanship. Comes with matching blouse piece. Saree length: 5.5 meters, Blouse piece: 0.8 meters.",
    price: 9999,
    sku: "DEMO",
    stock: 20,
    images: [],
    category: "demo",
    fabric: "Silk",
    color: ["Red", "Gold"],
    occasion: ["Festival", "Wedding"],
    brand: "Silk & Grace",
    tags: ["saree", "indian wear"],
    isActive: true,
    isFeatured: false,
    averageRating: 4.5,
    reviewCount: 0,
    soldCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export const demoProducts: IProduct[] = [
  demo({
    _id: "d1", name: "Royal Banarasi Silk Saree", slug: "royal-banarasi-silk-saree",
    price: 15999, discountPrice: 12999, fabric: "Banarasi Silk",
    images: [img(IMG.a), img(IMG.b), img(IMG.f), img(IMG.h)],
    averageRating: 4.8, reviewCount: 142, isFeatured: true, occasion: ["Wedding", "Festival"],
  }),
  demo({
    _id: "d2", name: "Classic Kanjivaram Silk", slug: "classic-kanjivaram-silk",
    price: 28999, discountPrice: 24999, fabric: "Silk",
    images: [img(IMG.b), img(IMG.a), img(IMG.g), img(IMG.i)],
    averageRating: 4.9, reviewCount: 98, isFeatured: true, occasion: ["Wedding"],
  }),
  demo({
    _id: "d3", name: "Designer Georgette Saree", slug: "designer-georgette-saree",
    price: 7999, discountPrice: 5999, fabric: "Georgette",
    images: [img(IMG.c), img(IMG.e), img(IMG.f), img(IMG.k)],
    averageRating: 4.6, reviewCount: 53, isFeatured: true, occasion: ["Party"],
  }),
  demo({
    _id: "d4", name: "Bridal Red Silk Saree", slug: "bridal-red-silk-saree",
    price: 45999, discountPrice: 39999, fabric: "Silk",
    images: [img(IMG.d), img(IMG.a), img(IMG.b), img(IMG.j)],
    averageRating: 4.9, reviewCount: 204, isFeatured: true, occasion: ["Wedding"],
  }),
  demo({
    _id: "d5", name: "Pastel Chiffon Drape Saree", slug: "pastel-chiffon-drape",
    price: 4999, discountPrice: 3999, fabric: "Chiffon",
    images: [img(IMG.e), img(IMG.c), img(IMG.g), img(IMG.n)],
    averageRating: 4.3, reviewCount: 31, occasion: ["Party", "Casual"],
  }),
  demo({
    _id: "d6", name: "Handloom Cotton Daily Wear", slug: "handloom-cotton-daily",
    price: 2999, discountPrice: 2499, fabric: "Cotton",
    images: [img(IMG.f), img(IMG.h), img(IMG.e), img(IMG.n)],
    averageRating: 4.4, reviewCount: 67, occasion: ["Daily Wear", "Office"],
  }),
  demo({
    _id: "d7", name: "Tussar Silk Madhubani Print", slug: "tussar-silk-madhubani",
    price: 12999, discountPrice: 10999, fabric: "Tussar Silk",
    images: [img(IMG.g), img(IMG.a), img(IMG.i), img(IMG.m)],
    averageRating: 4.7, reviewCount: 45, occasion: ["Festival"],
  }),
  demo({
    _id: "d8", name: "Embroidered Net Party Saree", slug: "embroidered-net-party",
    price: 9999, discountPrice: 7499, fabric: "Net",
    images: [img(IMG.c), img(IMG.k), img(IMG.g), img(IMG.j)],
    averageRating: 4.5, reviewCount: 88, occasion: ["Party"],
  }),
  demo({
    _id: "d9", name: "Pure Mysore Silk Saree", slug: "pure-mysore-silk",
    price: 18999, discountPrice: 15499, fabric: "Silk",
    images: [img(IMG.b), img(IMG.d), img(IMG.f), img(IMG.i)],
    averageRating: 4.8, reviewCount: 312, soldCount: 580, occasion: ["Festival"],
  }),
  demo({
    _id: "d10", name: "Golden Zari Banarasi", slug: "golden-zari-banarasi",
    price: 22999, discountPrice: 18499, fabric: "Banarasi Silk",
    images: [img(IMG.a), img(IMG.d), img(IMG.j), img(IMG.h)],
    averageRating: 4.9, reviewCount: 187, soldCount: 420, occasion: ["Wedding", "Festival"],
  }),
  demo({
    _id: "d11", name: "Lightweight Chanderi Saree", slug: "lightweight-chanderi",
    price: 4999, discountPrice: 3999, fabric: "Chanderi",
    images: [img(IMG.i), img(IMG.e), img(IMG.c), img(IMG.k)],
    averageRating: 4.5, reviewCount: 156, soldCount: 350, occasion: ["Daily Wear"],
  }),
  demo({
    _id: "d12", name: "Kalamkari Print Cotton", slug: "kalamkari-print-cotton",
    price: 3499, discountPrice: 2799, fabric: "Cotton",
    images: [img(IMG.h), img(IMG.f), img(IMG.e), img(IMG.l)],
    averageRating: 4.6, reviewCount: 223, soldCount: 490, occasion: ["Casual"],
  }),
];

export const demoCategories: ICategory[] = [
  { _id: "c1", name: "Banarasi Saree", slug: "banarasi-saree", description: "Traditional Banarasi silk sarees", isActive: true, createdAt: new Date() },
  { _id: "c2", name: "Kanjivaram Saree", slug: "kanjivaram-saree", description: "Pure silk Kanjivaram sarees", isActive: true, createdAt: new Date() },
  { _id: "c3", name: "Chanderi Saree", slug: "chanderi-saree", description: "Lightweight Chanderi sarees", isActive: true, createdAt: new Date() },
  { _id: "c4", name: "Georgette Saree", slug: "georgette-saree", description: "Elegant georgette sarees", isActive: true, createdAt: new Date() },
  { _id: "c5", name: "Cotton Saree", slug: "cotton-saree", description: "Comfortable cotton sarees", isActive: true, createdAt: new Date() },
  { _id: "c6", name: "Chiffon Saree", slug: "chiffon-saree", description: "Lightweight chiffon sarees", isActive: true, createdAt: new Date() },
  { _id: "c7", name: "Tussar Saree", slug: "tussar-saree", description: "Natural tussar silk sarees", isActive: true, createdAt: new Date() },
  { _id: "c8", name: "Silk Saree", slug: "silk-sarees", description: "Premium silk sarees", isActive: true, createdAt: new Date() },
];

export function getDemoProductBySlug(slug: string): IProduct | null {
  return demoProducts.find((p) => p.slug === slug) || null;
}
