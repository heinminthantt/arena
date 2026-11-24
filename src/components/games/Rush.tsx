"use client";

import { useEffect, useRef, useState } from "react";
import { RUSH_MESSAGES, pick } from "@/lib/games-content";
import { BoltIcon } from "@/components/icons";
import type { GameCtx } from "./ctx";
import { EndPanel, GameHead, LessonBox, StartPanel, StatChip } from "./shared";

const ROUND_SECONDS = 60;
const CLEAR_CORRECT = 10;

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function RushGame({ ctx }: { ctx: GameCtx }) {
  const { lang, t } = ctx;
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [deck, setDeck] = useState(() => shuffled(RUSH_MESSAGES));
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const finished = useRef(false);
  const [missed, setMissed] = useState<string[]>([]);

  const finish = (finalScore: number, finalCorrect: number) => {
    if (finished.current) return;
    finished.current = true;
    setPhase("done");
    ctx.finishRun("rush", finalScore, finalCorrect >= CLEAR_CORRECT);
  };

  useEffect(() => {
    if (phase !== "playing") return;
    const iv = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) {
          clearInterval(iv);
          finish(score, correct);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const start = () => {
    finished.current = false;
    setDeck(shuffled(RUSH_MESSAGES));
    setIdx(0); setCorrect(0); setStreak(0); setScore(0);
    setTimeLeft(ROUND_SECONDS); setFlash(null);
    setMissed([]);
    setPhase("playing");
  };

  const answer = (guessScam: boolean) => {
    if (phase !== "playing" || flash) return;
    const msg = deck[idx];
    const right = guessScam === msg.isScam;
    if (!right) setMissed(m => [...m, `${msg.en} (${msg.isScam ? "scam" : "safe"})`]);
    const newStreak = right ? streak + 1 : 0;
    const gained = right ? 10 + (newStreak % 3 === 0 ? 10 : 0) : 0;
    const newScore = score + gained;
    const newCorrect = correct + (right ? 1 : 0);
    setStreak(newStreak); setScore(newScore); setCorrect(newCorrect);
    setFlash(right ? "good" : "bad");
    setTimeout(() => {
      setFlash(null);
      if (idx + 1 >= deck.length) finish(newScore, newCorrect);
      else setIdx(idx + 1);
    }, 380);
  };

  const msg = deck[Math.min(idx, deck.length - 1)];

  return (
    <div data-testid="game-rush">
      <GameHead ctx={ctx} id="rush" icon={<BoltIcon size={42} />} />
      {phase === "idle" ? (
        <StartPanel ctx={ctx} game="rush" onStart={start}>
          <p className="mx-auto max-w-2xl text-[21px] font-semibold leading-relaxed text-[#5b5872]">
            {pick(lang,
              "60 seconds. Messages keep coming. Scam or Safe, as fast as you can. Every 3 correct in a row pays a streak bonus.",
              "စက္ကန့် ၆၀။ မက်ဆေ့တွေ ဆက်တိုက် ဝင်လာမယ်။ လိမ်တာလား၊ လုံခြုံလား၊ မြန်မြန် ဆုံးဖြတ်ပါ။ ၃ ခု ဆက်တိုက် မှန်ရင် streak bonus ရတယ်။")}
          </p>
        </StartPanel>
      ) : phase === "done" ? (
        <EndPanel ctx={ctx} game="rush" cleared={correct >= CLEAR_CORRECT} score={score} onAgain={start}
          summary={`Correct ${correct} of ${correct + missed.length} answered. Missed: ${missed.join("; ") || "none"}.`}>
          <p className="mt-3 text-[20px] font-semibold text-[#5b5872]">
            {pick(lang,
              `You judged ${correct} of ${deck.length} messages correctly. ${CLEAR_CORRECT}+ correct clears the round.`,
              `မက်ဆေ့ ${deck.length} ခုထဲက ${correct} ခု မှန်အောင် ဆုံးဖြတ်နိုင်တယ်။ ${CLEAR_CORRECT} ခု မှန်ရင် ဒီအလှည့် ပြီးတယ်။`)}
          </p>
        </EndPanel>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatChip label={t("timeLeft")} value={timeLeft + "s"} bg={timeLeft <= 10 ? "#ff4b4b" : "#ff9600"} />
            <StatChip label={t("scoreWord")} value={score} bg="#00b8a9" />
            <StatChip label="✓" value={correct} bg="#58cc02" />
            <StatChip label="🔥" value={"×" + streak} bg="#a560e8" />
            <span className="text-[18px] font-bold text-white/85">{idx + 1} / {deck.length}</span>
          </div>
          <div className="pv-timer mb-5"><div className="pv-timer-fill" style={{ width: (timeLeft / ROUND_SECONDS) * 100 + "%" }} /></div>
          <div key={idx} className={`pv-card pv-rise bg-white px-5 py-6 sm:px-9 sm:py-8 ${flash === "bad" ? "pv-shake" : ""}`}
            style={flash ? { boxShadow: flash === "good" ? "0 10px 0 #46a302" : "0 10px 0 #d33131" } : undefined}>
            <div className="flex items-center gap-3">
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-[#e3f4fe] text-[26px]">✉️</span>
              <div>
                <div className="text-[22px] font-black">{pick(lang, msg.fromEn, msg.fromMy)}</div>
                <div className="text-[15px] font-bold text-[#8a87a0]">{pick(lang, "New message", "မက်ဆေ့ အသစ်")}</div>
              </div>
              {flash ? (
                <span className={`ml-auto rounded-full px-4 py-1.5 text-[17px] font-black text-white ${flash === "good" ? "bg-[#58cc02]" : "bg-[#ff4b4b]"}`}>
                  {flash === "good" ? "✓ +10" : "✗"}
                </span>
              ) : null}
            </div>
            <p data-testid="rush-msg" data-kind={msg.isScam ? "scam" : "safe"} className="mt-5 whitespace-pre-wrap text-[27px] font-semibold leading-[1.6]">
              {pick(lang, msg.en, msg.my)}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <button data-testid="rush-scam" onClick={() => answer(true)}
              className="pv-btn min-h-[72px] text-[24px] sm:min-h-[84px] sm:text-[26px]" style={{ background: "#ff4b4b", ["--pv-shade" as string]: "#d33131" }}>
              ⚠ {t("scamBtn")}
            </button>
            <button data-testid="rush-safe" onClick={() => answer(false)}
              className="pv-btn min-h-[72px] text-[24px] sm:min-h-[84px] sm:text-[26px]" style={{ background: "#58cc02", ["--pv-shade" as string]: "#46a302" }}>
              ✓ {t("safeBtn")}
            </button>
          </div>
          <div className="mt-6">
            <LessonBox title={pick(lang, "The rush rule", "အမြန်ဖမ်း စည်းကမ်း")}>
              {pick(lang,
                "Speed matters, but the tells do not change: prizes you never entered, codes, PINs and pay-first jobs are always scams, however fast they arrive.",
                "အမြန်နှုန်း အရေးကြီးတယ်၊ ဒါပေမယ့် လက္ခဏာတွေက မပြောင်းဘူး: မဝင်ဖူးတဲ့ ဆု၊ ကုဒ်၊ PIN နဲ့ အရင် ငွေသွင်းရတဲ့ အလုပ်က ဘယ်လောက် မြန်မြန် ရောက်ရောက် လိမ်တာပဲ။")}
            </LessonBox>
          </div>
        </>
      )}
    </div>
  );
}
