"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProductStore } from "@/store/useProductStore";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Badge {
  text: string;
  bg: string;
  color: string;
  border: string;
}

interface Slide {
  id: number;
  badge: Badge;
  title: string;
  titleStyle: "handwriting-gradient" | "bold-black" | "dark-violet-gradient" | "warm-gradient";
  subtitle: string;
  cta: string;
  ctaStyle: "apple-black" | "apple-orange";
  href: string;
  image: string;
  imageAlt: string;
  imageRight?: boolean;
  productSlug?: string;
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/decoroys\s+/g, "")
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const slides: Slide[] = [
  {
    id: 0,
    badge: {
      text: "Yenilik",
      bg: "rgba(59,130,246,0.08)",
      color: "#2563eb",
      border: "rgba(59,130,246,0.25)",
    },
    title: "Zarif Dokunuşlar",
    titleStyle: "handwriting-gradient",
    subtitle: "Zenna TV Ünitesi ile modern dokunuş.",
    cta: "Hemen İncele",
    ctaStyle: "apple-black",
    href: "/urun/zenna-tv-unitesi",
    image: "/zenna.png",
    imageAlt: "Decoroys Zenna TV Ünitesi",
    imageRight: true,
    productSlug: "zenna-tv-unitesi",
  },
  {
    id: 1,
    badge: {
      text: "🔥 Büyük Yaz Fırsatı!",
      bg: "rgba(239,68,68,0.08)",
      color: "#dc2626",
      border: "rgba(239,68,68,0.25)",
    },
    title: "Yaza Özel İndirim Rüzgarı",
    titleStyle: "warm-gradient",
    subtitle:
      "Tüm Decoroys koleksiyonlarında seçili ürünlerde sepette ekstra %10 indirim sizi bekliyor.",
    cta: "Fırsatları Yakala",
    ctaStyle: "apple-orange",
    href: "/urunler",
    image: "/images/summer-sale.png",
    imageAlt: "Decoroys Yaz Kampanyası",
    imageRight: false,
  },
];

const INTERVAL = 5000;
const dotAccents = ["#3b82f6", "#f97316"];
const slideVerticalTexts = ["Zarafet", "Fırsat"];

const slideRightBadges = [
  [
    { icon: "✦", label: "Yeni Koleksiyon", delay: "0s", bg: "bg-blue-50", border: "border-blue-200", iconCls: "text-blue-500", textCls: "text-blue-800" },
    { icon: "◈", label: "El İşçiliği", delay: "0.5s", bg: "bg-sky-50", border: "border-sky-200", iconCls: "text-sky-500", textCls: "text-sky-800" },
    { icon: "◆", label: "Benzersiz Tasarım", delay: "1s", bg: "bg-indigo-50", border: "border-indigo-200", iconCls: "text-indigo-500", textCls: "text-indigo-800" },
  ],
  [
    { icon: "◉", label: "Yaz Fırsatı", delay: "0s", bg: "bg-orange-50", border: "border-orange-200", iconCls: "text-orange-500", textCls: "text-orange-800" },
    { icon: "✦", label: "Ekstra %10", delay: "0.5s", bg: "bg-red-50", border: "border-red-200", iconCls: "text-red-500", textCls: "text-red-800" },
    { icon: "◈", label: "Sepette İndirim", delay: "1s", bg: "bg-amber-50", border: "border-amber-200", iconCls: "text-amber-500", textCls: "text-amber-800" },
  ],
] as const;

/* ─────────────────────────────────────────────
   Title renderer — with glow animations
───────────────────────────────────────────── */
function SlideTitle({ title, style }: { title: string; style: Slide["titleStyle"] }) {
  const base =
    "text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight";

  if (style === "handwriting-gradient") {
    return (
      <h1
        className={`${base} bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 bg-clip-text text-transparent`}
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          animation: "glow-breathe-warm 4s ease-in-out infinite",
        }}
      >
        {title}
      </h1>
    );
  }
  if (style === "bold-black") {
    return (
      <h1
        className={`${base} text-zinc-900`}
        style={{
          textShadow: "0 2px 16px rgba(24,24,27,0.10), 0 6px 32px rgba(24,24,27,0.06)",
          animation: "glow-breathe-warm 5s ease-in-out infinite",
          filter: "drop-shadow(0 0 0 transparent)",
        }}
      >
        {title}
      </h1>
    );
  }
  if (style === "dark-violet-gradient") {
    return (
      <h1
        className={`${base} bg-gradient-to-br from-violet-600 via-purple-700 to-zinc-900 bg-clip-text text-transparent`}
        style={{ animation: "glow-breathe-violet 4s ease-in-out infinite" }}
      >
        {title}
      </h1>
    );
  }
  // warm-gradient (summer)
  return (
    <h1
      className={`${base} bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent`}
      style={{ animation: "glow-breathe-orange 4s ease-in-out infinite" }}
    >
      {title}
    </h1>
  );
}

