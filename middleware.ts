import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/election", "/results", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie && isProtectedRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/election/:path*", "/results/:path*", "/admin/:path*"],
};
