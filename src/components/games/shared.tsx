"use client";

import type { ReactNode } from "react";
import { SECTION_COLORS, type GameId } from "@/lib/content";
import { CheckIcon, PlayIcon } from "@/components/icons";
import type { GameCtx } from "./ctx";

/* Section header used by every game page: icon disc, title, sub, and a
   cleared chip once the game has been beaten on this device. */
export function GameHead({ ctx, id, icon }: { ctx: GameCtx; id: string; icon: ReactNode }) {
  const c = SECTION_COLORS[id] ?? SECTION_COLORS.home;
  const prog = (ctx.S.games as Record<string, { cleared: boolean } | undefined>)[id];
  return (
    <div className="mb-6 flex flex-wrap items-center gap-5">
      <span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-[24px] text-white"
        style={{ background: `linear-gradient(180deg, ${c.color}, ${c.shade})`, boxShadow: `0 6px 0 ${c.shade}` }}>
        {icon}
      </span>
      <div className="min-w-[280px] flex-1">
        <h2 className="text-[42px] font-black leading-tight text-white" style={{ textShadow: "0 3px 0 rgba(23,15,66,0.25)" }}>
          {ctx.t(id)}
        </h2>
        <p className="max-w-4xl text-[20px] font-semibold leading-relaxed text-white/85">{ctx.t(id + "Sub")}</p>
      </div>
      {prog?.cleared ? (
        <span className="flex items-center gap-2 rounded-full bg-[#58cc02] px-5 py-2.5 text-[18px] font-black text-white shadow-[0_5px_0_#46a302]">
          <CheckIcon size={20} /> {ctx.t("clearedWord")}
        </span>
      ) : null}
    </div>
  );
}

/* Start panel: shown before a run, carries best score and plays. */
export function StartPanel({ ctx, game, children, onStart }: {
  ctx: GameCtx; game: GameId; children?: ReactNode; onStart: () => void;
}) {
  const g = ctx.S.games[game];
  const c = SECTION_COLORS[game];
  return (
    <div className="pv-card bg-white px-9 py-9 text-center" data-testid={`start-${game}`}>
      {children}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[18px] font-bold text-[#8a87a0]">
        {g.plays > 0 ? <span>{ctx.t("roundWord")}: {g.plays}</span> : null}
        {g.best > 0 ? <span>· {ctx.t("scoreWord")}: {g.best}</span> : null}
        {g.cleared ? <span className="text-[#46a302]">· {ctx.t("clearedWord")}</span> : null}
      </div>
      <button data-testid="start-btn" onClick={onStart}
        className="pv-btn mt-6 px-10 py-4 text-[24px]"
        style={{ background: c.color, ["--pv-shade" as string]: c.shade }}>
        <PlayIcon size={20} /> {ctx.t("startBtn")}
      </button>
    </div>
  );
}

/* End-of-run panel: result, score, lesson slot, play again. */
export function EndPanel({ ctx, game, cleared, score, children, onAgain }: {
  ctx: GameCtx; game: GameId; cleared: boolean; score: number;
  children?: ReactNode; onAgain: () => void;
}) {
  const c = SECTION_COLORS[game];
  return (
    <div className="pv-card bg-white px-9 py-9 text-center" data-testid={`end-${game}`}>
      <div className={`text-[44px] font-black ${cleared ? "text-[#46a302]" : "text-[#d33131]"}`}>
        {cleared ? "🏆 " + ctx.t("clearedWord") : ctx.t("notClearedWord")}
      </div>
      <div className="mt-2 text-[26px] font-black text-[#3c3a55]">
        {ctx.t("scoreWord")}: {score}
      </div>
      {children}
      <button data-testid="again-btn" onClick={onAgain}
        className="pv-btn mt-6 px-9 py-4 text-[22px]"
        style={{ background: c.color, ["--pv-shade" as string]: c.shade }}>
        {ctx.t("againBtn")}
      </button>
    </div>
  );
}

/* The yellow lesson box from the preview design. */
export function LessonBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[24px] border-[3px] border-[#ffe27a] bg-[#fffbe8] px-6 py-5 text-left shadow-[0_6px_0_#f0d060]" data-testid="lesson-box">
      <div className="flex items-center gap-2.5 text-[20px] font-black text-[#8a6d00]">
        <CheckIcon size={22} /> {title}
      </div>
      <div className="mt-2 text-[19px] font-semibold leading-relaxed text-[#5c4d08]">{children}</div>
    </div>
  );
}

/* Small stat chip used in game HUDs. */
export function StatChip({ label, value, bg }: { label: string; value: ReactNode; bg: string }) {
  return (
    <span className="rounded-full px-5 py-2.5 text-[19px] font-black text-white shadow-[0_4px_0_rgba(23,15,66,0.25)]" style={{ background: bg }}>
      {label}: {value}
    </span>
  );
}
