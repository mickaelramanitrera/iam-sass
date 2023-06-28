import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};

export const middleware = (request: NextRequest) => {
  let currentUser = request.cookies.get("user");
  if (!currentUser?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  currentUser = JSON.parse(currentUser.value);

  if (!(currentUser as any)?.connected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};
