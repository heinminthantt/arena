"use client";

import { useEffect, useRef, useState } from "react";
import { PERMISSION_CARDS, pick, type PermCard } from "@/lib/games-content";
import { CheckIcon } from "@/components/icons";
import type { GameCtx } from "./ctx";
import { EndPanel, GameHead, StartPanel, StatChip } from "./shared";

const ROUND_SECONDS = 45;
const CLEAR_CORRECT = 8;

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PermissionPanicGame({ ctx }: { ctx: GameCtx }) {
  const { lang, t } = ctx;
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [deck, setDeck] = useState<PermCard[]>(() => shuffled(PERMISSION_CARDS));
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [lastWhy, setLastWhy] = useState<{ ok: boolean; card: PermCard } | null>(null);
  const finished = useRef(false);

  const finish = (finalScore: number, finalCorrect: number) => {
    if (finished.current) return;
    finished.current = true;
    setPhase("done");
    ctx.finishRun("permission", finalScore, finalCorrect >= CLEAR_CORRECT);
  };

  useEffect(() => {
    if (phase !== "playing") return;
    const iv = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) { clearInterval(iv); finish(score, correct); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const start = () => {
    finished.current = false;
    setDeck(shuffled(PERMISSION_CARDS));
    setIdx(0); setCorrect(0); setStreak(0); setScore(0);
    setTimeLeft(ROUND_SECONDS); setLastWhy(null);
    setPhase("playing");
  };

  const answer = (allow: boolean) => {
    if (phase !== "playing") return;
    const card = deck[idx];
    const right = allow === card.allow;
    const newStreak = right ? streak + 1 : 0;
    const gained = right ? 10 + (newStreak % 3 === 0 ? 10 : 0) : 0;
    const newScore = score + gained;
    const newCorrect = correct + (right ? 1 : 0);
    setStreak(newStreak); setScore(newScore); setCorrect(newCorrect);
    setLastWhy({ ok: right, card });
    if (idx + 1 >= deck.length) finish(newScore, newCorrect);
    else setIdx(idx + 1);
  };

  const card = deck[Math.min(idx, deck.length - 1)];

  return (
    <div data-testid="game-permission">
      <GameHead ctx={ctx} id="permission" icon={<CheckIcon size={42} />} />
      {phase === "idle" ? (
        <StartPanel ctx={ctx} game="permission" onStart={start}>
          <p className="mx-auto max-w-2xl text-[21px] font-semibold leading-relaxed text-[#5b5872]">
            {pick(lang,
              "45 seconds. Each app asks for one permission. Ask one question: does this app need that to do its job?",
              "စက္ကန့် ၄၅။ App တစ်ခုချင်းက permission တစ်ခု တောင်းမယ်။ မေးခွန်း တစ်ခုပဲ မေးပါ: ဒီ app က သူ့ အလုပ်အတွက် ဒါ တကယ် လိုလား?")}
          </p>
        </StartPanel>
      ) : phase === "done" ? (
        <EndPanel ctx={ctx} game="permission" cleared={correct >= CLEAR_CORRECT} score={score} onAgain={start}>
          <p className="mt-3 text-[20px] font-semibold text-[#5b5872]">
            {pick(lang, `You judged ${correct} of ${deck.length} requests correctly. ${CLEAR_CORRECT}+ clears the round.`,
              `တောင်းဆိုမှု ${deck.length} ခုထဲက ${correct} ခု မှန်အောင် ဆုံးဖြတ်နိုင်တယ်။ ${CLEAR_CORRECT} ခု မှန်ရင် ပြီးတယ်။`)}
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
          <div key={idx} className="pv-card pv-rise bg-white px-9 py-8">
            <div className="flex items-center gap-4">
              <span className="flex h-[64px] w-[64px] items-center justify-center rounded-[20px] bg-[#e9fbe0] text-[30px]">📱</span>
              <div>
                <div className="text-[24px] font-black" data-testid="perm-app">{pick(lang, card.appEn, card.appMy)}</div>
                <div className="text-[16px] font-bold text-[#8a87a0]">{pick(lang, "is asking for", "တောင်းနေတယ်")}</div>
              </div>
            </div>
            <p data-testid="perm-ask" data-answer={card.allow ? "allow" : "deny"} className="mt-5 rounded-[20px] bg-[#faf9ff] px-6 py-5 text-[27px] font-extrabold leading-snug border-[3px] border-[#eceaf6]">
              {pick(lang, card.permEn, card.permMy)}
            </p>
            {lastWhy ? (
              <p className={`mt-4 text-[19px] font-bold leading-relaxed ${lastWhy.ok ? "text-[#46a302]" : "text-[#d33131]"}`} data-testid="perm-why">
                {lastWhy.ok ? "✓ " : "✗ "}{pick(lang, lastWhy.card.whyEn, lastWhy.card.whyMy)}
              </p>
            ) : null}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-5">
            <button data-testid="perm-deny" onClick={() => answer(false)}
              className="pv-btn min-h-[84px] text-[26px]" style={{ background: "#ff4b4b", ["--pv-shade" as string]: "#d33131" }}>
              ✗ {pick(lang, "DENY", "ငြင်းမယ်")}
            </button>
            <button data-testid="perm-allow" onClick={() => answer(true)}
              className="pv-btn min-h-[84px] text-[26px]" style={{ background: "#58cc02", ["--pv-shade" as string]: "#46a302" }}>
              ✓ {pick(lang, "ALLOW", "ခွင့်ပြုမယ်")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
