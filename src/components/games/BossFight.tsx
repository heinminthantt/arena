"use client";

import { useState } from "react";
import { BOSS_HIT_DAMAGE, BOSS_MAX_HP, BOSS_PLAYER_HEARTS, BOSS_WAVES, pick } from "@/lib/stories-content";
import { SkullIcon } from "@/components/icons";
import type { GameCtx } from "./ctx";
import { EndPanel, GameHead, LessonBox, StartPanel, StatChip } from "./shared";

export default function BossFightGame({ ctx }: { ctx: GameCtx }) {
  const { lang, t } = ctx;
  const [phase, setPhase] = useState<"idle" | "fighting" | "feedback" | "won" | "lost">("idle");
  const [wave, setWave] = useState(0);
  const [hp, setHp] = useState(BOSS_MAX_HP);
  const [hearts, setHearts] = useState(BOSS_PLAYER_HEARTS);
  const [lastRight, setLastRight] = useState<boolean | null>(null);

  const w = BOSS_WAVES[Math.min(wave, BOSS_WAVES.length - 1)];
  const damageDealt = BOSS_MAX_HP - hp;

  const start = () => {
    setWave(0); setHp(BOSS_MAX_HP); setHearts(BOSS_PLAYER_HEARTS);
    setLastRight(null); setPhase("fighting");
  };

  const pickShield = (si: number) => {
    if (phase !== "fighting") return;
    const right = si === w.correct;
    setLastRight(right);
    if (right) setHp(v => Math.max(0, v - BOSS_HIT_DAMAGE));
    else setHearts(v => v - 1);
    setPhase("feedback");
  };

  const next = () => {
    if (hp <= 0) {
      ctx.finishRun("boss", 100 + hearts * 20, true);
      setPhase("won");
      return;
    }
    if (hearts <= 0 || wave + 1 >= BOSS_WAVES.length) {
      ctx.finishRun("boss", damageDealt, false);
      setPhase("lost");
      return;
    }
    setWave(wave + 1);
    setLastRight(null);
    setPhase("fighting");
  };

  return (
    <div data-testid="game-boss">
      <GameHead ctx={ctx} id="boss" icon={<SkullIcon size={42} />} />
      {phase === "idle" ? (
        <StartPanel ctx={ctx} game="boss" onStart={start}>
          <div className="mx-auto flex max-w-2xl flex-col items-center">
            <span className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-[5px] border-white/60 bg-gradient-to-b from-[#7c3aed] to-[#5b21b6] text-white shadow-[0_8px_0_#5b21b6]">
              <SkullIcon size={64} />
            </span>
            <p className="mt-5 text-[21px] font-semibold leading-relaxed text-[#5b5872]">
              {pick(lang,
                "The Scam Syndicate boss throws 6 attack waves: phishing links, scam calls, greedy permissions, fake friends, deepfakes and prize traps. Pick the right shield each time. 5 hits bring him down, but you only have 3 hearts.",
                "Scam Syndicate Boss က တိုက်ခိုက်လှိုင်း ၆ ခု ပစ်မယ်: phishing လင့်ခ်၊ လိမ်ဖုန်း၊ လောဘ permission၊ သူငယ်ချင်း အတု၊ deepfake နဲ့ ဆု ထောင်ချောက်။ တစ်ခါချင်း မှန်တဲ့ ဒိုင်းကို ရွေးပါ။ ၅ ချက် ထိရင် သူ လဲကျမယ်၊ ဒါပေမယ့် အသက်က ၃ ခုပဲ ရှိတယ်။")}
            </p>
          </div>
        </StartPanel>
      ) : phase === "won" || phase === "lost" ? (
        <EndPanel ctx={ctx} game="boss" cleared={phase === "won"}
          score={phase === "won" ? 100 + hearts * 20 : damageDealt} onAgain={start}>
          <p className="mx-auto mt-3 max-w-3xl text-[20px] font-semibold leading-relaxed text-[#5b5872]">
            {phase === "won"
              ? pick(lang, "The Syndicate boss is down. Every trick he threw was one you had already beaten in the Arena. That is why the journey matters.",
                  "Syndicate Boss လဲကျသွားပြီ။ သူ ပစ်တဲ့ လှည့်ကွက်တိုင်းက Arena မှာ သင် အနိုင်ယူပြီးသားတွေပဲ။ ခရီးလမ်းကြောင်းက အဲ့ဒါကြောင့် အရေးကြီးတာ။")
              : pick(lang, "The boss escapes this time. Replay the earlier games to sharpen the exact shield that cracked, then come back.",
                  "Boss ဒီတစ်ခါ လွတ်သွားတယ်။ အက်သွားတဲ့ ဒိုင်းကို ဂိမ်း အဟောင်းတွေမှာ ပြန် လေ့ကျင့်ပြီး ပြန်လာပါ။")}
          </p>
        </EndPanel>
      ) : (
        <>
          {/* Boss status */}
          <div className="pv-card mb-6 overflow-hidden bg-white">
            <div className="flex flex-wrap items-center gap-6 bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] px-8 py-6 text-white">
              <span className={`flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-full border-4 border-white/40 bg-[#2b2140] ${phase === "feedback" && lastRight ? "pv-shake" : ""}`}>
                <SkullIcon size={54} />
              </span>
              <div className="min-w-[300px] flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="text-[28px] font-black">SCAM SYNDICATE BOSS</span>
                  <span className="text-[19px] font-black">{t("bossHpWord")}: {hp} / {BOSS_MAX_HP}</span>
                </div>
                <div className="pv-timer mt-3" style={{ height: 26 }}>
                  <div style={{ width: (hp / BOSS_MAX_HP) * 100 + "%", height: "100%", background: "linear-gradient(180deg,#ff7a59,#ff4b4b)", transition: "width .4s ease" }} />
                </div>
                <div className="mt-3 flex items-center gap-2 text-[21px]">
                  <span className="font-black">{t("heartsWord")}:</span>
                  <span data-testid="boss-hearts">{Array.from({ length: BOSS_PLAYER_HEARTS }, (_, i) => (i < hearts ? "❤️" : "🖤")).join(" ")}</span>
                  <span className="ml-3 font-bold text-white/80">{pick(lang, "Wave", "လှိုင်း")} {Math.min(wave + 1, BOSS_WAVES.length)} / {BOSS_WAVES.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-3">
            <StatChip label={pick(lang, "Attack", "တိုက်ခိုက်မှု")} value={pick(lang, w.kindEn, w.kindMy)} bg="#7c3aed" />
          </div>

          <div key={wave} className="pv-card pv-rise bg-white px-9 py-8">
            <p data-testid="boss-attack" className="text-[26px] font-bold leading-[1.6] text-[#2b2140]">
              {pick(lang, w.attackEn, w.attackMy)}
            </p>
            <div className="mt-3 text-[18px] font-black tracking-widest text-[#8a87a0]">{t("pickShield").toUpperCase()}</div>
            <div className="mt-4 flex flex-col gap-4">
              {w.shields.map((s, si) => {
                let cls = "border-[#eceaf6] bg-[#faf9ff]";
                if (phase === "feedback") {
                  if (si === w.correct) cls = "border-[#58cc02] bg-[#eefbe4]";
                  else if (lastRight === false) cls = "border-[#e3def5] bg-[#faf9ff] opacity-70";
                }
                return (
                  <button key={si} data-testid={`boss-shield-${si}`} disabled={phase === "feedback"}
                    onClick={() => pickShield(si)}
                    className={`rounded-[20px] border-[3px] px-6 py-5 text-left text-[22px] font-extrabold shadow-[0_5px_0_rgba(23,15,66,0.12)] transition-all enabled:hover:border-[#7c3aed] enabled:active:translate-y-1 ${cls}`}>
                    🛡️ {pick(lang, s.en, s.my)}
                  </button>
                );
              })}
            </div>
            {phase === "feedback" ? (
              <div className="mt-6 flex flex-col gap-5">
                <LessonBox title={lastRight ? pick(lang, "Shield holds!", "ဒိုင်း ခံတယ်!") : pick(lang, "Shield cracked", "ဒိုင်း အက်သွားတယ်")}>
                  {lastRight ? pick(lang, w.hitEn, w.hitMy) : pick(lang, w.hurtEn, w.hurtMy)}
                </LessonBox>
                <button data-testid="boss-next" onClick={next}
                  className="pv-btn self-end px-8 py-3.5 text-[21px]" style={{ background: "#7c3aed", ["--pv-shade" as string]: "#5b21b6" }}>
                  {hp <= 0 ? pick(lang, "Finish him", "အဆုံးသတ်မယ်") : t("next")} →
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
