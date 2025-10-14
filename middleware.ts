import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // This is a client-side auth demo, so we'll handle redirects on the client
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
