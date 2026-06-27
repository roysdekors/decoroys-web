/**
 * Next.js 16 Proxy — Admin Route Güvenlik Katmanı
 *
 * Next.js 16'da middleware yerine proxy.ts kullanılır.
 * Bu dosya projedeki TEK güvenlik duvarı katmanıdır (edge seviyesinde).
 *
 * Firebase Auth token'ı client-side localStorage'da tutulur (cookie değil),
 * bu yüzden edge katmanında tam token doğrulaması yapılamaz.
 * İleride HttpOnly session cookie entegrasyonu için genişletilebilir.
 *
 * Asıl güvenlik kapısı: src/app/admin/layout.tsx → onAuthStateChanged + ADMIN_EMAIL kontrolü
 *
 * ⚠️  ÖNEMLİ: /admin/auth-callback rotası burada KESİNLİKLE serbest bırakılır.
 *     Magic Link ile giriş tamamlanırken Firebase token URL query string'inde taşınır.
 *     Bu rotaya herhangi bir redirect veya engelleme uygulanırsa yönlendirme döngüsü (redirect loop) oluşur.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Magic Link Auth Callback — KESİNLİKLE engelleme ───
  // Firebase token URL'de taşınır; bu rotaya redirect/rewrite yapılırsa
  // token kaybolur ve sonsuz döngü başlar.
  if (pathname.startsWith("/admin/auth-callback")) {
    return NextResponse.next();
  }

  // ─── Diğer Admin Rotaları ───
  // Şimdilik geçiriyor; layout.tsx'teki onAuthStateChanged + ADMIN_EMAIL
  // guard'ı client tarafında koruma sağlıyor.
  // İleride: session cookie kontrolü eklenebilir (aşağıya)
  //
  // Örnek gelecek implementasyonu:
  // const sessionCookie = request.cookies.get("__session")?.value;
  // if (!sessionCookie) {
  //   return NextResponse.redirect(new URL("/admin", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
