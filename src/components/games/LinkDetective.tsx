"use client";

import { useState } from "react";
import { LINK_ROUNDS, pick } from "@/lib/games-content";
import { LinkIcon } from "@/components/icons";
import type { GameCtx } from "./ctx";
import { EndPanel, GameHead, LessonBox, StartPanel, StatChip } from "./shared";

const CLEAR_CORRECT = 6;

export default function LinkDetectiveGame({ ctx }: { ctx: GameCtx }) {
  const { lang, t } = ctx;
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);

  const start = () => { setIdx(0); setPicked(null); setCorrect(0); setMissed([]); setPhase("playing"); };

  const round = LINK_ROUNDS[idx];
  const score = correct * 15;

  const choose = (oi: number) => {
    if (picked !== null) return;
    setPicked(oi);
    if (oi === round.real) setCorrect(c => c + 1);
    else setMissed(m => [...m, `${round.themeEn}: picked ${round.options[oi]}, real ${round.options[round.real]}`]);
  };

  const next = () => {
    if (idx + 1 >= LINK_ROUNDS.length) {
      ctx.finishRun("link", score, correct >= CLEAR_CORRECT);
      setPhase("done");
    } else {
      setIdx(idx + 1); setPicked(null);
    }
  };

  return (
    <div data-testid="game-link">
      <GameHead ctx={ctx} id="link" icon={<LinkIcon size={42} />} />
      {phase === "idle" ? (
        <StartPanel ctx={ctx} game="link" onStart={start}>
          <p className="mx-auto max-w-2xl text-[21px] font-semibold leading-relaxed text-[#5b5872]">
            {pick(lang,
              "8 rounds. Four lookalike links each time, one real. Read the domain from the right, letter by letter.",
              "အလှည့် ၈ ခု။ တစ်ခါမှာ ပုံစံတူ လင့်ခ် ၄ ခု၊ အစစ်က တစ်ခုပဲ။ Domain ကို ညာဘက်ကနေ တစ်လုံးချင်း ဖတ်ပါ။")}
          </p>
        </StartPanel>
      ) : phase === "done" ? (
        <EndPanel ctx={ctx} game="link" cleared={correct >= CLEAR_CORRECT} score={score} onAgain={start}
          summary={`Correct ${correct} of ${LINK_ROUNDS.length}. Missed: ${missed.join("; ") || "none"}.`}>
          <p className="mt-3 text-[20px] font-semibold text-[#5b5872]">
            {pick(lang, `You found the real link in ${correct} of ${LINK_ROUNDS.length} rounds.`,
              `အလှည့် ${LINK_ROUNDS.length} ခုထဲက ${correct} ခုမှာ လင့်ခ် အစစ်ကို ရှာနိုင်တယ်။`)}
          </p>
        </EndPanel>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatChip label={t("roundWord")} value={`${idx + 1} / ${LINK_ROUNDS.length}`} bg="#f5b800" />
            <StatChip label="✓" value={correct} bg="#58cc02" />
            <StatChip label={t("scoreWord")} value={score} bg="#00b8a9" />
          </div>
          <div className="pv-card pv-rise bg-white px-5 py-6 sm:px-9 sm:py-8" key={idx}>
            <div className="text-[19px] font-black tracking-widest text-[#8a87a0]">
              {pick(lang, "WHICH LINK IS REAL?", "ဘယ် လင့်ခ်က အစစ်လဲ?")}
            </div>
            <div className="mt-2 text-[30px] font-black">{pick(lang, round.themeEn, round.themeMy)}</div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {round.options.map((url, oi) => {
                let cls = "border-[#eceaf6] bg-[#faf9ff] text-[#1f2430]";
                let shade = "rgba(23,15,66,0.14)";
                if (picked !== null) {
                  if (oi === round.real) { cls = "border-[#58cc02] bg-[#eefbe4] text-[#2c5c05]"; shade = "#46a302"; }
                  else if (oi === picked) { cls = "border-[#ff4b4b] bg-[#ffecec] text-[#8f1d1d]"; shade = "#d33131"; }
                  else cls = "border-[#eceaf6] bg-[#faf9ff] text-[#a19dc0]";
                }
                return (
                  <button key={oi} data-testid={`link-opt-${oi}`} data-real={oi === round.real ? "true" : "false"} onClick={() => choose(oi)} disabled={picked !== null}
                    className={`rounded-[20px] border-[3px] px-6 py-5 text-left text-[23px] font-extrabold ${cls}`}
                    style={{ boxShadow: `0 6px 0 ${shade}` }}>
                    🔗 {url}
                    {picked !== null && oi === round.real ? <span className="ml-2 text-[#46a302]">✓ {pick(lang, "REAL", "အစစ်")}</span> : null}
                    {picked !== null && oi === picked && oi !== round.real ? <span className="ml-2 text-[#d33131]">✗</span> : null}
                  </button>
                );
              })}
            </div>
            {picked !== null ? (
              <div className="mt-6 flex flex-col gap-5">
                <LessonBox title={picked === round.real
                  ? pick(lang, "Sharp eye!", "မျက်လုံး ထက်တယ်!")
                  : pick(lang, "That one was fake", "အဲ့ဒါ အတု ဖြစ်တယ်")}>
                  {pick(lang, round.lessonEn, round.lessonMy)}
                </LessonBox>
                <button data-testid="link-next" onClick={next}
                  className="pv-btn self-end px-8 py-3.5 text-[21px]" style={{ background: "#f5b800", ["--pv-shade" as string]: "#d99e00" }}>
                  {idx + 1 >= LINK_ROUNDS.length ? pick(lang, "Finish", "အဆုံးသတ်မယ်") : t("next")} →
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
