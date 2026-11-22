"use client";

import { FRIEND_SCRIPT, pick } from "@/lib/stories-content";
import { UsersIcon } from "@/components/icons";
import type { GameCtx } from "./ctx";
import { GameHead } from "./shared";
import StoryGame, { type StoryNode } from "./StoryGame";

export default function FriendFraudGame({ ctx }: { ctx: GameCtx }) {
  const { lang } = ctx;
  const nodes: Record<string, StoryNode> = {};
  for (const [id, n] of Object.entries(FRIEND_SCRIPT.nodes)) {
    nodes[id] = {
      lineEn: n.fromFriendEn ?? "", lineMy: n.fromFriendMy ?? "",
      choices: n.choices, endKind: n.endKind, endEn: n.endEn, endMy: n.endMy,
    };
  }
  return (
    <div data-testid="game-friend">
      <GameHead ctx={ctx} id="friend" icon={<UsersIcon size={42} />} />
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-gradient-to-b from-[#f06292] to-[#d64a7c] text-[24px] text-white shadow-[0_4px_0_#d64a7c]">M</span>
        <div>
          <div className="text-[21px] font-black text-white" style={{ textShadow: "0 2px 0 rgba(23,15,66,0.25)" }}>
            {pick(lang, FRIEND_SCRIPT.friendEn, FRIEND_SCRIPT.friendMy)}
          </div>
          <div className="text-[15px] font-bold text-white/75">{pick(lang, "Chat started just now", "Chat အခု စတယ်")}</div>
        </div>
      </div>
      <StoryGame
        ctx={ctx} game="friend" nodes={nodes} start={FRIEND_SCRIPT.start}
        themLabel={pick(lang, "FRIEND?", "သူငယ်ချင်းလား?")}
        accent="#f06292" shade="#d64a7c" icon="💬"
      />
    </div>
  );
}
