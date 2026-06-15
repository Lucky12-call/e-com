import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes require authentication (checked at layout level via server-side auth)
  // Protected user routes (checkout, profile, wishlist) checked at page level
  // Proxy only handles lightweight redirects/rewrites here

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)",
  ],
};