/* ─────────────────────────────────────────────
   CTA button
───────────────────────────────────────────── */
function CtaButton({ text, style, href }: { text: string; style: Slide["ctaStyle"]; href: string }) {
  const base =
    "inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4";

  if (style === "apple-orange") {
    return (
      <Link
        href={href}
        className={`${base} bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 hover:shadow-orange-300 focus:ring-orange-300/50`}
      >
        {text}
        <Arrow />
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className={`${base} bg-zinc-900 text-white hover:bg-black shadow-md shadow-zinc-200 hover:shadow-zinc-300 focus:ring-zinc-400/40`}
    >
      {text}
      <Arrow />
    </Link>
  );
}

function FurnitureIcon({ color }: { color: string }) {
  return (
    <svg
      width="26" height="20" viewBox="0 0 26 20" fill="none"
      style={{ transition: "filter 0.5s", filter: `drop-shadow(0 0 5px ${color}90)` }}
    >
      {/* Body */}
      <rect x="1" y="3" width="24" height="12" rx="2" stroke={color} strokeWidth="1.1" fill={`${color}18`} />
      {/* Top panel */}
      <rect x="1" y="3" width="24" height="2.2" rx="1" fill={color} opacity="0.35" />
      {/* Center divider */}
      <line x1="13" y1="5.2" x2="13" y2="15" stroke={color} strokeWidth="0.8" opacity="0.5" />
      {/* Handles */}
      <circle cx="9.5" cy="10" r="1.1" fill={color} opacity="0.65" />
      <circle cx="16.5" cy="10" r="1.1" fill={color} opacity="0.65" />
      {/* Legs */}
      <rect x="4" y="15" width="2" height="3.5" rx="1" fill={color} opacity="0.45" />
      <rect x="20" y="15" width="2" height="3.5" rx="1" fill={color} opacity="0.45" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   HeroSlider
───────────────────────────────────────────── */
export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { products } = useProductStore();

  const goTo = useCallback(
    (idx: number) => {
      if (idx === current) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(idx);
        setAnimKey((k) => k + 1);
        setIsTransitioning(false);
      }, 220);
    },
    [current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    timerRef.current = setTimeout(next, INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [next]);

  const slide = slides[current];
  const accent = dotAccents[current];

  const resolvedImage = slide.productSlug
    ? (products.find(
      (p) => p.id === slide.productSlug || toSlug(p.name) === slide.productSlug
    )?.images?.[0] ?? slide.image)
    : slide.image;

  useEffect(() => {
    setImgLoaded(false);
  }, [resolvedImage]);

  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      style={{ minHeight: "85svh" }}
      aria-label="Hero Carousel"
    >
      {/* ── Subtle crossfade layer ── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out pointer-events-none"
          style={{
            background:
              i === 0
                ? "linear-gradient(135deg, #ffffff 60%, #eff6ff 100%)"
                : i === 1
                  ? "#fafafa"
                  : i === 2
                    ? "linear-gradient(135deg, #ffffff 60%, #f5f3ff 100%)"
                    : "linear-gradient(135deg, #ffffff 60%, #fff7ed 100%)",
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* ── Sol kenar dekorasyonu ── */}
      <div className="hidden 2xl:flex absolute left-14 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-20">
        {/* Üst mobilya ikonu */}
        <div style={{ animation: "char-float 5s ease-in-out infinite", animationDelay: "0.2s" }}>
          <FurnitureIcon color={accent} />
        </div>

        {/* Üst dikey yazı */}
        <span
          className="text-[11px] font-black tracking-[0.35em] uppercase transition-all duration-500"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: accent,
            filter: `drop-shadow(0 0 6px ${accent}90) drop-shadow(0 0 14px ${accent}55)`,
            animation: "char-float 5s ease-in-out infinite",
            animationDelay: "0.4s",
          }}
        >
          MOBİLYA
        </span>

        {/* Dekor çizgi */}
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-zinc-200 to-transparent" />
        {/* Nokta */}
        <div
          className="w-2 h-2 rounded-full transition-colors duration-500"
          style={{ background: accent, opacity: 0.5, animation: "char-float 3.5s ease-in-out infinite" }}
        />
        <div className="w-px h-8 bg-gradient-to-b from-zinc-200 to-transparent" />

        {/* Dikey yazı — slayta özgü renk + glow */}
        <span
          className="text-[13px] font-black tracking-[0.35em] uppercase transition-all duration-500"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: accent,
            filter: `drop-shadow(0 0 6px ${accent}90) drop-shadow(0 0 14px ${accent}55)`,
            animation: "char-float 6s ease-in-out infinite",
          }}
        >
          {slideVerticalTexts[current]}
        </span>

        {/* Alt dekor */}
        <div className="w-px h-8 bg-gradient-to-b from-zinc-200/60 to-transparent" />
        <div
          className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
          style={{ background: accent, opacity: 0.4, animation: "char-float 4s ease-in-out infinite reverse" }}
        />

        {/* Alt mobilya ikonu */}
        <div style={{ animation: "char-float 5s ease-in-out infinite reverse", animationDelay: "0.6s" }}>
          <FurnitureIcon color={accent} />
        </div>
      </div>

      {/* ── Aile görseli — tek kart ── */}
      <div
        className="hidden lg:flex absolute z-10 flex-col items-center gap-2"
        style={{ left: "clamp(72px, 8vw, 140px)", bottom: "10%", animation: "char-float 7s ease-in-out infinite" }}
      >
        <div
          style={{
            position: "relative",
            width: "92px",
            height: "122px",
            borderRadius: "14px",
            overflow: "hidden",
            border: "2.5px solid rgba(255,255,255,0.92)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
            transform: "rotate(-3deg)",
            background: "rgba(255,255,255,0.6)",
          }}
        >
          <Image
            src="/aile.png"
            alt="Decoroys Aile"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <span
          className="text-[9px] font-black tracking-[0.25em] uppercase transition-colors duration-500"
          style={{ color: accent, filter: `drop-shadow(0 0 4px ${accent}80)` }}
        >
          Mutlu Aileler ✦
        </span>
      </div>

      {/* ── Sağ kenar dekorasyonu ── */}
      <div className="hidden 2xl:flex absolute right-5 top-1/2 -translate-y-1/2 flex-col items-end gap-3 z-20">
        {slideRightBadges[current].map((item, i) => (
          <div
            key={`${current}-${i}`}
            className={`flex items-center gap-2 ${item.bg} backdrop-blur-sm border ${item.border} rounded-full px-4 py-2 shadow-sm`}
            style={{ animation: "char-float 5s ease-in-out infinite", animationDelay: item.delay }}
          >
            <span className={`${item.iconCls} text-sm`}>{item.icon}</span>
            <span className={`text-sm font-semibold ${item.textCls} whitespace-nowrap`}>{item.label}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1.5 mt-1">
          <div
            className="w-px h-8 transition-all duration-500"
            style={{ background: `linear-gradient(to bottom, ${accent}60, transparent)` }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
            style={{ background: accent, opacity: 0.5, animation: "char-float 4s ease-in-out infinite reverse" }}
          />
          <div
            className="w-px h-12 transition-all duration-500"
            style={{ background: `linear-gradient(to bottom, transparent, ${accent}40, transparent)` }}
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div
        className="relative z-10 flex items-center w-full"
        style={{
          minHeight: "85svh",
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 0.22s ease",
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-24 md:py-0 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* Text column */}
          <div
            key={`text-${animKey}`}
            className={`flex flex-col gap-5 animate-slide-in-left order-2 ${slide.imageRight ? "md:order-1" : "md:order-2"}`}
          >
            {/* Badge — glow ile */}
            <span
              className="self-start text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-500"
              style={{
                background: slide.badge.bg,
                color: slide.badge.color,
                borderColor: slide.badge.border,
                boxShadow: `0 0 12px ${slide.badge.color}35, 0 0 28px ${slide.badge.color}12`,
              }}
            >
              {slide.badge.text}
            </span>

            {/* Headline — animasyonlu glow */}
            <SlideTitle title={slide.title} style={slide.titleStyle} />

            {/* Subtitle */}
            <p
              className="text-base md:text-lg leading-relaxed max-w-sm font-light text-zinc-600"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              {slide.subtitle}
            </p>

            {/* CTA */}
            <div className="mt-2">
              <CtaButton text={slide.cta} style={slide.ctaStyle} href={slide.href} />
            </div>
          </div>

          {/* Image column */}
          <div
            key={`img-${animKey}`}
            className={`relative flex items-center justify-center animate-slide-in-right order-1 ${slide.imageRight ? "md:order-2" : "md:order-1"}`}
          >
            {/* Glow behind image */}
            <div
              className="absolute inset-0 rounded-full blur-3xl scale-[0.6] opacity-20 pointer-events-none transition-colors duration-700"
              style={{
                background:
                  slide.id === 0 ? "#3b82f6"
                    : slide.id === 1 ? "#a1a1aa"
                      : slide.id === 2 ? "#7c3aed"
                        : "#f97316",
              }}
            />

            <div className="relative w-full max-w-md md:max-w-lg aspect-square">
              {/* Katman 1: local fallback — hemen görünür */}
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                className="object-contain drop-shadow-xl"
                sizes="(max-width: 768px) 85vw, 45vw"
                priority={slide.id === 0}
              />
              {/* Katman 2: Firebase görseli — yüklenince üzerine crossfade */}
              {resolvedImage !== slide.image && (
                <div
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: imgLoaded ? 1 : 0 }}
                >
                  <Image
                    src={resolvedImage}
                    alt={slide.imageAlt}
                    fill
                    className="object-contain drop-shadow-xl"
                    sizes="(max-width: 768px) 85vw, 45vw"
                    onLoad={() => setImgLoaded(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((s, i) => {
          const active = i === current;
          return (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Slayt ${i + 1}`}
              className="rounded-full focus:outline-none transition-all duration-500"
              style={{
                width: active ? "28px" : "8px",
                height: "8px",
                background: active ? dotAccents[i] : "#d4d4d8",
                boxShadow: active ? `0 0 8px ${dotAccents[i]}80` : "none",
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
