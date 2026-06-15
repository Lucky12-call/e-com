import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-3xl font-bold text-black mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to shopping!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-black transition-all hover:shadow-xl"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 border-2 border-gray-300 text-black font-semibold rounded-full hover:bg-gray-50 transition-all"
          >
            Browse Sarees
          </Link>
        </div>
      </div>
    </div>
  );
}
