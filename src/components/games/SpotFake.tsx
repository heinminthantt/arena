"use client";

import { useState } from "react";
import { SPOT_PAIRS, pick } from "@/lib/games-content";
import { EyeIcon } from "@/components/icons";
import type { GameCtx } from "./ctx";
import { EndPanel, GameHead, LessonBox, StartPanel, StatChip } from "./shared";

/* Identical fields shown on both sides of each pair: tapping one earns a
   shake and a hint, not a find. */
const SAME_FIELDS: { labelEn: string; labelMy: string; valueEn: string; valueMy: string }[][] = [
  [
    { labelEn: "Rating", labelMy: "Rating", valueEn: "4.4 stars", valueMy: "ကြယ် ၄.၄" },
    { labelEn: "Category", labelMy: "အမျိုးအစား", valueEn: "Finance", valueMy: "Finance" },
  ],
  [
    { labelEn: "Posts", labelMy: "Posts", valueEn: "1,240 posts", valueMy: "Post ၁,၂၄၀ ခု" },
    { labelEn: "Bio", labelMy: "Bio", valueEn: "Singer · Yangon", valueMy: "အဆိုတော် · ရန်ကုန်" },
  ],
  [
    { labelEn: "Followers", labelMy: "Followers", valueEn: "52K followers", valueMy: "Follower ၅၂K" },
    { labelEn: "Cover photo", labelMy: "Cover ဓာတ်ပုံ", valueEn: "Photo of the shop front", valueMy: "ဆိုင် ရှေ့ပုံ" },
  ],
  [
    { labelEn: "Rating", labelMy: "Rating", valueEn: "4.2 stars", valueMy: "ကြယ် ၄.၂" },
    { labelEn: "Updated", labelMy: "Update", valueEn: "Updated last month", valueMy: "ပြီးခဲ့တဲ့လက update လုပ်ထား" },
  ],
];

