import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturesBar from "@/components/home/FeaturesBar";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ProductSection from "@/components/home/ProductSection";
import FestivalBanner from "@/components/home/FestivalBanner";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/models/Product";
import type { IProduct } from "@/types";

function demo(overrides: Partial<IProduct> & { _id: string; name: string; slug: string }): IProduct {
  return {
    description: "",
    price: 9999,
    sku: "DEMO",
    stock: 20,
    images: [],
    category: "demo",
    fabric: "Silk",
    color: [],
    occasion: [],
    brand: "Silk & Grace",
    tags: [],
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

const demoFeatured: IProduct[] = [
  demo({
    _id: "d1", name: "Royal Banarasi Silk Saree", slug: "royal-banarasi-silk-saree",
    price: 15999, discountPrice: 12999, fabric: "Banarasi Silk",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop"],
    averageRating: 4.8, reviewCount: 142, isFeatured: true,
  }),
  demo({
    _id: "d2", name: "Classic Kanjivaram Silk", slug: "classic-kanjivaram-silk",
    price: 28999, discountPrice: 24999, fabric: "Silk",
    images: ["https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=600&h=800&fit=crop"],
    averageRating: 4.9, reviewCount: 98, isFeatured: true,
  }),
  demo({
    _id: "d3", name: "Designer Georgette Saree", slug: "designer-georgette-saree",
    price: 7999, discountPrice: 5999, fabric: "Georgette",
    images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop"],
    averageRating: 4.6, reviewCount: 53, isFeatured: true,
  }),
  demo({
    _id: "d4", name: "Bridal Red Silk Saree", slug: "bridal-red-silk-saree",
    price: 45999, discountPrice: 39999, fabric: "Silk",
    images: ["https://images.unsplash.com/photo-1727430228383-aa1fb59db8bf?w=600&h=800&fit=crop"],
    averageRating: 4.9, reviewCount: 204, isFeatured: true,
  }),
];

const demoNewArrivals: IProduct[] = [
  demo({
    _id: "d5", name: "Pastel Chiffon Drape Saree", slug: "pastel-chiffon-drape",
    price: 4999, discountPrice: 3999, fabric: "Chiffon",
    images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=800&fit=crop"],
    averageRating: 4.3, reviewCount: 31,
  }),
  demo({
    _id: "d6", name: "Handloom Cotton Daily Wear", slug: "handloom-cotton-daily",
    price: 2999, discountPrice: 2499, fabric: "Cotton",
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&h=800&fit=crop"],
    averageRating: 4.4, reviewCount: 67,
  }),
  demo({
    _id: "d7", name: "Tussar Silk Madhubani Print", slug: "tussar-silk-madhubani",
    price: 12999, discountPrice: 10999, fabric: "Tussar Silk",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop"],
    averageRating: 4.7, reviewCount: 45,
  }),
  demo({
    _id: "d8", name: "Embroidered Net Party Saree", slug: "embroidered-net-party",
    price: 9999, discountPrice: 7499, fabric: "Net",
    images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=800&fit=crop"],
    averageRating: 4.5, reviewCount: 88,
  }),
];

const demoBestSellers: IProduct[] = [
  demo({
    _id: "d9", name: "Pure Mysore Silk Saree", slug: "pure-mysore-silk",
    price: 18999, discountPrice: 15499, fabric: "Silk",
    images: ["https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=600&h=800&fit=crop"],
    averageRating: 4.8, reviewCount: 312, soldCount: 580,
  }),
  demo({
    _id: "d10", name: "Golden Zari Banarasi", slug: "golden-zari-banarasi",
    price: 22999, discountPrice: 18499, fabric: "Banarasi Silk",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop"],
    averageRating: 4.9, reviewCount: 187, soldCount: 420,
  }),
  demo({
    _id: "d11", name: "Lightweight Chanderi Saree", slug: "lightweight-chanderi",
    price: 4999, discountPrice: 3999, fabric: "Chanderi",
    images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=800&fit=crop"],
    averageRating: 4.5, reviewCount: 156, soldCount: 350,
  }),
  demo({
    _id: "d12", name: "Kalamkari Print Cotton", slug: "kalamkari-print-cotton",
    price: 3499, discountPrice: 2799, fabric: "Cotton",
    images: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&h=800&fit=crop"],
    averageRating: 4.6, reviewCount: 223, soldCount: 490,
  }),
];

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    await connectDB();
    const products = await Product.find({ isFeatured: true }).sort("-createdAt").limit(8).populate("category", "name slug").lean();
    return JSON.parse(JSON.stringify(products));
  } catch { return []; }
}

async function getNewArrivals(): Promise<IProduct[]> {
  try {
    await connectDB();
    const products = await Product.find({}).sort("-createdAt").limit(8).populate("category", "name slug").lean();
    return JSON.parse(JSON.stringify(products));
  } catch { return []; }
}

async function getBestSellers(): Promise<IProduct[]> {
  try {
    await connectDB();
    const products = await Product.find({}).sort("-soldCount").limit(8).populate("category", "name slug").lean();
    return JSON.parse(JSON.stringify(products));
  } catch { return []; }
}

export default async function HomePage() {
  const [featured, newArrivals, bestSellers] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getBestSellers(),
  ]);

  const showFeatured = featured.length > 0 ? featured : demoFeatured;
  const showNewArrivals = newArrivals.length > 0 ? newArrivals : demoNewArrivals;
  const showBestSellers = bestSellers.length > 0 ? bestSellers : demoBestSellers;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HeroBanner />
        <FeaturesBar />
        <CategoryGrid />

        <ProductSection
          title="Featured Sarees"
          subtitle="Handpicked from our finest collections"
          products={showFeatured}
          viewAllHref="/products?featured=true"
        />

        <div className="bg-gray-50">
          <ProductSection
            title="New Arrivals"
            subtitle="Fresh weaves just added to our collection"
            products={showNewArrivals}
            viewAllHref="/products?sort=newest"
          />
        </div>

        <ProductSection
          title="Best Sellers"
          subtitle="Our most loved sarees this season"
          products={showBestSellers}
          viewAllHref="/products?sort=popular"
        />

        <TestimonialsSection />
        <FestivalBanner />
      </main>
      <Footer />
    </div>
  );
}
