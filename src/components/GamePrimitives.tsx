"use client";

import type { ReactNode } from "react";
import { FlameIcon } from "@/components/icons";

/* Bright Mobile Game primitives: chunky cards, hard shadows, vivid tones.
   (Was the scrapbook sticker set before the Bright restyle.) */

export function MissionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`pv-card bg-white p-5 sm:p-8 ${className}`}>{children}</div>;
}

export function FeedbackPanel({ title, children, tone = "mint" }: { title: string; children: ReactNode; tone?: "mint" | "sky" | "butter" }) {
  const colors = { mint: "bg-[#e9fbe0] text-[#2c5c05]", sky: "bg-[#e3f4fe] text-[#0d4d6e]", butter: "bg-[#fff6cf] text-[#6b5410]" };
  return (
    <section className={`mt-5 rounded-[24px] px-4 py-4 text-[19px] font-semibold leading-relaxed shadow-[0_6px_0_rgba(23,15,66,0.12)] sm:px-6 sm:py-5 sm:text-[21px] ${colors[tone]}`} aria-live="polite">
      <h3 className="font-black">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function Objective({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-start gap-2.5 rounded-[20px] bg-white/90 px-4 py-3.5 text-[18px] font-bold text-[#3c3a55] shadow-[0_5px_0_rgba(23,15,66,0.18)] sm:gap-3 sm:px-5 sm:py-4 sm:text-[20px]">
      <span className="mt-0.5 shrink-0 rounded-full bg-[#ffc800] px-3 py-0.5 text-[14px] font-black tracking-widest text-[#7a5200]">OBJECTIVE</span>
      <span>{children}</span>
    </div>
  );
}

export function PlayerHud({ rank, xp, next, pct, streak, best, label, streakLabel, bestLabel, nextLabel, maxLabel, icon }: {
  rank: string; xp: number; next: string | null; pct: number; streak: number; best: number;
  label: string; streakLabel: string; bestLabel: string; nextLabel: string; maxLabel: string;
  icon?: string;
}) {
  void nextLabel;
  return (
    <div className="pv-card mb-3 flex flex-wrap items-center gap-3 bg-white px-3 py-3 sm:mb-6 sm:gap-6 sm:px-7 sm:py-5">
      <div className="relative shrink-0">
        <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-[4px] border-[#d7ffb8] bg-gradient-to-b from-[#7ee82e] to-[#58cc02] shadow-[0_5px_0_#46a302] sm:h-[92px] sm:w-[92px] sm:border-[5px] sm:shadow-[0_6px_0_#46a302]">
          <span className="text-[22px] leading-none sm:text-[42px]">{icon ?? "🛡️"}</span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:gap-x-4">
          <span className="text-[18px] font-black leading-none sm:text-[30px]">{rank}</span>
          <span className="text-[16px] font-black text-[#b8860b] sm:text-[21px]">🛡 {xp} {label}</span>
          {streak >= 2 ? (
            <span className="flex items-center gap-1 rounded-full bg-[#ffe9d2] px-2.5 py-0.5 text-[14px] font-black text-[#c26a00] sm:px-3.5 sm:py-1 sm:text-[17px]">
              <FlameIcon size={16} /> {streakLabel} ×{streak}
            </span>
          ) : null}
          {best >= 3 ? (
            <span className="hidden rounded-full bg-[#efedfa] px-3.5 py-1 text-[16px] font-black text-[#8a87a0] sm:inline">
              {bestLabel} ×{best}
            </span>
          ) : null}
        </div>
        <div className="pv-bar mt-2 sm:mt-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} progress`}>
          <div className="pv-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 text-[13px] font-bold leading-tight text-[#8a87a0] sm:mt-1.5 sm:text-[16px]">{next ? next : <>{maxLabel} 👑</>}</div>
      </div>
    </div>
  );
}
