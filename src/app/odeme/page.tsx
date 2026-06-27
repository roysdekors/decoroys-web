"use client";

import { useCartStore } from "@/store/useCartStore";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { ShieldCheck, CreditCard, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  // Kredi kartı (demo — gerçek ödeme entegrasyonu yapılmadı)
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Auth durumunu dinle — misafir de olabilir
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.email) setEmail(user.email);
      if (user?.displayName) setFullName(user.displayName);
    });
    return () => unsubscribe();
  }, []);

  if (!isMounted) return null;

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    // Temel doğrulama
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setError("Lütfen Ad Soyad, E-posta, Telefon, Açık Adres ve İl alanlarını eksiksiz doldurun.");
      return;
    }
    if (items.length === 0) {
      setError("Sepetiniz boş.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const orderData = {
        // Müşteri ve Teslimat Bilgileri
        customerInfo: {
          name: fullName.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          address: address.trim(),
          city: city.trim(),
          district: district.trim() || null,
        },

        // Sepet
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image ?? null,
          color: item.color ?? null,
          size: item.size ?? null,
        })),
        total,

        // Sipariş durumu
        status: "beklemede",

        // Auth — giriş yapmışsa uid, misafirse null
        uid: currentUser ? currentUser.uid : null,
        isGuest: !currentUser,

        // Zaman damgası (server-side)
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      setOrderId(docRef.id);
      setIsSuccess(true);
      clearCart();

      // Admin bildirim maili — arka planda, hata olsa sipariş etkilenmez
      fetch("/api/notify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: docRef.id,
          customerInfo: orderData.customerInfo,
          items: orderData.items,
          total,
        }),
      }).catch(() => {});

    } catch (err: any) {
      console.error("Sipariş kaydedilemedi:", err);
      setError("Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Başarı ekranı
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          <h1 className="text-3xl font-light text-zinc-900">Siparişiniz Alındı!</h1>
          <p className="text-zinc-500 font-light leading-relaxed">
            Teşekkürler, <strong className="font-medium text-zinc-800">{fullName}</strong>. Siparişiniz başarıyla kaydedildi ve en kısa sürede hazırlanmaya başlanacak.
          </p>
          {orderId && (
            <div className="bg-zinc-50 rounded-xl px-6 py-4 text-sm text-zinc-500 font-mono break-all">
              Sipariş No: <span className="text-zinc-900 font-semibold">{orderId.slice(0, 12).toUpperCase()}</span>
            </div>
          )}
          <Link
            href="/"
            className="inline-block w-full bg-zinc-900 text-white py-4 rounded-xl font-medium hover:bg-black transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pb-24">
      <header className="w-full max-w-6xl mx-auto px-6 h-20 md:h-28 flex items-center justify-between border-b border-zinc-100">
        <Link href="/" className="flex items-center">
          <img src="/images/logo.png" alt="Decoroys" className="h-20 md:h-28 w-auto object-contain transform scale-[1.3] md:scale-[1.5] origin-left" />
        </Link>
        <div className="flex items-center gap-2 text-zinc-500 font-light text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Güvenli Ödeme</span>
        </div>
      </header>

      {/* Giriş yapmış kullanıcı bandı */}
      {currentUser && (
        <div className="w-full bg-zinc-50 border-b border-zinc-100">
          <div className="max-w-6xl mx-auto px-6 py-3 text-sm text-zinc-500 font-light">
            <span className="text-green-600 font-medium">●</span> {currentUser.email} olarak giriş yaptınız
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">

        {/* Left Column: Müşteri & Adres Bilgileri */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-2xl font-light text-zinc-900 mb-6">Teslimat ve Fatura Adresi</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ad Soyad */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Ad Soyad *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ad Soyad"
                    className="w-full bg-zinc-100 border-none outline-none focus:ring-2 focus:ring-blue-200 px-4 py-3.5 rounded-lg text-zinc-900 placeholder:text-zinc-400 transition-all"
                  />
                </div>
                {/* E-posta */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">E-posta *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@mail.com"
                    className="w-full bg-zinc-100 border-none outline-none focus:ring-2 focus:ring-blue-200 px-4 py-3.5 rounded-lg text-zinc-900 placeholder:text-zinc-400 transition-all"
                  />
                </div>
                {/* Telefon */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Telefon *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xx xxx xx xx"
                    className="w-full bg-zinc-100 border-none outline-none focus:ring-2 focus:ring-blue-200 px-4 py-3.5 rounded-lg text-zinc-900 placeholder:text-zinc-400 transition-all"
                  />
                </div>
                {/* Açık Adres */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Açık Adres *</label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Mahalle, Sokak, No..."
                    className="w-full bg-zinc-100 border-none outline-none focus:ring-2 focus:ring-blue-200 px-4 py-3.5 rounded-lg text-zinc-900 placeholder:text-zinc-400 transition-all resize-none"
                  />
                </div>
                {/* İl */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">İl *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="İstanbul"
                    className="w-full bg-zinc-100 border-none outline-none focus:ring-2 focus:ring-blue-200 px-4 py-3.5 rounded-lg text-zinc-900 placeholder:text-zinc-400 transition-all"
                  />
                </div>
                {/* İlçe */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">İlçe</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Kadıköy"
                    className="w-full bg-zinc-100 border-none outline-none focus:ring-2 focus:ring-blue-200 px-4 py-3.5 rounded-lg text-zinc-900 placeholder:text-zinc-400 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ödeme Bilgileri */}
          <div>
            <h3 className="text-xl font-light text-zinc-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-zinc-400" />
              Kredi Kartı Bilgileri
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Kart Üzerindeki İsim</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Ad Soyad"
                    className="w-full bg-zinc-100 border-none outline-none focus:ring-2 focus:ring-blue-200 px-4 py-3.5 rounded-lg text-zinc-900 placeholder:text-zinc-400 transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Kart Numarası</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full bg-zinc-100 border-none outline-none focus:ring-2 focus:ring-blue-200 px-4 py-3.5 rounded-lg text-zinc-900 placeholder:text-zinc-400 transition-all font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">SKT</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setCardExpiry(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v);
                    }}
                    placeholder="AA/YY"
                    maxLength={5}
                    className="w-full bg-zinc-100 border-none outline-none focus:ring-2 focus:ring-blue-200 px-4 py-3.5 rounded-lg text-zinc-900 placeholder:text-zinc-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">CVC</label>
                  <input
                    type="text"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full bg-zinc-100 border-none outline-none focus:ring-2 focus:ring-blue-200 px-4 py-3.5 rounded-lg text-zinc-900 placeholder:text-zinc-400 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-10">
          <div>
            <h3 className="text-xl font-light text-zinc-900 mb-6">Sipariş Özeti</h3>
            <div className="space-y-4 mb-6">
              {items.length === 0 ? (
                <p className="text-sm text-zinc-500 font-light">Sepetiniz boş.</p>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-zinc-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-zinc-500 font-light mt-0.5">{item.quantity} adet</p>
                    </div>
                    <div className="text-right font-medium text-sm">
                      {(item.price * item.quantity).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-zinc-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Ara Toplam</span>
                <span>{total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Kargo</span>
                <span>Ücretsiz</span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-3 text-zinc-900">
                <span>Toplam</span>
                <span>{total.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} ₺</span>
              </div>
            </div>
          </div>

          {/* Hata mesajı */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Sipariş butonu */}
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || items.length === 0}
            className="w-full bg-zinc-900 text-white py-4 mt-2 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-black transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sipariş Kaydediliyor...
              </>
            ) : (
              "Siparişi Tamamla"
            )}
          </button>

          {/* Misafir alışveriş notu */}
          {!currentUser && (
            <p className="text-xs text-zinc-400 text-center font-light -mt-6">
              Üye olmadan devam ediyorsunuz.{" "}
              <Link href="/giris" className="underline hover:text-zinc-700 transition-colors">
                Giriş yapmak ister misiniz?
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
