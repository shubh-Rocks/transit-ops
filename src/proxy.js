import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const PUBLIC_ROUTES = ["/login"];

const ROLE_ACCESS = {
  FLEET_MANAGER: [
    "/dashboard",
    "/fleet",
    "/vehicles",
    "/drivers",
    "/trips",
    "/maintenance",
    "/maintenace",
    "/fuel-expenses",
    "/expenses",
    "/analytics",
    "/settings",
  ],

  DRIVER: ["/dashboard", "/trips"],

  SAFETY_OFFICER: ["/dashboard", "/drivers"],

  FINANCIAL_ANALYST: ["/dashboard", "/fuel-expenses", "/expenses", "/analytics"],
};

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) {
    if (token) {
      try {
        jwt.verify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch {
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const allowedRoutes = ROLE_ACCESS[decoded.role] || [];

    const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/fleet/:path*",
    "/vehicles/:path*",
    "/drivers/:path*",
    "/trips/:path*",
    "/maintenance/:path*",
    "/maintenace/:path*",
    "/fuel-expenses/:path*",
    "/expenses/:path*",
    "/analytics/:path*",
    "/settings/:path*",
    "/login",
  ],
};
