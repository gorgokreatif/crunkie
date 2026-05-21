import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest, NextResponse } from "next/server";
import { verifySession } from "./lib/admin/auth";

const intlMiddleware = createMiddleware(routing);

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin API — no auth check on the auth endpoint itself
  if (pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  // Admin API routes — verify session, no intl
  if (pathname.startsWith("/api/admin")) {
    const token = req.cookies.get("admin-session")?.value;
    if (!token || !verifySession(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Admin UI login page — no auth check
  if (pathname === "/admin") {
    return NextResponse.next();
  }

  // Admin UI routes — verify session, redirect to login if invalid
  if (pathname.startsWith("/admin/")) {
    const token = req.cookies.get("admin-session")?.value;
    if (!token || !verifySession(token)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // All other routes — next-intl handles locale routing
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
