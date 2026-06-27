import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2 }).format(n);

export async function POST(req: NextRequest) {
  const { orderId, customerInfo, items, total } = await req.json();

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;

  if (!gmailUser || !gmailPass || !adminEmail) {
    return NextResponse.json({ error: "Mail ayarları eksik" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  const itemRows = items
    .map(
      (item: any) => `
      <tr style="border-bottom:1px solid #f4f4f5;">
        <td style="padding:10px 0;color:#18181b;font-size:14px;">${item.name}${item.color ? ` — ${item.color}` : ""}${item.size ? ` / ${item.size}` : ""}</td>
        <td style="padding:10px 0;text-align:center;color:#71717a;font-size:14px;">${item.quantity}</td>
        <td style="padding:10px 0;text-align:right;color:#18181b;font-weight:600;font-size:14px;">₺${formatPrice(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06);">

    <!-- Header -->
    <div style="background:#18181b;padding:28px 36px;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <span style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Decoroys<span style="color:#3b82f6;">.</span></span>
        <p style="color:#a1a1aa;font-size:12px;margin:4px 0 0;">Yeni Sipariş Bildirimi</p>
      </div>
      <div style="background:#27272a;border-radius:10px;padding:10px 16px;text-align:right;">
        <p style="color:#71717a;font-size:10px;margin:0 0 2px;text-transform:uppercase;letter-spacing:1px;">Sipariş No</p>
        <p style="color:#fff;font-size:13px;font-family:monospace;font-weight:700;margin:0;">${orderId.slice(0, 10).toUpperCase()}</p>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:32px 36px;">

      <!-- Alert -->
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;color:#1d4ed8;font-size:15px;font-weight:600;">🛒 Yeni bir sipariş geldi!</p>
        <p style="margin:6px 0 0;color:#3b82f6;font-size:13px;">Toplam tutar: <strong>₺${formatPrice(total)}</strong></p>
      </div>

      <!-- Müşteri -->
      <h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#71717a;margin:0 0 12px;">Müşteri Bilgileri</h2>
      <div style="background:#fafafa;border-radius:10px;padding:16px 20px;margin-bottom:24px;font-size:14px;color:#3f3f46;line-height:1.8;">
        <p style="margin:0;font-weight:600;color:#18181b;">${customerInfo.name}</p>
        ${customerInfo.phone ? `<p style="margin:0;">${customerInfo.phone}</p>` : ""}
        ${customerInfo.email ? `<p style="margin:0;">${customerInfo.email}</p>` : ""}
        <p style="margin:8px 0 0;color:#52525b;">${customerInfo.address}${customerInfo.district ? `, ${customerInfo.district}` : ""}${customerInfo.city ? `, ${customerInfo.city}` : ""}</p>
      </div>

      <!-- Ürünler -->
      <h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#71717a;margin:0 0 12px;">Sipariş Kalemleri</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:2px solid #f4f4f5;">
            <th style="padding:8px 0;text-align:left;font-size:12px;color:#a1a1aa;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Ürün</th>
            <th style="padding:8px 0;text-align:center;font-size:12px;color:#a1a1aa;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Adet</th>
            <th style="padding:8px 0;text-align:right;font-size:12px;color:#a1a1aa;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Tutar</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:16px 0 0;font-size:15px;font-weight:700;color:#18181b;">Toplam</td>
            <td style="padding:16px 0 0;text-align:right;font-size:18px;font-weight:800;color:#18181b;">₺${formatPrice(total)}</td>
          </tr>
        </tfoot>
      </table>

      <!-- CTA -->
      <div style="margin-top:32px;text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/admin/siparisler" style="display:inline-block;background:#18181b;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:.3px;">
          Admin Paneline Git →
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="padding:20px 36px;border-top:1px solid #f4f4f5;text-align:center;">
      <p style="margin:0;font-size:12px;color:#a1a1aa;">decoroys.com — Yönetim Bildirimi</p>
    </div>
  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"Decoroys Sipariş" <${gmailUser}>`,
      to: adminEmail,
      subject: `🛒 Yeni Sipariş — ₺${formatPrice(total)} — ${customerInfo.name}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Mail gönderilemedi:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
