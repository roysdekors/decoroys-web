import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PAYTR_TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const {
      orderId,
      items,
      totalAmount,
      email,
      fullName,
      phone,
      address,
      city,
      district,
    }: {
      orderId: string;
      items: CartItem[];
      totalAmount: number;
      email: string;
      fullName: string;
      phone: string;
      address: string;
      city: string;
      district: string;
    } = await req.json();

    const merchantId   = process.env.PAYTR_MERCHANT_ID;
    const merchantKey  = process.env.PAYTR_MERCHANT_KEY;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchantId || !merchantKey || !merchantSalt) {
      return NextResponse.json(
        { error: "PayTR çevre değişkenleri eksik" },
        { status: 500 }
      );
    }

    // Kullanıcı IP — proxy arkasındaysa X-Forwarded-For header'ından al
    const userIp =
      (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "1.2.3.4";

    // Ödeme tutarı kuruş cinsinden (1 TL = 100 kuruş)
    const paymentAmount = Math.round(totalAmount * 100).toString();

    // PayTR sepet formatı: [[ürün_adı, birim_fiyat_TL, adet], ...]
    const basket = items.map((item) => [
      item.name.substring(0, 100),
      item.price.toFixed(2),
      String(item.quantity),
    ]);
    const userBasket = Buffer.from(JSON.stringify(basket)).toString("base64");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.decoroys.com";
    const merchantOkUrl   = `${appUrl}/odeme/basarili`;
    const merchantFailUrl = `${appUrl}/odeme/basarisiz`;

    const userAddress = `${address}${district ? ", " + district : ""}, ${city}`.slice(0, 255);

    const noInstallment  = "0";
    const maxInstallment = "0";
    const currency = "TL";
    const lang     = "tr";
    // Canlı ortamda "0", geliştirmede "1" — Vercel'de NODE_ENV "production" olur
    const testMode = process.env.PAYTR_TEST_MODE === "1" ? "1" : "0";

    // PayTR HMAC-SHA256 hash
    const hashStr =
      merchantId +
      userIp +
      orderId +
      email +
      paymentAmount +
      userBasket +
      noInstallment +
      maxInstallment +
      currency +
      testMode +
      merchantSalt;

    const paytrToken = crypto
      .createHmac("sha256", merchantKey)
      .update(hashStr)
      .digest("base64");

    const params = new URLSearchParams({
      merchant_id:       merchantId,
      user_ip:           userIp,
      merchant_oid:      orderId,
      email,
      payment_amount:    paymentAmount,
      paytr_token:       paytrToken,
      user_basket:       userBasket,
      debug_on:          "0",
      no_installment:    noInstallment,
      max_installment:   maxInstallment,
      user_name:         fullName,
      user_address:      userAddress,
      user_phone:        phone,
      merchant_ok_url:   merchantOkUrl,
      merchant_fail_url: merchantFailUrl,
      currency,
      test_mode:         testMode,
      lang,
    });

    const paytrRes = await fetch(PAYTR_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const paytrData = (await paytrRes.json()) as {
      status: string;
      token?: string;
      reason?: string;
    };

    if (paytrData.status !== "success") {
      console.error("PayTR token hatası:", paytrData);
      return NextResponse.json(
        { error: paytrData.reason ?? "PayTR token alınamadı" },
        { status: 400 }
      );
    }

    return NextResponse.json({ token: paytrData.token });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Sunucu hatası";
    console.error("PayTR token route hatası:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
