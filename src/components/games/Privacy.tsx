"use client";

import { useRef, useState } from "react";
import { PRIVACY_SETTINGS, pick } from "@/lib/games-content";
import { GearIcon } from "@/components/icons";
import type { GameCtx } from "./ctx";
import { EndPanel, GameHead, LessonBox, StatChip } from "./shared";

const RISKY_COUNT = PRIVACY_SETTINGS.filter(s => s.risky).length;

export default function PrivacyGame({ ctx }: { ctx: GameCtx }) {
  const { lang, t } = ctx;
  const [fixed, setFixed] = useState<Set<number>>(new Set());
  const [safeOff, setSafeOff] = useState<Set<number>>(new Set());
  const [lesson, setLesson] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const finished = useRef(false);

  const reset = () => { setFixed(new Set()); setSafeOff(new Set()); setLesson(null); setDone(false); finished.current = false; };

  const tap = (i: number) => {
    const s = PRIVACY_SETTINGS[i];
    setLesson(i);
    if (!s.risky) {
      /* Safe settings toggle freely: switching one off is a mistake, not a fix,
         and tapping again switches it back on. */
      const nextOff = new Set(safeOff);
      if (nextOff.has(i)) nextOff.delete(i); else nextOff.add(i);
      setSafeOff(nextOff);
      return;
    }
    if (fixed.has(i) || done) return;
    const next = new Set(fixed);
    next.add(i);
    setFixed(next);
    if (next.size >= RISKY_COUNT && !finished.current) {
      finished.current = true;
      setDone(true);
      ctx.finishRun("privacy", next.size * 20, true);
    }
  };

  return (
    <div data-testid="game-privacy">
      <GameHead ctx={ctx} id="privacy" icon={<GearIcon size={42} />} />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <StatChip label={pick(lang, "Fixed", "ပြင်ပြီး")} value={`${fixed.size} / ${RISKY_COUNT}`} bg="#ff6b9d" />
        {done ? <StatChip label="✓" value={t("clearedWord")} bg="#58cc02" /> : null}
      </div>

      {/* The fake phone */}
      <div className="mx-auto max-w-[760px]">
        <div className="pv-card overflow-hidden bg-white">
          <div className="bg-[#2b2140] px-5 py-5 text-white sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[21px] font-black">📱 {pick(lang, "Phone Settings", "ဖုန်း Settings")}</span>
              <span className="rounded-full bg-[#ff4b4b] px-4 py-1 text-[15px] font-black">
                {RISKY_COUNT - fixed.size} {pick(lang, "risks left", "ခု အန္တရာယ် ကျန်")}
              </span>
            </div>
            <p className="mt-1 text-[16px] font-semibold text-white/75">
              {pick(lang, "Every switch is on. Read each setting, and switch off the ones that put you at risk.",
                "Switch အကုန် ပွင့်နေတယ်။ setting တစ်ခုချင်းကို ဖတ်ပြီး အန္တရာယ်ရှိတာတွေကို ပိတ်ပါ။")}
            </p>
          </div>
          <div className="flex flex-col divide-y-[3px] divide-[#f1eef9] px-5 sm:px-8">
            {PRIVACY_SETTINGS.map((s, i) => {
              const isFixed = fixed.has(i);
              const isSafeOff = !s.risky && safeOff.has(i);
              const on = !isFixed && !isSafeOff;
              return (
                <div key={i} className="flex items-center gap-3 py-5 sm:gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="text-[22px] font-black leading-tight">{pick(lang, s.nameEn, s.nameMy)}</div>
                    <div className={`text-[17px] font-bold ${isFixed ? "text-[#46a302]" : "text-[#5b5872]"}`}>
                      {isFixed ? pick(lang, s.fixEn, s.fixMy)
                        : isSafeOff ? pick(lang, "Off", "ပိတ်ထားတယ်")
                        : pick(lang, s.stateEn, s.stateMy)}
                      {isFixed ? " ✓" : ""}
                    </div>
                  </div>
                  <button
                    data-testid={s.risky ? `privacy-fix-${i}` : `privacy-safe-${i}`}
                    onClick={() => tap(i)}
                    aria-label={pick(lang, s.nameEn, s.nameMy)}
                    className={`pv-switch ${on ? "pv-switch-on" : "pv-switch-off"}`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {lesson !== null ? (
          <div className="mt-6">
            <LessonBox title={PRIVACY_SETTINGS[lesson].risky
              ? (fixed.has(lesson) ? pick(lang, "Locked down", "လော့ခ် ချပြီး") : pick(lang, "Risky setting", "အန္တရာယ် setting"))
              : pick(lang, "This one is healthy", "ဒီတစ်ခုက ကောင်းတယ်")}>
              {pick(lang, PRIVACY_SETTINGS[lesson].lessonEn, PRIVACY_SETTINGS[lesson].lessonMy)}
            </LessonBox>
          </div>
        ) : null}

        {done ? (
          <div className="mt-6">
            <EndPanel ctx={ctx} game="privacy" cleared score={RISKY_COUNT * 20} onAgain={reset}
              summary={`Locked ${fixed.size} of ${RISKY_COUNT} risky settings: ${[...fixed].map(i => PRIVACY_SETTINGS[i].nameEn).join(", ")}.`}>
              <p className="mt-3 text-[20px] font-semibold text-[#5b5872]">
                {pick(lang, "Every risky setting is locked down. This phone is a much harder target now.",
                  "အန္တရာယ် setting အကုန် လော့ခ် ချပြီးပြီ။ ဒီဖုန်းက အခု တိုက်ခိုက်ရ အများကြီး ပိုခက်သွားပြီ။")}
              </p>
            </EndPanel>
          </div>
        ) : null}
      </div>
    </div>
  );
}
