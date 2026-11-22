"use client";

import { useState } from "react";
import { pick } from "@/lib/games-content";
import type { GameCtx } from "./ctx";
import { EndPanel, LessonBox } from "./shared";

/* Normalized branching-story player shared by Scam Call Live and
   Friend or Fraud. A money meter starts at 100; choices move it.
   Endings arrive as nodes with endKind. */

export interface StoryChoice {
  en: string; my: string; money: number;
  noteEn: string; noteMy: string; next: string;
}
export interface StoryNode {
  lineEn: string; lineMy: string;
  choices?: StoryChoice[];
  endKind?: "win" | "lose" | "safe";
  endEn?: string; endMy?: string;
}

interface Entry { who: "them" | "me" | "note"; text: string; }

export default function StoryGame({ ctx, game, nodes, start, themLabel, accent, shade, icon, loseNodeId }: {
  ctx: GameCtx;
  game: "call" | "friend";
  nodes: Record<string, StoryNode>;
  start: string;
  themLabel: string;
  accent: string; shade: string; icon: string;
  loseNodeId?: string;
}) {
  const { lang } = ctx;
  const [nodeId, setNodeId] = useState(start);
  const [money, setMoney] = useState(100);
  const [history, setHistory] = useState<Entry[]>([]);
  const [done, setDone] = useState(false);

  const node = nodes[nodeId];
  const isEnd = !!node?.endKind;

  const choose = (ch: StoryChoice) => {
    const newMoney = Math.max(0, Math.min(100, money + ch.money));
    setHistory(h => [
      ...h,
      { who: "them", text: pick(lang, node.lineEn, node.lineMy) },
      { who: "me", text: pick(lang, ch.en, ch.my) },
      { who: "note", text: pick(lang, ch.noteEn, ch.noteMy) },
    ]);
    setMoney(newMoney);
    let nextId = ch.next;
    if (newMoney <= 0 && loseNodeId && nodes[loseNodeId]) nextId = loseNodeId;
    const nextNode = nodes[nextId];
    setNodeId(nextId);
    if (nextNode?.endKind && !done) {
      setDone(true);
      const cleared = nextNode.endKind === "win" || nextNode.endKind === "safe";
      ctx.finishRun(game, newMoney, cleared);
    }
  };

  const restart = () => { setNodeId(start); setMoney(100); setHistory([]); setDone(false); };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="rounded-full px-5 py-2.5 text-[19px] font-black text-white shadow-[0_4px_0_rgba(23,15,66,0.25)]"
          style={{ background: money > 50 ? "#58cc02" : money > 25 ? "#ff9600" : "#ff4b4b" }}>
          💰 {pick(lang, "Money meter", "ငွေ မီတာ")}: {money}%
        </span>
        <div className="pv-timer min-w-[220px] flex-1">
          <div className="pv-timer-fill" style={{ width: money + "%", background: money > 50 ? "linear-gradient(180deg,#7ee82e,#58cc02)" : money > 25 ? "linear-gradient(180deg,#ffb020,#ff9600)" : "linear-gradient(180deg,#ff7a59,#ff4b4b)" }} />
        </div>
      </div>

      <div className="pv-card bg-white px-8 py-7">
        <div className="flex flex-col gap-4">
          {history.map((e, i) => (
            e.who === "note" ? (
              <LessonBox key={i} title={pick(lang, "What just happened", "ဘာ ဖြစ်သွားတာလဲ")}>{e.text}</LessonBox>
            ) : (
              <div key={i} className={`flex ${e.who === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`pv-bubble ${e.who === "me" ? "pv-bubble-student" : "pv-bubble-bot"}`}>
                  {e.who === "them" ? <span className="mb-1 block text-[13px] font-black tracking-widest opacity-60">{themLabel}</span> : null}
                  {e.text}
                </div>
              </div>
            )
          ))}

          {!isEnd && node ? (
            <div className="pv-rise flex flex-col gap-4" key={nodeId}>
              <div className="flex justify-start">
                <div className="pv-bubble pv-bubble-bot" data-testid="story-line">
                  <span className="mb-1 block text-[13px] font-black tracking-widest opacity-60">{themLabel}</span>
                  {pick(lang, node.lineEn, node.lineMy)}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {node.choices?.map((ch, ci) => (
                  <button key={ci} data-testid={`choice-${ci}`} onClick={() => choose(ch)}
                    className="rounded-[20px] border-[3px] border-[#eceaf6] bg-[#faf9ff] px-6 py-4 text-left text-[21px] font-extrabold shadow-[0_5px_0_rgba(23,15,66,0.12)] transition-all hover:border-[#1cb0f6] active:translate-y-1 active:shadow-none">
                    {pick(lang, ch.en, ch.my)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {isEnd && node ? (
        <div className="mt-6">
          <EndPanel ctx={ctx} game={game} cleared={node.endKind === "win" || node.endKind === "safe"} score={money} onAgain={restart}>
            <p className="mx-auto mt-3 max-w-3xl text-[20px] font-semibold leading-relaxed text-[#5b5872]">
              {icon} {pick(lang, node.endEn ?? "", node.endMy ?? "")}
            </p>
          </EndPanel>
        </div>
      ) : null}
    </div>
  );
}
