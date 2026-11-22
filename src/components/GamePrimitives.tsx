"use client";

import type { ReactNode } from "react";

export function MissionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`relative ${className}`}><span className="pushpin" /><div className="sticker p-8">{children}</div></div>;
}

export function FeedbackPanel({ title, children, tone = "mint" }: { title: string; children: ReactNode; tone?: "mint" | "sky" | "butter" }) {
  const colors = { mint: "bg-pastel-mint", sky: "bg-pastel-sky", butter: "bg-pastel-butter" };
  return <section className={`mt-5 rounded-3xl px-6 py-5 text-[22px] leading-relaxed ${colors[tone]}`} aria-live="polite"><h3 className="font-black">{title}</h3><div className="mt-2">{children}</div></section>;
}

export function Objective({ children }: { children: ReactNode }) {
  return <div className="mb-5 rounded-2xl border border-ink/10 bg-white/75 px-5 py-4 text-[20px] font-bold shadow-sm"><span className="mr-2 text-leaf-deep">OBJECTIVE</span>{children}</div>;
}

export function PlayerHud({ rank, xp, next, pct, streak, best, label, streakLabel, bestLabel, nextLabel, maxLabel }: {
  rank: string; xp: number; next: string | null; pct: number; streak: number; best: number;
  label: string; streakLabel: string; bestLabel: string; nextLabel: string; maxLabel: string;
}) {
  return <div className="sticker mb-6 flex flex-wrap items-center gap-5 px-6 py-4">
    <div className="stamp-badge flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full border-4 border-dashed border-ink/25 bg-sun text-center text-2xl shadow-[0_8px_20px_rgba(0,0,0,0.15)]" aria-hidden="true">🛡</div>
    <div className="min-w-[300px] flex-1">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1"><span className="text-[28px] font-black">{rank}</span><span className="text-[21px] font-bold text-ink-soft">🛡 {xp} {label}</span>{streak >= 2 ? <span className="rounded-full bg-[#ffe3c2] px-4 py-1.5 text-[19px] font-extrabold text-[#9a4d00]">🔥 {streakLabel} ×{streak}</span> : null}{best >= 3 ? <span className="rounded-full bg-cream px-4 py-1.5 text-[17px] font-extrabold text-ink-soft">{bestLabel} 🔥 ×{best}</span> : null}</div>
      <div className="mt-2.5 h-[22px] overflow-hidden rounded-full border border-paper-line bg-cream-deep" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} progress`}><div className="xp-fill h-full rounded-full" style={{ width: `${pct}%` }} /></div>
      <div className="mt-1.5 text-[17px] font-bold text-ink-soft">{next ? <>{nextLabel}: {next}</> : <>{maxLabel} 👑</>}</div>
    </div>
  </div>;
}
