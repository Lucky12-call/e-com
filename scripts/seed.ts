/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed script for Silk & Grace e-commerce platform
 * Run with: npx tsx scripts/seed.ts
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/silk-and-grace";

async function seed() {
  console.log("🌱 Seeding database...\n");

  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  const db = mongoose.connection.db!;

  // --- Categories ---
  const categoriesData = [
    { name: "Banarasi Saree", slug: "banarasi-saree", description: "Traditional Banarasi silk sarees with intricate zari work", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600" },
    { name: "Kanjivaram Saree", slug: "kanjivaram-saree", description: "Pure silk Kanjivaram sarees from Tamil Nadu", image: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=600" },
    { name: "Chanderi Saree", slug: "chanderi-saree", description: "Lightweight Chanderi cotton-silk sarees", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600" },
    { name: "Georgette Saree", slug: "georgette-saree", description: "Elegant georgette sarees for parties", image: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=600" },
    { name: "Cotton Saree", slug: "cotton-saree", description: "Comfortable everyday cotton sarees", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600" },
    { name: "Chiffon Saree", slug: "chiffon-saree", description: "Lightweight chiffon sarees with prints", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600" },
    { name: "Tussar Saree", slug: "tussar-saree", description: "Natural tussar silk sarees", image: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=600" },
    { name: "Paithani Saree", slug: "paithani-saree", description: "Traditional Maharashtra Paithani sarees with peacock motifs", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600" },
  ];

  await db.collection("categories").deleteMany({});
  const insertedCategories = await db.collection("categories").insertMany(
    categoriesData.map((c) => ({ ...c, createdAt: new Date(), updatedAt: new Date() }))
  );
  const categoryIds = Object.values(insertedCategories.insertedIds);
  console.log(`✅ Inserted ${categoryIds.length} categories`);

  // --- Products ---
  const colors = [
    { name: "Red", hex: "#DC2626" },
    { name: "Royal Blue", hex: "#1D4ED8" },
    { name: "Green", hex: "#15803D" },
    { name: "Pink", hex: "#EC4899" },
    { name: "Gold", hex: "#CA8A04" },
    { name: "Purple", hex: "#7C3AED" },
    { name: "Maroon", hex: "#7F1D1D" },
    { name: "Teal", hex: "#0F766E" },
    { name: "Orange", hex: "#EA580C" },
    { name: "Navy", hex: "#1E3A5F" },
  ];

  const productTemplates = [
    { name: "Royal Banarasi Silk Saree", catIndex: 0, fabric: "Banarasi Silk", price: 15999, discount: 12999, occasion: "Wedding" },
    { name: "Golden Zari Banarasi Saree", catIndex: 0, fabric: "Banarasi Silk", price: 22999, discount: 18499, occasion: "Wedding" },
    { name: "Classic Kanjivaram Silk Saree", catIndex: 1, fabric: "Silk", price: 28999, discount: 24999, occasion: "Wedding" },
    { name: "Temple Border Kanjivaram", catIndex: 1, fabric: "Silk", price: 35999, discount: 29999, occasion: "Festival" },
    { name: "Lightweight Chanderi Saree", catIndex: 2, fabric: "Cotton", price: 4999, discount: 3999, occasion: "Daily Wear" },
    { name: "Chanderi Silk Cotton Blend", catIndex: 2, fabric: "Cotton", price: 6999, discount: 5499, occasion: "Office" },
    { name: "Designer Georgette Saree", catIndex: 3, fabric: "Georgette", price: 7999, discount: 5999, occasion: "Party" },
    { name: "Sequin Work Georgette", catIndex: 3, fabric: "Georgette", price: 9999, discount: 7499, occasion: "Party" },
    { name: "Handloom Cotton Saree", catIndex: 4, fabric: "Cotton", price: 2999, discount: 2499, occasion: "Daily Wear" },
    { name: "Block Print Cotton Saree", catIndex: 4, fabric: "Cotton", price: 3499, discount: 2799, occasion: "Casual" },
    { name: "Floral Chiffon Saree", catIndex: 5, fabric: "Chiffon", price: 4499, discount: 3499, occasion: "Party" },
    { name: "Printed Chiffon Collection", catIndex: 5, fabric: "Chiffon", price: 3999, discount: 2999, occasion: "Casual" },
    { name: "Pure Tussar Silk Saree", catIndex: 6, fabric: "Silk", price: 12999, discount: 10999, occasion: "Festival" },
    { name: "Tussar Silk with Madhubani", catIndex: 6, fabric: "Silk", price: 16999, discount: 13999, occasion: "Festival" },
    { name: "Paithani Peacock Motif", catIndex: 7, fabric: "Silk", price: 19999, discount: 16999, occasion: "Wedding" },
    { name: "Traditional Paithani Saree", catIndex: 7, fabric: "Silk", price: 25999, discount: 21999, occasion: "Festival" },
    { name: "Bridal Banarasi Red", catIndex: 0, fabric: "Banarasi Silk", price: 45999, discount: 39999, occasion: "Wedding", featured: true },
    { name: "Mysore Silk Saree", catIndex: 1, fabric: "Silk", price: 18999, discount: 15499, occasion: "Festival", featured: true },
    { name: "Embroidered Georgette", catIndex: 3, fabric: "Georgette", price: 11999, discount: 8999, occasion: "Party", featured: true },
    { name: "Kalamkari Cotton Saree", catIndex: 4, fabric: "Cotton", price: 4499, discount: 3599, occasion: "Casual", featured: true },
  ];

  const products = productTemplates.map((t, i) => {
    const colorSet = [colors[i % colors.length], colors[(i + 3) % colors.length]];
    const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return {
      name: t.name,
      slug,
      description: `Exquisite ${t.name} crafted with premium ${t.fabric} fabric. Perfect for ${t.occasion.toLowerCase()} occasions. Features beautiful traditional patterns and superior craftsmanship. Comes with matching blouse piece. Saree length: 5.5 meters, Blouse piece: 0.8 meters.`,
      price: t.price,
      discountPrice: t.discount,
      sku: `SG-${String(i + 1001).padStart(5, "0")}`,
      category: categoryIds[t.catIndex],
      fabric: t.fabric,
      occasion: t.occasion,
      color: colorSet,
      sizes: ["Free Size"],
      images: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
        "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=800",
      ],
      stock: Math.floor(Math.random() * 50) + 10,
      isFeatured: t.featured || false,
      isNewArrival: i >= 14,
      isBestseller: i < 6,
      ratings: {
        average: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        count: Math.floor(Math.random() * 200) + 10,
      },
      tags: [t.fabric.toLowerCase(), t.occasion.toLowerCase(), "saree", "indian wear"],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
  });

  await db.collection("products").deleteMany({});
  const insertedProducts = await db.collection("products").insertMany(products);
  console.log(`✅ Inserted ${Object.keys(insertedProducts.insertedIds).length} products`);

  // --- Coupons ---
  const coupons = [
    { code: "WELCOME10", type: "percentage", value: 10, minOrder: 1000, maxDiscount: 500, usageLimit: 1000, usedCount: 0, isActive: true, expiresAt: new Date("2026-12-31"), description: "10% off on your first order" },
    { code: "SILK500", type: "fixed", value: 500, minOrder: 5000, maxDiscount: 500, usageLimit: 500, usedCount: 0, isActive: true, expiresAt: new Date("2026-12-31"), description: "Flat ₹500 off on orders above ₹5000" },
    { code: "FESTIVE20", type: "percentage", value: 20, minOrder: 3000, maxDiscount: 2000, usageLimit: 200, usedCount: 0, isActive: true, expiresAt: new Date("2026-12-31"), description: "Festival special 20% off" },
  ];

  await db.collection("coupons").deleteMany({});
  await db.collection("coupons").insertMany(
    coupons.map((c) => ({ ...c, createdAt: new Date(), updatedAt: new Date() }))
  );
  console.log(`✅ Inserted ${coupons.length} coupons`);

  console.log("\n🎉 Seeding complete!\n");
  console.log("Coupon codes: WELCOME10, SILK500, FESTIVE20");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
