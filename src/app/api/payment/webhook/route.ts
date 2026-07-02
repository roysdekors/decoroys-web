import { NextRequest } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    // PayTR application/x-www-form-urlencoded gönderir
    const text   = await req.text();
    const params = new URLSearchParams(text);

    const merchantOid = params.get("merchant_oid") ?? "";
    const status      = params.get("status")       ?? "";
    const totalAmount = params.get("total_amount") ?? "";
    const hash        = params.get("hash")         ?? "";

    const merchantKey  = process.env.PAYTR_MERCHANT_KEY;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchantKey || !merchantSalt) {
      console.error("PayTR webhook: PAYTR_MERCHANT_KEY / SALT eksik");
      return new Response("FAILED", { status: 200 });
    }

    // ── Hash doğrulama (güvenlik kalkanı) ──────────────────────────────
    const expectedHash = crypto
      .createHmac("sha256", merchantKey)
      .update(merchantOid + merchantSalt + status + totalAmount)
      .digest("base64");

    if (expectedHash !== hash) {
      console.error("PayTR webhook: hash eşleşmedi — sahte istek engellendi");
      return new Response("FAILED", { status: 200 });
    }

    // ── Firestore güncelleme (Firebase Admin SDK — servis hesabı yetkisiyle) ──
    const orderRef = adminDb.collection("orders").doc(merchantOid);

    if (status === "success") {
      await orderRef.update({
        status:        "Ödendi",
        paymentStatus: "success",
        paidAt:        FieldValue.serverTimestamp(),
        paytrTotal:    parseFloat((parseInt(totalAmount, 10) / 100).toFixed(2)),
      });
    } else {
      await orderRef.update({
        status:        "Ödeme Başarısız",
        paymentStatus: "failed",
        failedAt:      FieldValue.serverTimestamp(),
      });
    }

    // PayTR sadece düz metin "OK" bekler — farklı yanıt gönderilirse 24 saat tekrar dener
    return new Response("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("PayTR webhook hatası:", message);
    // Hata olsa bile OK dön; aksi halde PayTR döngüye girer
    return new Response("OK", { status: 200 });
  }
}
