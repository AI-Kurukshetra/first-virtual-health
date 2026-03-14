import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard"];

export default function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const adminCookie = req.cookies.get("cmms_admin_email");
  const pathname = req.nextUrl.pathname;
  const requiresAuth = PROTECTED.some((path) => pathname.startsWith(path));

  if (requiresAuth && !adminCookie) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && adminCookie) {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
