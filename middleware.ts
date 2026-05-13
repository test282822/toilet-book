import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// UA patterns that indicate basic/flip phones
const FLIP_PATTERNS = [
  /KDDI/i,
  /Nokia/i,
  /SonyEricsson/i,
  /BlackBerry/i,
  /MOT-/i,           // Motorola flip
  /SCH-/i,           // Samsung flip
  /SPH-/i,           // Samsung flip
  /SGH-/i,           // Samsung basic
  /GT-B/i,           // Samsung basic
  /LG-/i,
  /WAP/i,
  /MIDP/i,           // Java ME devices
  /CLDC/i,
  /SymbianOS/i,
  /Series40/i,       // Nokia Series 40
  /Series60/i,
  /Brew/i,
  /NetFront/i,       // Basic phone browser
  /MAUI/i,
  /UP\.Browser/i,
  /Obigo/i,
  /Teleca/i,
]

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || ""
  const url = request.nextUrl

  // Skip if already on flip page or API routes
  if (
    url.pathname.startsWith("/flip") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next")
  ) {
    return NextResponse.next()
  }

  // Check if it's a flip/basic phone
  const isFlip = FLIP_PATTERNS.some(pattern => pattern.test(ua))

  if (isFlip) {
    return NextResponse.redirect(new URL("/flip", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|icons|api).*)"],
}
