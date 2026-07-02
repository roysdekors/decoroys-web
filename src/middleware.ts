import { NextRequest, NextResponse } from "next/server";

const COMING_SOON = "/coming-soon";

export function middleware(request: NextRequest) {
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  // Bakım modu kapalıysa dokunma
  if (!maintenanceMode) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // /coming-soon sayfasının kendisine ve API rotalarına izin ver
  if (pathname.startsWith(COMING_SOON) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(COMING_SOON, request.url));
}

export const config = {
  matcher: [
    /*
     * Static dosyalar ve Next.js internalleri hariç her route'u yakala:
     * _next/static, _next/image, favicon.ico, public/images
     */
    "/((?!_next/static|_next/image|favicon\\.ico|images/).*)",
  ],
};
