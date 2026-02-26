import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];

    // Convert base64url → base64
    const base64 = base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(base64Url.length + (4 - (base64Url.length % 4)) % 4, "=");

    const decodedPayload = atob(base64);
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get("adminToken")?.value;
  const tenantToken = request.cookies.get("tenantToken")?.value;
  const { pathname } = request.nextUrl;

  let token: string | undefined;

  if (pathname.startsWith("/admin")) {
    token = adminToken;
  }

  if (pathname.startsWith("/tenant")) {
    token = tenantToken;
  }

  console.log("ADMIN TOKEN:", !!adminToken);
  console.log("TENANT TOKEN:", !!tenantToken);

  console.log("PATH:", pathname);
  console.log("TOKEN:", !!token);

  if (!token) {
    console.log("NO TOKEN → LOGIN");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = parseJwt(token);
  console.log("DECODED:", decoded);

  if (!decoded || !decoded.role) {
    console.log("INVALID TOKEN → LOGIN");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const role = decoded.role;
  console.log("ROLE:", role);

  if (pathname.startsWith("/tenant") && role === "admin") {
    console.log("ADMIN BLOCKED FROM TENANT");
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname.startsWith("/admin") && role === "tenant") {
    console.log("TENANT BLOCKED FROM ADMIN");
    return NextResponse.redirect(new URL("/tenant/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/tenant",
    "/tenant/:path*",
  ],
};