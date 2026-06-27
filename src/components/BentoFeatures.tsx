"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "motion/react";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

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
    image: "/tiflis.jpg",
    detailText:
      "Mobilyalarımızda kullanılan premium malzemeler, uzun ömürlü kullanım ve zamansız bir estetik sunar. Doğal ahşap ve gerçek taş kaplamalar, evinizin havasını değiştirir.",
  },
  {
    id: "feature-2",
    title: "Minimalist Çizgiler",
    subtitle: "Sade ve şık",
    image: "/royal.png",
    detailText:
      "Gereksiz detaylardan arındırılmış tasarımlarımız, negatif boşlukların gücünü kullanarak yaşam alanlarınıza huzur katar.",
  },
  {
    id: "feature-3",
    title: "Akıllı Kurulum",
    subtitle: "Aletsiz montaj",
    image: "/begonia.png",
    detailText:
      "Özel kilit mekanizmalarımız sayesinde, karmaşık el aletlerine ihtiyaç duymadan dakikalar içinde mobilyanızı kurabilirsiniz.",
  },
  {
    id: "feature-4",
    title: "Sürdürülebilirlik",
    subtitle: "Doğaya saygılı",
    image: "/zenna.png",
    detailText:
      "Üretim süreçlerimizin tamamında karbon ayak izimizi minimumda tutuyor, geri dönüştürülebilir ve sürdürülebilir materyaller tercih ediyoruz.",
  },
  {
    id: "feature-5",
    title: "Gizli Depolama",
    subtitle: "Kusursuz düzen",
    image: "/royal.png",
    detailText:
      "Kablolar, cihazlar ve diğer eşyalarınız için zekice tasarlanmış gizli depolama alanlarıyla göz yormayan bir düzen sağlayın.",
  },
];

const EASE = [0.22, 0.6, 0.22, 1] as const;
const SPRING = { stiffness: 220, damping: 22 };

/* ─── Tek kart bileşeni ─── */
function FeatureCard({
  feature,
  isHero,
  index,
  onClick,
}: {
  feature: Feature;
  isHero: boolean;
  index: number;
  onClick: (f: Feature) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  /* Mouse 3D tilt */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [14, -14]), SPRING);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-14, 14]), SPRING);

  /* Specular parlaklık gradyanı */
  const glowBg = useTransform(
    [rawX, rawY],
    ([mx, my]: number[]) =>
      `radial-gradient(ellipse at ${(mx + 0.5) * 100}% ${(my + 0.5) * 100}%, rgba(255,255,255,0.18) 0%, transparent 65%)`
  );

  /* Scroll parallax — image */
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["14%", "-14%"]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  /* Entrance: hero → soldan, diğerleri → aşağıdan */
  const initial = isHero
    ? { opacity: 0, x: -80, scale: 0.92 }
    : { opacity: 0, y: 70, scale: 0.92 };
  const animate = isHero
    ? { opacity: 1, x: 0, scale: 1 }
    : { opacity: 1, y: 0, scale: 1 };

  return (
    /* Perspective wrapper — taşıyor col/row span'ı */
    <div
      className={isHero ? "md:col-span-2 md:row-span-2" : "col-span-1 row-span-1"}
      style={{ perspective: "1100px" }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY }}
        initial={initial}
        whileInView={animate}
        transition={{ duration: 0.85, delay: index * 0.11, ease: EASE }}
        viewport={{ once: true, amount: 0.15 }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={() => onClick(feature)}
        className="group relative w-full h-full rounded-3xl overflow-hidden cursor-pointer bg-zinc-100"
      >
        {/* Specular parlaklık */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 rounded-3xl"
          style={{ background: glowBg }}
        />

        {/* Scroll parallax image */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 w-full h-full"
            style={{ y: imgY, scale: 1.22 }}
          >
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              className="object-cover"
            />
          </motion.div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        </div>

        {/* Metin */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 + index * 0.1, ease: EASE }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-white/70 font-medium text-sm tracking-widest uppercase mb-1.5 transition-all duration-300 group-hover:text-white/95 group-hover:tracking-[0.22em]"
          >
            {feature.subtitle}
          </motion.span>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.33 + index * 0.1, ease: EASE }}
            viewport={{ once: true, amount: 0.2 }}
            className={`font-bold text-white leading-tight transition-transform duration-300 group-hover:translate-x-2 ${
              isHero ? "text-3xl md:text-4xl" : "text-xl"
            }`}
          >
            {feature.title}
          </motion.h3>
        </div>

        {/* Artı butonu */}
        <motion.div
          className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white z-20 border border-white/10"
          whileHover={{ backgroundColor: "rgba(255,255,255,0.5)", rotate: 90, scale: 1.1 }}
          transition={{ duration: 0.25 }}
        >
          <Plus className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── Ana bileşen ─── */
export default function BentoFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            isHero={index === 0}
            index={index}
            onClick={setSelectedFeature}
          />
        ))}
      </div>

      {/* Modal */}
      <motion.div
        animate={
          selectedFeature
            ? { opacity: 1, pointerEvents: "auto" as const }
            : { opacity: 0, pointerEvents: "none" as const }
        }
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        <div
          className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          onClick={() => setSelectedFeature(null)}
        />
        <motion.div
          animate={
            selectedFeature
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 36, scale: 0.95 }
          }
          transition={{ duration: 0.4, ease: EASE }}
          className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
        >
          <button
            onClick={() => setSelectedFeature(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-zinc-900 hover:bg-white transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {selectedFeature && (
            <div className="flex flex-col">
              <div className="relative w-full h-[300px] sm:h-[400px] bg-zinc-100">
                <Image
                  src={selectedFeature.image}
                  alt={selectedFeature.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8 sm:p-10 space-y-4">
                <span className="text-blue-600 font-semibold text-sm tracking-widest uppercase">
                  {selectedFeature.subtitle}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
                  {selectedFeature.title}
                </h2>
                <div className="w-12 h-1 bg-zinc-200 rounded-full my-6" />
                <p className="text-lg text-zinc-600 leading-relaxed font-light">
                  {selectedFeature.detailText}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