export default function SpotFakeGame({ ctx }: { ctx: GameCtx }) {
  const { lang, t } = ctx;
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [pairIdx, setPairIdx] = useState(0);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [totalFound, setTotalFound] = useState(0);
  const [sameTap, setSameTap] = useState(false);

  const pair = SPOT_PAIRS[pairIdx];
  const same = SAME_FIELDS[pairIdx];
  const score = totalFound * 10;

  const start = () => { setPairIdx(0); setFound(new Set()); setTotalFound(0); setPhase("playing"); };

  const tapFake = (f: number) => {
    if (found.has(f)) return;
    const next = new Set(found); next.add(f);
    setFound(next); setTotalFound(v => v + 1); setSameTap(false);
  };

  const nextPair = () => {
    if (pairIdx + 1 >= SPOT_PAIRS.length) {
      ctx.finishRun("spot", score, true);
      setPhase("done");
    } else {
      setPairIdx(pairIdx + 1); setFound(new Set()); setSameTap(false);
    }
  };

  const renderPanel = (side: "left" | "right") => {
    const isFake = pair.fakeSide === side;
    return (
      <div className={`rounded-[24px] border-[3px] px-6 py-6 ${isFake && found.size >= 3 ? "border-[#ff4b4b] bg-[#fff5f5]" : "border-[#eceaf6] bg-[#faf9ff]"}`}>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[19px] font-black tracking-widest text-[#8a87a0]">
            {side === "left" ? pick(lang, "PAGE A", "စာမျက်နှာ A") : pick(lang, "PAGE B", "စာမျက်နှာ B")}
          </span>
          {isFake && found.size >= 3 ? (
            <span className="rounded-full bg-[#ff4b4b] px-3.5 py-1 text-[14px] font-black text-white">
              {pick(lang, "THIS ONE IS FAKE", "ဒီတစ်ခုက အတု")}
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-3.5">
          {pair.fields.map((f, fi) => {
            const value = isFake ? f.fake : f.real;
            const isFound = found.has(fi);
            if (isFake) {
              return (
                <button key={fi} data-testid={`spot-fake-${fi}`} onClick={() => tapFake(fi)}
                  className={`rounded-[16px] border-[3px] px-4 py-3 text-left transition-all ${isFound ? "border-[#ff4b4b] bg-[#ffecec]" : "border-[#e3def5] bg-white hover:border-[#a560e8]"}`}>
                  <span className="block text-[14px] font-black tracking-wide text-[#8a87a0]">{pick(lang, f.labelEn, f.labelMy)}</span>
                  <span className="block text-[20px] font-extrabold leading-snug">{value} {isFound ? "🎯" : ""}</span>
                </button>
              );
            }
            return (
              <div key={fi} className="rounded-[16px] border-[3px] border-[#e3def5] bg-white px-4 py-3">
                <span className="block text-[14px] font-black tracking-wide text-[#8a87a0]">{pick(lang, f.labelEn, f.labelMy)}</span>
                <span className="block text-[20px] font-extrabold leading-snug">{value}</span>
              </div>
            );
          })}
          {same.map((s, si) => (
            <button key={"s" + si} data-testid={`spot-same-${side}-${si}`}
              onClick={() => setSameTap(true)}
              className={`rounded-[16px] border-[3px] border-[#e3def5] bg-white px-4 py-3 text-left ${sameTap ? "" : ""}`}>
              <span className="block text-[14px] font-black tracking-wide text-[#8a87a0]">{pick(lang, s.labelEn, s.labelMy)}</span>
              <span className="block text-[20px] font-extrabold leading-snug">{pick(lang, s.valueEn, s.valueMy)}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div data-testid="game-spot">
      <GameHead ctx={ctx} id="spot" icon={<EyeIcon size={42} />} />
      {phase === "idle" ? (
        <StartPanel ctx={ctx} game="spot" onStart={start}>
          <p className="mx-auto max-w-2xl text-[21px] font-semibold leading-relaxed text-[#5b5872]">
            {pick(lang,
              "4 pairs of pages. One side of each pair is fake, and it differs in exactly 3 places. Tap the fake values to catch them.",
              "စာမျက်နှာ အတွဲ ၄ တွဲ။ တစ်တွဲမှာ တစ်ဘက်က အတု၊ ကွဲပြားချက် အတိအကျ ၃ ခု ရှိတယ်။ အတု တန်ဖိုးတွေကို နှိပ်ပြီး ဖမ်းပါ။")}
          </p>
        </StartPanel>
      ) : phase === "done" ? (
        <EndPanel ctx={ctx} game="spot" cleared score={score} onAgain={start}>
          <p className="mt-3 text-[20px] font-semibold text-[#5b5872]">
            {pick(lang, "Every fake caught. Developer names, download counts, page age and payment style: those four checks expose most fakes.",
              "အတု အကုန် ဖမ်းမိပြီ။ Developer နာမည်၊ download အရေအတွက်၊ page သက်တမ်းနဲ့ ငွေပေးပုံစံ: ဒီ ၄ ချက် စစ်ရင် အတု တော်တော်များများ ပေါ်တယ်။")}
          </p>
        </EndPanel>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatChip label={t("roundWord")} value={`${pairIdx + 1} / ${SPOT_PAIRS.length}`} bg="#ff7a59" />
            <StatChip label={pick(lang, "Found", "တွေ့ပြီး")} value={`${found.size} / 3`} bg="#a560e8" />
            <StatChip label={t("scoreWord")} value={score} bg="#00b8a9" />
            <span className="text-[19px] font-bold text-white/85">{pick(lang, pair.kindEn, pair.kindMy)}</span>
          </div>
          <div key={pairIdx} className="pv-card pv-rise bg-white px-8 py-7">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {renderPanel("left")}
              {renderPanel("right")}
            </div>
            {sameTap && found.size < 3 ? (
              <p className="mt-4 text-[18px] font-bold text-[#8a6d00]" data-testid="spot-same-note">
                {pick(lang, "That field is identical on both pages. The fake differs somewhere else.",
                  "အဲ့ဒီ အချက်က စာမျက်နှာ နှစ်ခုလုံးမှာ တူတယ်။ အတုက တခြားနေရာမှာ ကွဲတယ်။")}
              </p>
            ) : null}
            {found.size >= 3 ? (
              <div className="mt-6 flex flex-col gap-5">
                <LessonBox title={pick(lang, "The 3 tells", "လက္ခဏာ ၃ ခု")}>
                  <ul className="ml-5 list-disc">
                    {pair.fields.map((f, fi) => (
                      <li key={fi}><b>{pick(lang, f.labelEn, f.labelMy)}:</b> {pick(lang, f.tellEn, f.tellMy)}</li>
                    ))}
                  </ul>
                </LessonBox>
                <button data-testid="spot-next" onClick={nextPair}
                  className="pv-btn self-end px-8 py-3.5 text-[21px]" style={{ background: "#ff7a59", ["--pv-shade" as string]: "#e85d3d" }}>
                  {pairIdx + 1 >= SPOT_PAIRS.length ? pick(lang, "Finish", "အဆုံးသတ်မယ်") : t("next")} →
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
