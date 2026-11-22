"use client";

import { useState } from "react";
import { DEEPFAKE_CASES, pick } from "@/lib/games-content";
import { ImageIcon } from "@/components/icons";
import type { GameCtx } from "./ctx";
import { EndPanel, GameHead, LessonBox, StartPanel, StatChip } from "./shared";

const CLEAR_CORRECT = 5;

export default function DeepfakeGame({ ctx }: { ctx: GameCtx }) {
  const { lang, t } = ctx;
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [idx, setIdx] = useState(0);
  const [judged, setJudged] = useState<boolean | null>(null); // player's call: true = said fake
  const [correct, setCorrect] = useState(0);

  const c = DEEPFAKE_CASES[idx];
  const score = correct * 20;

  const start = () => { setIdx(0); setJudged(null); setCorrect(0); setPhase("playing"); };

  const judge = (saidFake: boolean) => {
    if (judged !== null) return;
    setJudged(saidFake);
    if (saidFake === c.isFake) setCorrect(v => v + 1);
  };

  const next = () => {
    if (idx + 1 >= DEEPFAKE_CASES.length) {
      ctx.finishRun("deepfake", score, correct >= CLEAR_CORRECT);
      setPhase("done");
    } else {
      setIdx(idx + 1); setJudged(null);
    }
  };

  const right = judged !== null && judged === c.isFake;

  return (
    <div data-testid="game-deepfake">
      <GameHead ctx={ctx} id="deepfake" icon={<ImageIcon size={42} />} />
      {phase === "idle" ? (
        <StartPanel ctx={ctx} game="deepfake" onStart={start}>
          <p className="mx-auto max-w-2xl text-[21px] font-semibold leading-relaxed text-[#5b5872]">
            {pick(lang,
              "6 cases: videos, voice notes, photos and screenshots, described in words. Real or AI fake? Judge first, then the tells light up.",
              "အမှု ၆ ခု: ဗီဒီယို၊ အသံ မှတ်စု၊ ဓာတ်ပုံနဲ့ screenshot တွေကို စာနဲ့ ဖော်ပြထားတယ်။ အစစ်လား၊ AI အတုလား? အရင် ဆုံးဖြတ်၊ ပြီးရင် လက္ခဏာတွေ ပေါ်လာမယ်။")}
          </p>
        </StartPanel>
      ) : phase === "done" ? (
        <EndPanel ctx={ctx} game="deepfake" cleared={correct >= CLEAR_CORRECT} score={score} onAgain={start}>
          <p className="mt-3 text-[20px] font-semibold text-[#5b5872]">
            {pick(lang, `You called ${correct} of ${DEEPFAKE_CASES.length} cases correctly.`,
              `အမှု ${DEEPFAKE_CASES.length} ခုထဲက ${correct} ခု မှန်အောင် ဆုံးဖြတ်နိုင်တယ်။`)}
          </p>
        </EndPanel>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatChip label={pick(lang, "Case", "အမှု")} value={`${idx + 1} / ${DEEPFAKE_CASES.length}`} bg="#b565d8" />
            <StatChip label="✓" value={correct} bg="#58cc02" />
            <StatChip label={t("scoreWord")} value={score} bg="#00b8a9" />
          </div>
          <div key={idx} className="pv-card pv-rise overflow-hidden bg-white">
            {/* Illustrated media frame: CSS scene, no real people */}
            <div className="relative flex h-[240px] items-center justify-center bg-gradient-to-br from-[#3b2d5c] via-[#5b21b6] to-[#1cb0f6]">
              <span className="absolute left-6 top-5 rounded-full bg-white/20 px-4 py-1.5 text-[15px] font-black tracking-widest text-white">
                {pick(lang, c.kindEn, c.kindMy).toUpperCase()}
              </span>
              <span className="text-[110px] leading-none" aria-hidden>
                {c.kindEn === "Video" ? "🎬" : c.kindEn === "Voice note" ? "🎙️" : c.kindEn === "Photo" ? "🖼️" : "📸"}
              </span>
              {judged !== null ? (
                <span className={`absolute bottom-5 right-6 rounded-full px-5 py-2 text-[18px] font-black text-white ${c.isFake ? "bg-[#ff4b4b]" : "bg-[#58cc02]"}`}>
                  {c.isFake ? pick(lang, "IT WAS AI FAKE", "AI အတု ဖြစ်တယ်") : pick(lang, "IT WAS REAL", "အစစ် ဖြစ်တယ်")}
                </span>
              ) : null}
            </div>
            <div className="px-9 py-7">
              <h3 className="text-[28px] font-black leading-tight">{pick(lang, c.titleEn, c.titleMy)}</h3>
              <p data-testid="df-desc" className="mt-3 text-[21px] font-semibold leading-[1.65] text-[#3c3a55]">
                {pick(lang, c.descEn, c.descMy)}
              </p>
              {judged === null ? (
                <div className="mt-6 grid grid-cols-2 gap-5">
                  <button data-testid="df-real" onClick={() => judge(false)}
                    className="pv-btn min-h-[80px] text-[24px]" style={{ background: "#58cc02", ["--pv-shade" as string]: "#46a302" }}>
                    ✓ {pick(lang, "REAL", "အစစ်")}
                  </button>
                  <button data-testid="df-fake" onClick={() => judge(true)}
                    className="pv-btn min-h-[80px] text-[24px]" style={{ background: "#ff4b4b", ["--pv-shade" as string]: "#d33131" }}>
                    🎭 {pick(lang, "AI FAKE", "AI အတု")}
                  </button>
                </div>
              ) : (
                <div className="mt-6 flex flex-col gap-5">
                  <div className={`text-[24px] font-black ${right ? "text-[#46a302]" : "text-[#d33131]"}`}>
                    {right ? "✓ " + pick(lang, "You called it right.", "မှန်အောင် ဆုံးဖြတ်နိုင်တယ်။")
                      : "✗ " + pick(lang, "Not this time. Look at the tells:", "ဒီတစ်ခါ မဟုတ်ဘူး။ လက္ခဏာတွေကို ကြည့်ပါ:")}
                  </div>
                  <LessonBox title={pick(lang, "The tells", "လက္ခဏာတွေ")}>
                    <ul className="ml-5 list-disc">
                      {c.tells.map((tl, ti) => <li key={ti}>{pick(lang, tl.en, tl.my)}</li>)}
                    </ul>
                  </LessonBox>
                  <button data-testid="df-next" onClick={next}
                    className="pv-btn self-end px-8 py-3.5 text-[21px]" style={{ background: "#b565d8", ["--pv-shade" as string]: "#9a45bd" }}>
                    {idx + 1 >= DEEPFAKE_CASES.length ? pick(lang, "Finish", "အဆုံးသတ်မယ်") : t("next")} →
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
