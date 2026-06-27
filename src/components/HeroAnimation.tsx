"use client";

export default function HeroAnimation() {
  return (
    <div className="w-full h-full bg-[#f5f0ea] rounded-[2.5rem] overflow-hidden relative flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #d4956a 0%, transparent 70%)", animation: "pulse-slow 6s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #b8860b 0%, transparent 70%)", animation: "pulse-slow 8s ease-in-out infinite reverse" }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-amber-400/30"
          style={{
            width: `${4 + (i % 5) * 3}px`,
            height: `${4 + (i % 5) * 3}px`,
            left: `${8 + (i * 7.5) % 84}%`,
            top: `${10 + (i * 11.3) % 80}%`,
            animation: `float-particle ${5 + (i % 4) * 1.5}s ease-in-out infinite`,
            animationDelay: `${(i * 0.7) % 4}s`,
          }}
        />
      ))}

      {/* Main furniture SVG — minimalist TV unit */}
      <div
        className="relative z-10"
        style={{ animation: "float-main 5s ease-in-out infinite" }}
      >
        <svg
          viewBox="0 0 640 300"
          className="w-full max-w-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow on floor */}
          <ellipse cx="320" cy="285" rx="220" ry="12" fill="#b8860b" opacity="0.12" />

          {/* Wall mount bracket */}
          <rect x="305" y="80" width="30" height="8" rx="2" fill="#8B7355" opacity="0.5" />
          <rect x="316" y="88" width="8" height="24" rx="2" fill="#8B7355" opacity="0.4" />

          {/* Main body — TV unit */}
          <rect x="80" y="112" width="480" height="110" rx="12" fill="#E8DDD0" />

          {/* Wood grain effect — top panel */}
          <rect x="80" y="112" width="480" height="14" rx="12" fill="#C9A96E" />
          <rect x="80" y="120" width="480" height="6" fill="#C9A96E" />
          {/* Grain lines */}
          {[100, 160, 240, 320, 400, 500, 560].map((x, i) => (
            <line key={i} x1={x} y1="112" x2={x + 20} y2="126" stroke="#B8935A" strokeWidth="0.5" opacity="0.4" />
          ))}

          {/* Door panels */}
          {/* Left door */}
          <rect x="92" y="136" width="130" height="76" rx="6" fill="#DDD3C4" />
          <rect x="92" y="136" width="130" height="76" rx="6" stroke="#C4B49A" strokeWidth="1" />
          {/* Left door handle */}
          <rect x="218" y="170" width="2" height="18" rx="1" fill="#A0906E" />

          {/* Middle left door */}
          <rect x="232" y="136" width="80" height="76" rx="6" fill="#DDD3C4" />
          <rect x="232" y="136" width="80" height="76" rx="6" stroke="#C4B49A" strokeWidth="1" />
          <rect x="308" y="170" width="2" height="18" rx="1" fill="#A0906E" />

          {/* Open shelf (middle) */}
          <rect x="322" y="136" width="76" height="76" rx="6" fill="#D4C9B8" />
          {/* Shelf item — decorative cylinder */}
          <ellipse cx="360" cy="195" rx="14" ry="5" fill="#8B7355" opacity="0.6" />
          <rect x="346" y="155" width="28" height="40" rx="3" fill="#A0906E" opacity="0.7" />
          <ellipse cx="360" cy="155" rx="14" ry="5" fill="#B8A080" opacity="0.7" />

          {/* Right door */}
          <rect x="408" y="136" width="140" height="76" rx="6" fill="#DDD3C4" />
          <rect x="408" y="136" width="140" height="76" rx="6" stroke="#C4B49A" strokeWidth="1" />
          <rect x="410" y="170" width="2" height="18" rx="1" fill="#A0906E" />

          {/* Bottom panel */}
          <rect x="80" y="218" width="480" height="6" rx="3" fill="#C9A96E" />

          {/* Legs */}
          <rect x="120" y="222" width="12" height="28" rx="3" fill="#A0906E" />
          <rect x="508" y="222" width="12" height="28" rx="3" fill="#A0906E" />
          <rect x="230" y="222" width="10" height="22" rx="3" fill="#A0906E" />
          <rect x="400" y="222" width="10" height="22" rx="3" fill="#A0906E" />

          {/* Subtle reflection line on top */}
          <rect x="100" y="114" width="200" height="2" rx="1" fill="white" opacity="0.3" />

          {/* Decorative objects on top */}
          {/* Vase */}
          <ellipse cx="520" cy="112" rx="10" ry="4" fill="#8B7355" opacity="0.5" />
          <path d="M510 112 Q508 92 515 85 Q520 82 525 85 Q532 92 530 112" fill="#6B5A3E" opacity="0.6" />
          <ellipse cx="520" cy="85" rx="6" ry="3" fill="#7A6A50" opacity="0.5" />
          {/* Stems */}
          <line x1="520" y1="84" x2="516" y2="72" stroke="#5a8a3a" strokeWidth="1.5" opacity="0.6" />
          <circle cx="516" cy="70" r="4" fill="#7aaa5a" opacity="0.6" />
          <line x1="520" y1="80" x2="526" y2="68" stroke="#5a8a3a" strokeWidth="1.5" opacity="0.6" />
          <circle cx="526" cy="66" r="3" fill="#9acc7a" opacity="0.6" />

          {/* Small book stack */}
          <rect x="150" y="100" width="40" height="7" rx="1" fill="#D4956A" opacity="0.7" />
          <rect x="152" y="94" width="36" height="7" rx="1" fill="#B8CCE0" opacity="0.7" />
          <rect x="154" y="88" width="32" height="7" rx="1" fill="#E8D5B0" opacity="0.7" />
        </svg>
      </div>

      {/* Floating label */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/80 rounded-full px-5 py-2"
        style={{ animation: "fade-label 5s ease-in-out infinite" }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-xs font-semibold text-zinc-700 tracking-wide">Premium Mobilya Tasarım</span>
      </div>

      <style>{`
        @keyframes float-main {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.1); }
        }
        @keyframes fade-label {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
