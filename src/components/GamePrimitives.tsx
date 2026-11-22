"use client";

import type { ReactNode } from "react";
import { FlameIcon } from "@/components/icons";

/* Bright Mobile Game primitives: chunky cards, hard shadows, vivid tones.
   (Was the scrapbook sticker set before the Bright restyle.) */

export function MissionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`pv-card bg-white p-8 ${className}`}>{children}</div>;
}

export function FeedbackPanel({ title, children, tone = "mint" }: { title: string; children: ReactNode; tone?: "mint" | "sky" | "butter" }) {
  const colors = { mint: "bg-[#e9fbe0] text-[#2c5c05]", sky: "bg-[#e3f4fe] text-[#0d4d6e]", butter: "bg-[#fff6cf] text-[#6b5410]" };
  return (
    <section className={`mt-5 rounded-[24px] px-6 py-5 text-[21px] font-semibold leading-relaxed shadow-[0_6px_0_rgba(23,15,66,0.12)] ${colors[tone]}`} aria-live="polite">
      <h3 className="font-black">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function Objective({ children }: { children: ReactNode }) {
  return (
    <div className="mb-5 flex items-start gap-3 rounded-[20px] bg-white/90 px-5 py-4 text-[20px] font-bold text-[#3c3a55] shadow-[0_5px_0_rgba(23,15,66,0.18)]">
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
    <div className="pv-card mb-6 flex flex-wrap items-center gap-6 bg-white px-7 py-5">
      <div className="relative shrink-0">
        <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full border-[5px] border-[#d7ffb8] bg-gradient-to-b from-[#7ee82e] to-[#58cc02] shadow-[0_6px_0_#46a302]">
          <span className="text-[42px] leading-none">{icon ?? "🛡️"}</span>
        </div>
      </div>
      <div className="min-w-[300px] flex-1">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="text-[30px] font-black leading-none">{rank}</span>
          <span className="text-[21px] font-black text-[#b8860b]">🛡 {xp} {label}</span>
          {streak >= 2 ? (
            <span className="flex items-center gap-1 rounded-full bg-[#ffe9d2] px-3.5 py-1 text-[17px] font-black text-[#c26a00]">
              <FlameIcon size={18} /> {streakLabel} ×{streak}
            </span>
          ) : null}
          {best >= 3 ? (
            <span className="rounded-full bg-[#efedfa] px-3.5 py-1 text-[16px] font-black text-[#8a87a0]">
              {bestLabel} ×{best}
            </span>
          ) : null}
        </div>
        <div className="pv-bar mt-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} progress`}>
          <div className="pv-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1.5 text-[16px] font-bold text-[#8a87a0]">{next ? next : <>{maxLabel} 👑</>}</div>
      </div>
    </div>
  );
}
