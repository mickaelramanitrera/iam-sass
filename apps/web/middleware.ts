import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/:path*"],
};

const forbiddenResponse = (request: NextRequest) => {
  const isApi = request.nextUrl.pathname.startsWith("/api");

  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.redirect(new URL("/login", request.url));
};

export const middleware = (request: NextRequest) => {
  let currentUser = request.cookies.get("user");
  if (!currentUser?.value) {
    return forbiddenResponse(request);
  }

  currentUser = JSON.parse(currentUser.value);

  if (!(currentUser as any)?.connected) {
    return forbiddenResponse(request);
  }

  return NextResponse.next();
};
