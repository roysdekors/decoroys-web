"use client";

import { motion } from "motion/react";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center px-6">

      {/* Arka plan: ince radial ışık */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(249,115,22,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full gap-10">

        {/* Marka adı */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 0.6, 0.22, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold tracking-[0.45em] uppercase text-zinc-600">
            Premium Mobilya
          </span>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-none tracking-tight"
            style={{
              background: "linear-gradient(160deg, #ffffff 30%, #a1a1aa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Decoroys
          </h1>
          <span className="text-sm sm:text-base font-semibold tracking-[0.25em] uppercase text-zinc-500">
            Mobilya
          </span>
        </motion.div>

        {/* İnce ayırıcı */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 0.6, 0.22, 1] }}
          className="w-12 h-px rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #f97316, transparent)",
          }}
        />

        {/* Açıklama metni */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 0.6, 0.22, 1] }}
          className="text-base sm:text-lg font-light text-zinc-400 leading-relaxed max-w-sm"
        >
          Efsane bir deneyim için son dokunuşları yapıyoruz.
          <br />
          <span className="text-zinc-300 font-normal">Çok yakında buradayız.</span>
        </motion.p>

        {/* Alt dekor — animasyonlu nokta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex items-center gap-2"
        >
          {[0, 0.2, 0.4].map((delay) => (
            <motion.span
              key={delay}
              className="w-1.5 h-1.5 rounded-full bg-zinc-700"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.6,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
