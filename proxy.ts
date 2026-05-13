import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ── Flip / basic phone UA patterns ───────────────────────────────
const FLIP_PATTERNS = [
  /KDDI/i,
  /Nokia/i,
  /SonyEricsson/i,
  /BlackBerry/i,
  /MOT-/i,
  /SCH-/i,
  /SPH-/i,
  /SGH-/i,
  /GT-B/i,
  /WAP/i,
  /MIDP/i,
  /CLDC/i,
  /SymbianOS/i,
  /Series40/i,
  /Series60/i,
  /Brew/i,
  /NetFront/i,
  /MAUI/i,
  /UP\.Browser/i,
  /Obigo/i,
  /Teleca/i,
]

export function middleware(request: NextRequest) {
  const ua  = request.headers.get("user-agent") || ""
  const url = request.nextUrl

  // Skip static assets, API, and the flip page itself
  if (
    url.pathname.startsWith("/flip") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next")
  ) {
    return NextResponse.next()
  }

  // Redirect flip/basic phones to lightweight version
  const isFlip = FLIP_PATTERNS.some(p => p.test(ua))
  if (isFlip) {
    return NextResponse.redirect(new URL("/flip", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|icons|api).*)"],
}
