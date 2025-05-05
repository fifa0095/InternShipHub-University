import { createMiddleware } from "@arcjet/next";
import aj from "./lib/arcjet";
import { NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|healthz).*)"],
};

const arcjetMiddleware = createMiddleware(aj);

export async function middleware(request) {
  const arcjetResponse = await arcjetMiddleware(request);
  let response = NextResponse.next();

  const { pathname } = request.nextUrl;

  // ✅ ไม่ต้องล็อกอินเฉพาะ path "/", "/login" และ "/register"
  const isUnprotectedRoute = pathname === "/" || pathname === "/login" || pathname === "/register" || pathname.startsWith("/blog/");

  if (!isUnprotectedRoute) {
    const token = request.cookies.get("token")?.value;
    const user = token ? await verifyAuth(token) : null;

    if (!user && pathname !== "/login") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Apply Arcjet headers (if any)
  if (arcjetResponse) {
    if (arcjetResponse.headers) {
      arcjetResponse.headers.forEach((value, key) => {
        response.headers.set(key, value);
      });
    }

    if (arcjetResponse.status && arcjetResponse.status !== 200) {
      return arcjetResponse;
    }
  }

  return response;
}
