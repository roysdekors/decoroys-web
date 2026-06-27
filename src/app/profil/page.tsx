"use client";

import { Package, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

// Dummy asenkron servis
const fetchUserOrders = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "ORD-12345",
          date: "12 Mayıs 2026",
          status: "Teslim Edildi",
          total: 8500,
          items: [
            { name: "Modern Minimalist Koltuk", color: "Antrasit", quantity: 1 }
          ]
        },
        {
          id: "ORD-98765",
          date: "3 Nisan 2026",
          status: "Kargoda",
          total: 1200,
          items: [
            { name: "Ahşap Sehpa", color: "Ceviz", quantity: 1 },
            { name: "Seramik Vazo", quantity: 2 }
          ]
        }
      ]);
    }, 1000);
  });
};

export default function ProfilePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Firebase/Firestore entegrasyonu için hazır
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUserOrders();
        setOrders(data as any[]);
      } catch (error) {
        console.error("Siparişler yüklenirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full flex-1">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                JD
              </div>
              <h2 className="text-center font-semibold text-lg text-zinc-900">ferhat</h2>
              <p className="text-center text-zinc-500 text-sm">ferhat.doe@example.com</p>
            </div>

            <nav className="flex flex-col p-2">
              <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-zinc-100 text-zinc-900 transition-colors w-full">
                <Package className="w-5 h-5" />
                Siparişlerim
              </button>
              <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors w-full mt-1">
                <MapPin className="w-5 h-5" />
                Adreslerim
              </button>
              <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors w-full mt-1">
                <Settings className="w-5 h-5" />
                Hesap Ayarları
              </button>
              <div className="h-px bg-zinc-100 my-2 mx-4"></div>
              <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full">
                <LogOut className="w-5 h-5" />
                Çıkış Yap
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-zinc-900 mb-6">Siparişlerim</h1>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-zinc-200 p-6 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="w-32 h-4 bg-zinc-200 rounded"></div>
                    <div className="w-24 h-4 bg-zinc-200 rounded"></div>
                  </div>
                  <div className="w-48 h-4 bg-zinc-200 rounded mb-2"></div>
                  <div className="w-32 h-4 bg-zinc-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
                  <Package className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <p className="text-zinc-500">Henüz siparişiniz bulunmuyor.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-zinc-300 transition-colors">
                    <div className="p-5 border-b border-zinc-100 bg-zinc-50 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Sipariş No</p>
                        <p className="font-medium text-sm text-zinc-900">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Tarih</p>
                        <p className="font-medium text-sm text-zinc-900">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Durum</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === "Teslim Edildi" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Toplam</p>
                        <p className="font-bold text-sm text-zinc-900">{order.total.toLocaleString("tr-TR")} ₺</p>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="space-y-3">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-500">{item.quantity}x</span>
                              <span className="font-medium text-zinc-800">{item.name}</span>
                              {item.color && <span className="text-zinc-500">({item.color})</span>}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 pt-4 border-t border-zinc-100 flex justify-end">
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 group">
                          Sipariş Detayı
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
