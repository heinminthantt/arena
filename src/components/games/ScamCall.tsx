"use client";

import { useState } from "react";
import { CALL_SCRIPTS, pick } from "@/lib/stories-content";
import { PhoneIcon } from "@/components/icons";
import type { GameCtx } from "./ctx";
import { GameHead } from "./shared";
import StoryGame, { type StoryNode } from "./StoryGame";

export default function ScamCallGame({ ctx }: { ctx: GameCtx }) {
  const { lang } = ctx;
  const [scriptIdx, setScriptIdx] = useState(0);
  const script = CALL_SCRIPTS[scriptIdx];

  const nodes: Record<string, StoryNode> = {};
  for (const [id, n] of Object.entries(script.nodes)) {
    nodes[id] = {
      lineEn: n.lineEn, lineMy: n.lineMy,
      choices: n.choices, endKind: n.endKind, endEn: n.endEn, endMy: n.endMy,
    };
  }

  return (
    <div data-testid="game-call">
      <GameHead ctx={ctx} id="call" icon={<PhoneIcon size={42} />} />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="text-[18px] font-black tracking-widest text-white/85">
          {pick(lang, "INCOMING CALLS", "ဝင်လာတဲ့ ဖုန်းခေါ်မှုတွေ")}
        </span>
        {CALL_SCRIPTS.map((s, i) => (
          <button key={s.id} data-testid={`call-script-${i}`} onClick={() => setScriptIdx(i)}
            className="pv-btn px-5 py-2.5 text-[17px]"
            style={{ background: i === scriptIdx ? "#ff4b4b" : "#b9b4d6", ["--pv-shade" as string]: i === scriptIdx ? "#d33131" : "#9a95bd" }}>
            📞 {pick(lang, s.titleEn, s.titleMy)}
          </button>
        ))}
        <span className="text-[17px] font-bold text-white/75">
          {pick(lang, "From", "ဆက်သွယ်သူ")}: {pick(lang, script.fromEn, script.fromMy)}
        </span>
      </div>
      <StoryGame
        key={script.id}
        ctx={ctx} game="call" nodes={nodes} start={script.start}
        themLabel={pick(lang, "CALLER", "ဖုန်းဆက်သူ")}
        accent="#ff4b4b" shade="#d33131" icon="📞" loseNodeId="endLose"
      />
    </div>
  );
}
