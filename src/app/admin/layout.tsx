"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Lock, Loader2, AlertCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { auth, ADMIN_EMAIL } from "@/lib/firebase";

type AuthStep = "loading" | "login" | "dashboard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authStep, setAuthStep] = useState<AuthStep>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === ADMIN_EMAIL) {
        setCurrentUser(user);
        setAuthStep("dashboard");
      } else {
        setCurrentUser(null);
        setAuthStep("login");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      setError("Yetkisiz e-posta adresi.");
      return;
    }

    setIsSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("E-posta veya şifre hatalı.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Çok fazla başarısız deneme. Lütfen biraz bekleyin.");
      } else {
        setError("Giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setEmail("");
    setPassword("");
    setError(null);
  };

  /* ═══════ Yükleniyor ═══════ */
  if (authStep === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
      </div>
    );
  }

  /* ═══════ Giriş Ekranı ═══════ */
  if (authStep === "login") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl shadow-zinc-200/60 border border-zinc-100 p-10 md:p-12 flex flex-col gap-8">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Yönetim Paneli</h1>
              <p className="text-sm text-zinc-500 font-light">E-posta ve şifrenizle giriş yapın.</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">E-posta</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className="w-full bg-zinc-50 border border-zinc-100 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 px-5 py-4 rounded-2xl text-zinc-900 transition-all placeholder:text-zinc-400 text-base"
                  placeholder="admin@decoroys.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Şifre</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className="w-full bg-zinc-50 border border-zinc-100 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 px-5 py-4 rounded-2xl text-zinc-900 transition-all placeholder:text-zinc-400 text-base"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-semibold hover:bg-black transition-colors focus:outline-none focus:ring-4 focus:ring-zinc-300 shadow-lg text-base flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Giriş Yapılıyor...
                  </>
                ) : (
                  "Giriş Yap"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════ Dashboard Layout (Sidebar + Content) ═══════ */
  const menuItems = [
    { name: "Genel Bakış", href: "/admin", icon: LayoutDashboard },
    { name: "Ürün Yönetimi", href: "/admin/urunler", icon: Package },
    { name: "Siparişler", href: "/admin/siparisler", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-white flex w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-50 border-r border-zinc-100 flex flex-col flex-shrink-0 sticky top-0 h-screen print:hidden">
        <div className="h-20 flex items-center px-8 border-b border-zinc-100">
          <Link href="/admin" className="text-xl font-bold tracking-tight text-zinc-900">
            Decoroys<span className="text-blue-600 font-black">.</span>
          </Link>
        </div>

        {/* Admin bilgisi */}
        {currentUser && (
          <div className="px-6 pt-5 pb-2">
            <div className="bg-blue-50 rounded-xl px-3 py-2.5 text-xs text-blue-700 font-medium truncate">
              ● {currentUser.email}
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-zinc-500 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-100 mb-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3.5 rounded-xl w-full text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            Güvenli Çıkış
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  );
}
