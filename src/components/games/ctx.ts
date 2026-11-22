import type { ArenaState, GameId, Lang } from "@/lib/content";

/* Everything a game component needs from ArenaApp, passed as one object.
   Games never touch localStorage or setState directly: all durable
   effects (XP, records, badges, clears) flow through these helpers. */
export interface GameCtx {
  lang: Lang;
  t: (k: string) => string;
  S: ArenaState;
  mut: (fn: (d: ArenaState) => void) => void;
  log: (d: ArenaState, page: string, action: string, detail: string) => void;
  /* Record a finished run: plays +1, best score kept, and on a first
     clear the XP award, record line and badge sync all happen inside. */
  finishRun: (game: GameId, score: number, cleared: boolean) => void;
  go: (page: string) => void;
}
