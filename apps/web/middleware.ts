import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/:path*", "/login"],
};

const forbiddenResponseOrRedirect = (request: NextRequest) => {
  const isApi = request.nextUrl.pathname.startsWith("/api");

  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.redirect(new URL("/login", request.url));
};

const handleLoginPageRedirections = (
  request: NextRequest,
  hasValidConnectionCookie: boolean
) => {
  if (hasValidConnectionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
};

export const middleware = (request: NextRequest) => {
  const currentUserCookie = request.cookies.get("user")?.value;
  const currentUser = JSON.parse(currentUserCookie || "{}");
  const isConnected = (currentUser as any)?.connected;
  const isOnLoginPage = request.nextUrl.pathname.startsWith("/login");
  const hasValidConnectionCookie = !!currentUserCookie && isConnected;

  if (isOnLoginPage) {
    return handleLoginPageRedirections(request, hasValidConnectionCookie);
  }

  if (!hasValidConnectionCookie) {
    return forbiddenResponseOrRedirect(request);
  }

  return NextResponse.next();
};
