import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/cookies";

const protectedPrefixes = ["/admin", "/super-admin", "/dashboard", "/analytics", "/management"];
const publicAdminPaths = ["/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", pathname);

  if (!isProtected || publicAdminPaths.includes(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const loginUrl = new URL(pathname.startsWith("/admin") || pathname.startsWith("/super-admin") ? "/admin/login" : "/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*", "/super-admin/:path*", "/dashboard/:path*", "/analytics/:path*", "/management/:path*"],
};
