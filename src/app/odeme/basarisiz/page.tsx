"use client";

import { useEffect } from "react";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
  useEffect(() => {
    // PayTR iFrame içinde yüklendiyse üst pencereye çık
    if (typeof window !== "undefined" && window.top !== window.self) {
      window.top!.location.href = "/odeme/basarisiz";
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <XCircle className="w-20 h-20 text-red-400" strokeWidth={1.5} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-light text-zinc-900">Ödeme Başarısız</h1>
          <p className="text-zinc-500 font-light leading-relaxed">
            Ödeme işleminiz tamamlanamadı.
            <br />
            Kart bilgilerinizi kontrol edip tekrar deneyebilirsiniz.
          </p>
        </div>

        <div className="bg-red-50 rounded-xl px-6 py-4 text-sm text-red-600">
          Sorun devam ederse bankanızla iletişime geçin ya da farklı bir kart kullanın.
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/odeme"
            className="inline-block w-full bg-zinc-900 text-white py-4 rounded-xl font-medium hover:bg-black transition-colors"
          >
            Tekrar Dene
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
