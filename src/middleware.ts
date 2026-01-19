import { TOKEN_NAME } from "@/utils/constant";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  /^\/events(\/.*)?$/,
  /^\/fero-points(\/.*)?$/,
  /^\/go-live(\/.*)?$/,
  /^\/pricing(\/.*)?$/,
  /^\/profile(\/.*)?$/,
  /^\/settings(\/.*)?$/,
  /^\/find-events\/[^/]+$/,
  // /^\/dvi(\/.*)?$/,
  // /^\/issues(\/.*)?$/,
  // /^\/organizations(\/.*)?$/,
];
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(TOKEN_NAME)?.value;

  const isProtectedRoute = protectedRoutes.some((pattern) =>
    pattern.test(pathname),
  );

  // if (!token && request.nextUrl.pathname.startsWith("/events")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // if (!token && request.nextUrl.pathname.startsWith(":eventId")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  return NextResponse.next();
}
