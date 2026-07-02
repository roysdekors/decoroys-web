"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Feature {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  detailText: string;
}

const features: Feature[] = [
  {
    id: "feature-1",
    title: "Premium Malzemeler",
    subtitle: "Ustalıkla seçilmiş",
    image: "/images/1.jpg",
    detailText:
      "Mobilyalarımızda kullanılan premium malzemeler, uzun ömürlü kullanım ve zamansız bir estetik sunar. Doğal ahşap ve gerçek taş kaplamalar, evinizin havasını değiştirir.",
  },
  {
    id: "feature-2",
    title: "Minimalist Çizgiler",
    subtitle: "Sade ve şık",
    image: "/images/2.jpg",
    detailText:
      "Gereksiz detaylardan arındırılmış tasarımlarımız, negatif boşlukların gücünü kullanarak yaşam alanlarınıza huzur katar.",
  },
  {
    id: "feature-3",
    title: "Akıllı Kurulum",
    subtitle: "Aletsiz montaj",
    image: "/images/3.jpg",
    detailText:
      "Özel kilit mekanizmalarımız sayesinde, karmaşık el aletlerine ihtiyaç duymadan dakikalar içinde mobilyanızı kurabilirsiniz.",
  },
  {
    id: "feature-4",
    title: "Sürdürülebilirlik",
    subtitle: "Doğaya saygılı",
    image: "/images/4.jpg",
    detailText:
      "Üretim süreçlerimizin tamamında karbon ayak izimizi minimumda tutuyor, geri dönüştürülebilir ve sürdürülebilir materyaller tercih ediyoruz.",
  },
  {
    id: "feature-5",
    title: "Gizli Depolama",
    subtitle: "Kusursuz düzen",
    image: "/images/5.jpg",
    detailText:
      "Kablolar, cihazlar ve diğer eşyalarınız için zekice tasarlanmış gizli depolama alanlarıyla göz yormayan bir düzen sağlayın.",
  },
];

const SPRING = { type: "spring" as const, stiffness: 280, damping: 30 };

// Framer Motion pixel değerleri Tailwind responsive class kabul etmediği için
// ekran genişliğini JS ile izliyoruz
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// mobile=true → küçük kart boyutu + daraltılmış x-offset'ler
function getCardProps(offset: number, mobile: boolean) {
  const abs = Math.abs(offset);
  const sign = Math.sign(offset) || 1;

  if (mobile) {
    if (abs === 0) return { x: 0,          rotateY: 0,          scale: 1,    opacity: 1,    z: 0,    zIndex: 20, blur: 0   };
    if (abs === 1) return { x: sign * 188, rotateY: sign * -42,  scale: 0.77, opacity: 0.76, z: -140, zIndex: 15, blur: 1.5 };
    if (abs === 2) return { x: sign * 300, rotateY: sign * -60,  scale: 0.59, opacity: 0.35, z: -280, zIndex: 10, blur: 3.5 };
    return             { x: sign * 390, rotateY: sign * -72,  scale: 0.45, opacity: 0,    z: -420, zIndex: 5,  blur: 6   };
  }

  if (abs === 0) return { x: 0,          rotateY: 0,          scale: 1,    opacity: 1,    z: 0,    zIndex: 20, blur: 0   };
  if (abs === 1) return { x: sign * 265, rotateY: sign * -42,  scale: 0.80, opacity: 0.76, z: -180, zIndex: 15, blur: 1.5 };
  if (abs === 2) return { x: sign * 415, rotateY: sign * -60,  scale: 0.62, opacity: 0.35, z: -360, zIndex: 10, blur: 3.5 };
  return             { x: sign * 520, rotateY: sign * -72,  scale: 0.48, opacity: 0,    z: -500, zIndex: 5,  blur: 6   };
}

export default function BentoFeatures() {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();

  // Ekrana göre kart boyutu
  const CARD_W = isMobile ? 210 : 280;
  const CARD_H = isMobile ? 320 : 400;

  const prev = () => setActive((i) => Math.max(i - 1, 0));
  const next = () => setActive((i) => Math.min(i + 1, features.length - 1));

  const handlePanEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    if (info.offset.x < -55 && info.velocity.x <= 0) next();
    else if (info.offset.x > 55 && info.velocity.x >= 0) prev();
  };

  return (
    <div className="w-full select-none">
      {/* ── 3D Carousel Stage ── */}
      <motion.div
        className="relative h-[350px] md:h-[420px] lg:h-[460px] overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: "1400px" }}
        onPanEnd={handlePanEnd}
      >
        {features.map((feature, index) => {
          const offset = index - active;
          const { x, rotateY, scale, opacity, z, zIndex, blur } = getCardProps(offset, isMobile);
          const isActive = offset === 0;

          return (
            <motion.div
              key={feature.id}
              animate={{ x, rotateY, scale, opacity, z }}
              transition={SPRING}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: `${-CARD_H / 2}px`,
                marginLeft: `${-CARD_W / 2}px`,
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                zIndex,
                filter: `blur(${blur}px)`,
                transitionProperty: "filter",
                transitionDuration: "380ms",
                transitionTimingFunction: "ease",
                borderRadius: "20px",
                overflow: "hidden",
                willChange: "transform",
                cursor: isActive ? "default" : "pointer",
              }}
              onClick={() => !isActive && setActive(index)}
            >
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover"
                draggable={false}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10">
                <span className="block text-white/55 text-[8px] md:text-[9px] tracking-[0.25em] uppercase font-semibold mb-1">
                  {feature.subtitle}
                </span>
                <h3
                  className={`text-white font-bold leading-snug transition-all duration-300 ${
                    isActive ? "text-base md:text-[1.25rem]" : "text-xs opacity-55"
                  }`}
                >
                  {feature.title}
                </h3>
              </div>

              {/* Active ring */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  borderRadius: "20px",
                  boxShadow:
                    "inset 0 0 0 1.5px rgba(255,255,255,0.22), inset 0 0 28px rgba(255,255,255,0.06)",
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Detail text ── */}
      <div className="mt-5 min-h-[88px] flex flex-col items-center justify-start px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 0.6, 0.22, 1] }}
            className="flex flex-col items-center gap-2 max-w-lg w-full"
          >
            <span
              className="text-[10px] font-bold tracking-[0.28em] uppercase"
              style={{
                background: "linear-gradient(90deg, #f97316, #ec4899, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {features[active].subtitle}
            </span>
            <div className="w-10 h-px rounded-full bg-gradient-to-r from-orange-400 via-rose-400 to-violet-500" />
            <p className="text-center text-sm md:text-base lg:text-lg text-zinc-800 font-normal leading-relaxed">
              {features[active].detailText}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-center gap-4 md:gap-5 mt-5">
        <button
          onClick={prev}
          disabled={active === 0}
          aria-label="Önceki"
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-zinc-700" />
        </button>

        <div className="flex items-center gap-1.5">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Kart ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === active
                  ? "w-5 h-2 md:w-6 bg-zinc-900"
                  : "w-2 h-2 bg-zinc-300 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={active === features.length - 1}
          aria-label="Sonraki"
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-zinc-700" />
        </button>
      </div>
    </div>
  );
}
