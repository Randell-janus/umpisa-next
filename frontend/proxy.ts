import { NextResponse, type NextRequest } from "next/server";

import { TOKEN_COOKIE } from "@/lib/graphql";

export function proxy(request: NextRequest) {
  if (!request.cookies.has(TOKEN_COOKIE)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};
