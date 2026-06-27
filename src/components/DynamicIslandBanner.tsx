"use client";

import { useEffect, useRef, useState } from "react";

interface Char {
  sl: number;
  r: number;
  bw: number;
  body: string;
  leg: string;
  hair: string;
  dur: string;
  delay: string;
}

const AL = 12;

const CHARS: Char[] = [
  { sl: 30, r: 10, bw: 15, body: "#1d4ed8", leg: "#1e3a8a", hair: "#3d2b1f", dur: "3.2s", delay: "0s" },
  { sl: 16, r: 9,  bw: 13, body: "#e11d48", leg: "#9f1239", hair: "#5c1d1d", dur: "2.8s", delay: "0.5s" },
  { sl: 26, r: 8,  bw: 12, body: "#16a34a", leg: "#14532d", hair: "#2c1a0e", dur: "3.5s", delay: "0.3s" },
  { sl: 20, r: 7,  bw: 11, body: "#d97706", leg: "#92400e", hair: "#4a3000", dur: "3s",   delay: "0.8s" },
];

// Total visual width of 4 characters + gaps
const CHARS_WIDTH = CHARS.length * 30 + (CHARS.length - 1) * 14; // 162px

function ChibiHanger({ sl, r, bw, body, leg, hair, dur, delay }: Char) {
  const cx    = 15;
  const headY = sl + AL + r;
  const bodyY = headY + r + 2;
  const bodyH = 10;
  const legY  = bodyY + bodyH;
  const svgH  = legY + 13;

  return (
    <svg
      viewBox={`0 0 30 ${svgH}`}
      width={30}
      height={svgH}
      style={{
        display: "block",
        animation: `hs-sway ${dur} ease-in-out infinite`,
        animationDelay: delay,
        transformOrigin: `${cx}px 0px`,
        overflow: "visible",
      }}
    >
      <line x1={cx} y1={0} x2={cx} y2={sl} stroke="#bbb" strokeWidth="0.8" />

      {/* Arms drawn FIRST so head renders on top */}
      <line x1={cx - 4} y1={sl} x2={cx - bw / 2} y2={bodyY} stroke="#fde8d8" strokeWidth="2.4" strokeLinecap="round" />
      <line x1={cx + 4} y1={sl} x2={cx + bw / 2} y2={bodyY} stroke="#fde8d8" strokeWidth="2.4" strokeLinecap="round" />

      <circle cx={cx - 4} cy={sl} r={2.6} fill="#fde8d8" />
      <circle cx={cx + 4} cy={sl} r={2.6} fill="#fde8d8" />

      <circle cx={cx} cy={headY - r * 0.52} r={r} fill={hair} />
      <circle cx={cx} cy={headY} r={r} fill="#fde8d8" />

      <circle cx={cx - r * 0.34} cy={headY + r * 0.06} r={r * 0.19} fill="#1a1a2e" />
      <circle cx={cx + r * 0.34} cy={headY + r * 0.06} r={r * 0.19} fill="#1a1a2e" />
      <circle cx={cx - r * 0.2}  cy={headY - r * 0.07} r={r * 0.09} fill="white" />
      <circle cx={cx + r * 0.48} cy={headY - r * 0.07} r={r * 0.09} fill="white" />

      <path
        d={`M${cx - r * 0.27},${headY + r * 0.43} Q${cx},${headY + r * 0.67} ${cx + r * 0.27},${headY + r * 0.43}`}
        stroke="#e07080" strokeWidth="0.85" fill="none"
      />

      <rect x={cx - bw / 2} y={bodyY} width={bw} height={bodyH} rx={3.5} fill={body} />

      <rect x={cx - bw / 2 + 1} y={legY} width={bw / 2 - 2} height={8} rx={2} fill={body} />
      <rect x={cx + 1}           y={legY} width={bw / 2 - 2} height={8} rx={2} fill={body} />

      <ellipse cx={cx - bw / 4 + 0.5} cy={legY + 9} rx={bw / 4 + 1.5} ry={2} fill={leg} />
      <ellipse cx={cx + bw / 4 + 0.5} cy={legY + 9} rx={bw / 4 + 1.5} ry={2} fill={leg} />
    </svg>
  );
}

export default function DynamicIslandBanner() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [leftPx, setLeftPx] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const logo = document.querySelector('header img[alt="Decoroys"]') as HTMLElement | null;
      const wrapper = wrapperRef.current;
      if (!logo || !wrapper) return;

      const logoRect  = logo.getBoundingClientRect();
      const wrapRect  = wrapper.getBoundingClientRect();

      // getBoundingClientRect already includes CSS scale — these are visual pixel bounds
      const logoLeft  = logoRect.left  - wrapRect.left;
      const logoWidth = logoRect.width;

      // The M icon takes ~28% of the visual logo; DECOROYS text fills the rest.
      // Center the character group on the mid-point of the text area.
      const textCenter = logoLeft + logoWidth * 0.62;
      setLeftPx(Math.max(0, textCenter - CHARS_WIDTH / 2));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        height: 0,
        position: "relative",
        overflow: "visible",
        background: "transparent",
        pointerEvents: "none",
        zIndex: 99,
      }}
    >
      <style>{`
        @keyframes hs-sway {
          0%, 100% { transform: rotate(-5deg); }
          50%       { transform: rotate(5deg); }
        }
      `}</style>

      {leftPx !== null && (
        <div
          style={{
            position: "absolute",
            left: leftPx,
            top: 0,
            display: "flex",
            gap: "14px",
            alignItems: "flex-start",
          }}
        >
          {CHARS.map((c, i) => (
            <ChibiHanger key={i} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}
