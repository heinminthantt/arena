"use client";

/* CyberShield Arena: Next.js app.
   Same state shape, same localStorage key ("cybershield-arena-demo-v1"),
   same Api.call() hybrid flow (live answers when the /api/ai route has a
   key in env vars, local backup content otherwise).
   Design: Bright Mobile Game system (see src/app/bright.css): chunky
   radii, hard offset shadows, vivid palette, game buttons.
   Burmese renders in MiSans Myanmar via the font stack in globals.css. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  Api, BADGES, CARDS, PAGES, QUIZ, SECTION_COLORS, STORAGE_KEY, T,
  VAULT_LESSONS, VAULT_TRICKS, XP,
  freshState, migrateState, pwFlags, pwScore, rankFor, syncBadges,
  xpFlat, xpForCorrect, xpForWrong,
  type ArenaState, type GameId, type Lang, type VaultTrick,
} from "@/lib/content";
import { FeedbackPanel, Objective, PlayerHud } from "@/components/GamePrimitives";
import {
  BoltIcon, BookIcon, ChatIcon, CheckIcon, CloseIcon, EyeIcon, HomeIcon,
  ImageIcon, KeyIcon, LinkIcon, LockIcon, MenuIcon, PhoneIcon, RobotIcon, ShieldIcon,
  SkullIcon, StarIcon, TrophyIcon, UsersIcon,
} from "@/components/icons";
import { LessonBox } from "@/components/games/shared";
import type { GameCtx } from "@/components/games/ctx";
import RushGame from "@/components/games/Rush";
import LinkDetectiveGame from "@/components/games/LinkDetective";
import PrivacyGame from "@/components/games/Privacy";
import PermissionPanicGame from "@/components/games/PermissionPanic";
import SpotFakeGame from "@/components/games/SpotFake";
import DeepfakeGame from "@/components/games/Deepfake";
import ScamCallGame from "@/components/games/ScamCall";
import FriendFraudGame from "@/components/games/FriendFraud";
import BossFightGame from "@/components/games/BossFight";

const METER_COLORS = ["#e53935", "#ed9948", "#f5b301", "#82b26b", "#3f6d30"];
const BADGE_COLORS = ["#58cc02", "#1cb0f6", "#ff9600", "#a560e8", "#ff4b4b", "#ffc800", "#00b8a9", "#f06292"];

const GAME_XP: Record<GameId, number> = {
  rush: XP.rushClear, link: XP.linkClear, privacy: XP.privacyClear,
  call: XP.callClear, permission: XP.permissionClear, spot: XP.spotClear,
  deepfake: XP.deepfakeClear, friend: XP.friendClear, boss: XP.bossWin,
};
const NEW_GAME_IDS = new Set<string>(["rush", "link", "privacy", "call", "permission", "spot", "deepfake", "friend", "boss"]);

const PAGE_ICONS: Record<string, (p: { size?: number }) => ReactNode> = {
  home: HomeIcon, scam: ShieldIcon, rush: BoltIcon, vault: RobotIcon,
  link: LinkIcon, roast: KeyIcon, privacy: LockIcon, permission: CheckIcon,
  spot: EyeIcon, deepfake: ImageIcon, ask: ChatIcon, call: PhoneIcon,
  friend: UsersIcon, quiz: TrophyIcon, boss: SkullIcon, records: BookIcon,
};
const pageIcon = (id: string, size = 26) => {
  const I = PAGE_ICONS[id];
  return I ? <I size={size} /> : <StarIcon size={size} />;
};

/* Journey trail: the scored games only, a snake ending at the Boss Fight.
   Standalone tools (Password Roast, Q&A) stay in the sidebar and home cards. */
const JOURNEY: { id: string; x: number; y: number }[] = [
  { id: "start", x: 6, y: 25 },
  { id: "scam", x: 20.6, y: 25 }, { id: "rush", x: 35.2, y: 25 }, { id: "vault", x: 49.8, y: 25 },
  { id: "link", x: 64.3, y: 25 }, { id: "privacy", x: 78.9, y: 25 },
  { id: "permission", x: 93.5, y: 25 },
  { id: "spot", x: 93.5, y: 75 }, { id: "deepfake", x: 77.6, y: 75 },
  { id: "call", x: 61.7, y: 75 }, { id: "friend", x: 45.8, y: 75 }, { id: "quiz", x: 29.9, y: 75 },
  { id: "boss", x: 14, y: 75 },
];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function ArenaApp() {
  const [S, setS] = useState<ArenaState | null>(null);
  const loaded = useRef(false);

  /* transient UI state (never stored) */
  const [scamBusy, setScamBusy] = useState(false);
  const [askBusy, setAskBusy] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [vaultBusy, setVaultBusy] = useState(false);
  const [vaultInput, setVaultInput] = useState("");
  const [vaultLive, setVaultLive] = useState<string | null>(null);
  const [pwInput, setPwInput] = useState("");
  const [askInput, setAskInput] = useState("");
  const [roastOut, setRoastOut] = useState<{ roast: string; tip: string; score: number; explanation?: string } | null>(null);
  const [liveNote, setLiveNote] = useState<string | null>(null);

  /* game layer: level-up celebration (transient; the rank itself lives in state) */
  const [celeb, setCeleb] = useState<number | null>(null);
  const prevRank = useRef<number | null>(null);

  /* load once from localStorage, folded through migrateState so older
     saves gain the new fields (XP, games) without losing records */
  useEffect(() => {
    let initial = freshState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) initial = migrateState(JSON.parse(raw));
    } catch { /* keep fresh state */ }
    loaded.current = true;
    setS(initial); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  /* save on every change */
  useEffect(() => {
    if (S && loaded.current) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch { /* storage full/blocked */ }
    }
  }, [S]);

  /* level-up watcher: the first sighting after load just sets the baseline */
  useEffect(() => {
    if (!S) return;
    const idx = rankFor(S.game.xp).index;
    if (prevRank.current === null) { prevRank.current = idx; return; }
    if (idx > prevRank.current) setCeleb(idx);
    prevRank.current = idx;
  }, [S]);

  /* mobile drawer: Escape closes it and the page behind does not scroll */
  useEffect(() => {
    if (!mobileNav) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileNav(false); };
    document.addEventListener("keydown", onKey);
    const desktop = window.matchMedia("(min-width: 1101px)");
    const onResize = () => { if (desktop.matches) setMobileNav(false); };
    desktop.addEventListener("change", onResize);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      document.body.style.overflow = prev;
    };
  }, [mobileNav]);

  if (!S) {
    return (
      <div className="pv-root flex items-center justify-center">
        <p className="text-2xl font-black text-white">CyberShield Arena…</p>
      </div>
    );
  }

  const lang: Lang = S.lang;
  const t = (k: string) => T[lang][k] || k;

  /* mutate a deep-cloned draft, mirroring the demo's direct mutations */
  const mut = (fn: (d: ArenaState) => void) =>
    setS(prev => {
      if (!prev) return prev;
      const next: ArenaState = JSON.parse(JSON.stringify(prev));
      fn(next);
      return next;
    });

  const log = (d: ArenaState, page: string, action: string, detail: string) => {
    d.records.unshift({ time: now(), page, action, detail: String(detail || "").slice(0, 220) });
    if (d.records.length > 400) d.records.length = 400;
  };

  const bumpUsage = (u: { input: number; output: number }) =>
    mut(d => { d.usage.calls += 1; d.usage.tokens += u.input + u.output; });

  /* game layer helpers, used inside the same mut() drafts as the score
     events so XP, streak and badges land in the same save as the score */
  const logXp = (d: ArenaState, gained: number, what: string) => {
    if (gained > 0) log(d, "game", "xp +" + gained, what);
  };
  const logBadges = (d: ArenaState) => {
    for (const id of syncBadges(d)) {
      const b = BADGES.find(x => x.id === id);
      log(d, "game", "badge earned", b ? b.en : id);
    }
  };

  /* New-game completion, called by every game component through ctx.
     Plays and best score always update; XP lands only on the first clear.
     Each finished run is one round: the winner takes a Students vs AI point. */
  const finishRun = (game: GameId, score: number, cleared: boolean) => {
    mut(d => {
      const g = d.games[game];
      g.plays += 1;
      if (score > g.best) g.best = score;
      const firstClear = cleared && !g.cleared;
      if (cleared) g.cleared = true;
      if (cleared) d.scores.students += 1;
      else d.scores.ai += 1;
      const name = (T.en as Record<string, string>)[game] || game;
      log(d, game, cleared ? "cleared" : "played",
        name + " · score " + score + (cleared ? " · Students +1" : " · AI +1"));
      if (firstClear) logXp(d, xpFlat(d, GAME_XP[game]), name + " cleared");
      logBadges(d);
    });
  };

  const ctx: GameCtx = { lang, t, S, mut, log, finishRun, bumpUsage, go: (p: string) => go(p) };

  const go = (page: string) => {
    mut(d => { d.page = page; });
    window.scrollTo(0, 0);
  };

  const navTo = (page: string) => {
    mut(d => { log(d, d.page, "navigate", "to " + page); d.page = page; });
    window.scrollTo(0, 0);
  };

  const adj = (who: "students" | "ai", delta: number) =>
    mut(d => {
      d.scores[who] = Math.max(0, d.scores[who] + delta);
      log(d, "home", "score adjust", who + " " + (delta > 0 ? "+1" : "-1"));
    });

  const setLang = (l: Lang) =>
    mut(d => { d.lang = l; log(d, d.page, "language", l === "en" ? "EN" : "MY"); });

  const resetAll = () => {
    if (window.confirm("Reset all scores, progress and records?")) {
      setS(freshState());
      window.scrollTo(0, 0);
    }
  };

  /* ---------- shared bits ---------- */
  const pageRecords = (page: string) => {
    const rows = S.records.filter(r => r.page === page).slice(0, 8);
    if (!rows.length) return null;
    return (
      <div className="pv-card mt-6 bg-white p-4 sm:p-7">
        <h3 className="mb-4 text-2xl font-black">📒 {t("playAgain")}</h3>
        <div className="flex flex-col gap-3">
          {rows.map((r, i) => (
            <div key={i} className="rounded-[18px] bg-[#f6f4fc] px-5 py-4 text-[20px] leading-relaxed">
              <span className="font-extrabold">{r.action}</span> · {r.detail}
              <div className="mt-1 text-base font-semibold text-[#8a87a0]">{r.time}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PageHead = ({ id, icon }: { id: string; icon: ReactNode }) => {
    const c = SECTION_COLORS[id] ?? SECTION_COLORS.home;
    return (
      <div className="mb-4 flex flex-wrap items-center gap-3 sm:mb-6 sm:gap-5">
        <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] text-white sm:h-[76px] sm:w-[76px] sm:rounded-[24px]"
          style={{ background: `linear-gradient(180deg, ${c.color}, ${c.shade})`, boxShadow: `0 5px 0 ${c.shade}` }}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-[27px] font-black leading-tight text-white sm:text-[42px]" style={{ textShadow: "0 3px 0 rgba(23,15,66,0.25)" }}>{t(id)}</h2>
          <p className="max-w-4xl text-[16px] font-semibold leading-relaxed text-white/85 sm:text-[20px]">{t(id + "Sub")}</p>
        </div>
      </div>
    );
  };

  const dots = (
    count: number, current: number, doneMap: (i: number) => boolean,
    onPick: (i: number) => void, label: string, color: string, shade: string,
  ) => (
    <div className="mb-5 flex flex-wrap gap-2 sm:gap-3" role="navigation" aria-label={label}>
      {Array.from({ length: count }, (_, d) => (
        <button
          key={d}
          onClick={() => onPick(d)}
          aria-label={`${label} ${d + 1}`}
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full text-[18px] font-black text-white transition-transform active:scale-95 sm:h-[72px] sm:w-[72px] sm:text-[22px]"
          style={d === current
            ? { background: color, boxShadow: `0 6px 0 ${shade}, 0 0 0 5px rgba(255,255,255,0.85)` }
            : doneMap(d)
              ? { background: "#58cc02", boxShadow: "0 6px 0 #46a302" }
              : { background: "rgba(255,255,255,0.92)", color: "#3c3a55", boxShadow: "0 6px 0 rgba(23,15,66,0.25)" }}
        >
          {doneMap(d) && d !== current ? "✓" : d + 1}
        </button>
      ))}
    </div>
  );

  /* ---------- pages ---------- */
  const renderHome = () => {
    const done = (id: string) =>
      id === "scam" ? Object.keys(S.scam.revealed).length + " / 6"
      : id === "quiz" ? Object.keys(S.quiz.answers).length + " / 8"
      : id === "vault" ? Object.keys(S.vault.won).length + " / 3"
      : id === "ask" ? "" + S.ask.history.length
      : id === "roast" ? "" + S.roast.history.length
      : NEW_GAME_IDS.has(id) ? (() => {
          const g = S.games[id as GameId];
          return g.cleared ? "✓ " + t("clearedWord") : g.plays > 0 ? g.plays + " plays" : "";
        })()
      : "";
    /* Home card order: the two free tools (Q&A chat, then Password Roast)
       sit directly under the Boss Fight card. The sidebar keeps PAGES order. */
    const homeCards = (() => {
      const rest = PAGES.filter(p => p.id !== "home" && p.id !== "roast" && p.id !== "ask");
      const tools = PAGES.filter(p => p.id === "ask" || p.id === "roast")
        .sort((a, b) => (a.id === "ask" ? -1 : 1) - (b.id === "ask" ? -1 : 1));
      const bi = rest.findIndex(p => p.id === "boss");
      return bi >= 0 ? [...rest.slice(0, bi + 1), ...tools, ...rest.slice(bi + 1)] : [...rest, ...tools];
    })();
    return (
      <>
        <div className="relative overflow-hidden rounded-[28px] bg-white/10 px-2 pb-2 pt-1">
          <div className="flex flex-wrap items-center gap-8">
            <div className="min-w-0 flex-1 basis-[420px]">
              <span className="inline-block rounded-full bg-white/25 px-4 py-2 text-sm font-black tracking-wide text-white shadow-[0_4px_0_rgba(23,15,66,0.2)] backdrop-blur-sm sm:px-5 sm:py-2.5 sm:text-lg">
                UCS MAGWAY · IT &amp; CYBER YOUTH PANEL
              </span>
              <h2 className="mt-4 text-[clamp(44px,8vw,84px)] font-black leading-[1.02] text-white sm:mt-5" style={{ textShadow: "0 5px 0 rgba(23,15,66,0.28)" }}>
                CyberShield<br />Arena
              </h2>
              <p className="mt-4 max-w-[640px] rounded-[22px] bg-white/90 p-4 text-[18px] font-semibold leading-relaxed text-[#2b2140] shadow-[0_6px_0_rgba(23,15,66,0.18)] sm:p-5 sm:text-[22px]">
                {t("homeSub")}
              </p>
            </div>
            <div className="relative h-[300px] w-[330px] max-w-full shrink-0 max-[900px]:hidden">
              <div className="pv-card absolute left-[36px] top-[14px] bg-white p-2">
                <Image src="/assets/asset-shield.webp" alt="Voxel shield" width={230} height={230} className="rounded-[20px] object-contain" priority />
              </div>
              <Image src="/assets/asset-key.webp" alt="" width={92} height={92}
                className="pv-bob absolute right-0 top-0 rounded-[20px] bg-white object-contain p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.15)]" />
              <Image src="/assets/asset-bubble.webp" alt="" width={86} height={86}
                className="pv-bob absolute bottom-0 left-0 rounded-[20px] bg-white object-contain p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.15)]" style={{ animationDelay: ".8s" }} />
              <Image src="/assets/asset-trophy.webp" alt="" width={90} height={90}
                className="pv-bob absolute bottom-0 right-1 rounded-[20px] bg-white object-contain p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.15)]" style={{ animationDelay: "1.6s" }} />
            </div>
          </div>
        </div>

        <div className="my-6 overflow-hidden rounded-full bg-[#2b2140] py-3.5 shadow-[0_6px_0_rgba(23,15,66,0.35)]" aria-hidden="true">
          <div className="animate-marquee flex w-max whitespace-nowrap text-[21px] font-black tracking-wider text-white">
            <span>STOP <span className="text-[#c0e83d]">✦</span> စဉ်းစားပါ <span className="text-[#c0e83d]">✦</span> CHECK <span className="text-[#c0e83d]">✦</span> မမျှဝေပါနဲ့ <span className="text-[#c0e83d]">✦</span> DO NOT SHARE <span className="text-[#c0e83d]">✦</span> REPORT <span className="text-[#c0e83d]">✦</span> သတင်းပို့ပါ <span className="text-[#c0e83d]">✦</span> STAY SAFE <span className="text-[#c0e83d]">✦</span>&nbsp;</span>
            <span>STOP <span className="text-[#c0e83d]">✦</span> စဉ်းစားပါ <span className="text-[#c0e83d]">✦</span> CHECK <span className="text-[#c0e83d]">✦</span> မမျှဝေပါနဲ့ <span className="text-[#c0e83d]">✦</span> DO NOT SHARE <span className="text-[#c0e83d]">✦</span> REPORT <span className="text-[#c0e83d]">✦</span> သတင်းပို့ပါ <span className="text-[#c0e83d]">✦</span> STAY SAFE <span className="text-[#c0e83d]">✦</span>&nbsp;</span>
          </div>
        </div>

        {/* Journey map: the trail through every stop, states mirror real records */}
        {(() => {
          type StopState = "todo" | "doing" | "done";
          const stopState = (id: string): StopState => {
            if (id === "scam") {
              const n = Object.keys(S.scam.revealed).length;
              return n === 0 ? "todo" : n >= CARDS.length ? "done" : "doing";
            }
            if (id === "vault") {
              const w = [0, 1, 2].filter(l => S.vault.won[l]).length;
              return w >= 3 ? "done" : (S.vault.log.length > 0 || w > 0) ? "doing" : "todo";
            }
            if (id === "quiz") {
              const n = Object.keys(S.quiz.answers).length;
              return n === 0 ? "todo" : n >= QUIZ.length ? "done" : "doing";
            }
            if (NEW_GAME_IDS.has(id)) {
              const g = S.games[id as GameId];
              return g.cleared ? "done" : g.plays > 0 ? "doing" : "todo";
            }
            return "todo";
          };
          const stateChip = (st: StopState) =>
            st === "done" ? "bg-[#58cc02] text-white" : st === "doing" ? "bg-[#ffc800] text-[#7a5200]" : "bg-white/85 text-[#5b5872]";
          const stateText = (st: StopState) =>
            st === "done" ? t("stateDone") : st === "doing" ? t("stateDoing") : t("stateTodo");
          return (
            <div className="pv-card mb-6 overflow-hidden bg-white">
              <div className="px-5 pb-1 pt-6 sm:px-8 sm:pt-7">
                <h3 className="text-[27px] font-black sm:text-[36px]">🗺️ {t("journey")}</h3>
                <p className="mt-1 max-w-4xl text-[17px] font-semibold leading-relaxed text-[#5b5872] sm:text-[19px]">{t("journeySub")}</p>
              </div>
              <div className="relative hidden h-[400px] min-[900px]:block">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M 72 100 L 1122 100 C 1178 100 1178 300 1122 300 L 168 300"
                    fill="none" stroke="#b08968" strokeWidth="7" strokeLinecap="round" strokeDasharray="1 18" opacity="0.6"
                  />
                </svg>
                {JOURNEY.map(stop => {
                  const isStart = stop.id === "start";
                  const isBoss = stop.id === "boss";
                  const st: StopState = isStart ? "done" : stopState(stop.id);
                  const c = SECTION_COLORS[stop.id] ?? SECTION_COLORS.home;
                  const size = isBoss ? 112 : 84;
                  return (
                    <button
                      key={stop.id}
                      onClick={() => (isStart ? window.scrollTo(0, 0) : go(stop.id))}
                      className="group absolute flex w-[172px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 active:scale-95"
                      style={{ left: stop.x + "%", top: stop.y + "%" }}
                      aria-label={isStart ? t("stopStart") : t(stop.id)}
                    >
                      {isBoss ? (
                        <span className="rounded-full bg-[#7c3aed] px-3.5 py-1 text-[14px] font-black tracking-widest text-white shadow-[0_4px_0_#5b21b6]" style={{ transform: "rotate(-4deg)" }}>
                          👑 {t("stopBoss")}
                        </span>
                      ) : null}
                      <span
                        className={`pv-node relative ${S.page === stop.id ? "pv-node-current" : ""}`}
                        style={{
                          width: size, height: size, minWidth: 72, minHeight: 72,
                          background: isStart
                            ? "linear-gradient(180deg,#ffc800,#f5b800)"
                            : st === "done"
                              ? `linear-gradient(180deg, ${c.color}, ${c.shade})`
                              : st === "doing"
                                ? "linear-gradient(180deg,#ffd93b,#ffc800)"
                                : "#ffffff",
                          color: st === "todo" && !isStart ? "#8a87a0" : "#ffffff",
                          boxShadow: `0 7px 0 ${st === "todo" && !isStart ? "rgba(23,15,66,0.18)" : c.shade}`,
                        }}
                      >
                        {isStart ? <span className="text-[38px]">🚩</span> : pageIcon(stop.id, isBoss ? 52 : 40)}
                        {st === "done" && !isStart ? (
                          <span className="absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#58cc02] text-[18px] font-black text-white shadow-[0_3px_0_#46a302]">✓</span>
                        ) : null}
                      </span>
                      <span className="rounded-full bg-white/95 px-3.5 py-1 text-center text-[16px] font-extrabold leading-tight text-[#2b2140] shadow-sm">
                        {isStart ? t("stopStart") : t(stop.id)}
                      </span>
                      {!isStart ? (
                        <span className={`rounded-full px-3 py-0.5 text-[13px] font-extrabold ${stateChip(st)}`}>
                          {stateText(st)}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              {/* Phones get the same trail as a vertical list, no overlapping nodes */}
              <div className="flex flex-col gap-2 px-4 pb-5 min-[900px]:hidden">
                {JOURNEY.filter(stop => stop.id !== "start").map(stop => {
                  const st = stopState(stop.id);
                  const c = SECTION_COLORS[stop.id] ?? SECTION_COLORS.home;
                  return (
                    <button key={stop.id} onClick={() => go(stop.id)}
                      className="flex items-center gap-3 rounded-[16px] bg-[#f6f4fc] px-3 py-2.5 text-left active:scale-[.99]">
                      <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full text-white"
                        style={{
                          background: st === "done" ? `linear-gradient(180deg, ${c.color}, ${c.shade})`
                            : st === "doing" ? "linear-gradient(180deg,#ffd93b,#ffc800)" : "#ffffff",
                          color: st === "todo" ? "#8a87a0" : "#ffffff",
                          boxShadow: `0 4px 0 ${st === "todo" ? "rgba(23,15,66,0.15)" : c.shade}`,
                        }}>
                        {pageIcon(stop.id, 22)}
                      </span>
                      <span className="min-w-0 flex-1 text-[17px] font-extrabold leading-tight">{t(stop.id)}</span>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-extrabold ${stateChip(st)}`}>
                        {stateText(st)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
          {homeCards.map(p => {
            const c = SECTION_COLORS[p.id] ?? SECTION_COLORS.home;
            const prog = done(p.id);
            return (
              <button
                key={p.id}
                onClick={() => go(p.id)}
                className="pv-card relative bg-white p-5 text-left transition-transform hover:-translate-y-1 active:scale-[.98] sm:p-7"
              >
                {NEW_GAME_IDS.has(p.id) ? (
                  <span className="absolute right-5 top-5 rounded-full bg-[#ff4b4b] px-3 py-1 text-[13px] font-black tracking-widest text-white shadow-[0_3px_0_#d33131]">NEW</span>
                ) : null}
                {p.id === "boss" ? (
                  <span className="absolute right-5 top-5 rounded-full bg-[#7c3aed] px-3 py-1 text-[13px] font-black tracking-widest text-white shadow-[0_3px_0_#5b21b6]">👑 FINAL</span>
                ) : null}
                <span className="flex h-[76px] w-[76px] items-center justify-center rounded-[22px] text-white"
                  style={{ background: `linear-gradient(180deg, ${c.color}, ${c.shade})`, boxShadow: `0 5px 0 ${c.shade}` }}>
                  {pageIcon(p.id, 40)}
                </span>
                <h3 className="mt-4 text-[27px] font-black leading-tight">{t(p.id)}</h3>
                <p className="mt-1.5 text-[18px] font-medium leading-relaxed text-[#5b5872]">{t(p.id + "Sub")}</p>
                {prog ? (
                  <div className="mt-3 inline-block rounded-full bg-[#eefbe4] px-4 py-1.5 text-[16px] font-extrabold text-[#2c5c05]">
                    {prog}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </>
    );
  };

  const renderScam = () => {
    const i = S.scam.index, c = CARDS[i], rev = S.scam.revealed[i];
    const vote = (v: string) =>
      mut(d => { d.scam.vote = v; d.scam.classVotes[i] = v; log(d, "scam", "class vote", "Card " + (i + 1) + ": " + v); });
    const askAi = async () => {
      setScamBusy(true);
      const r = await Api.call("scam", { cardId: i, lang });
      setLiveNote(r.source === "live" ? "Live mentor explanation" : "Demo backup explanation");
      bumpUsage(r.usage);
      mut(d => {
        const aiRight = (r.verdict === "scam") === c.isScam;
        const classRight = d.scam.vote ? ((d.scam.vote === "scam") === c.isScam) : null;
        const firstReveal = !d.scam.revealed[i];
        if (aiRight) d.scores.ai += 1;
        if (classRight) d.scores.students += 1;
        d.scam.revealed[i] = { verdict: r.verdict!, flags: r.flags!, aiRight, classRight, classVote: d.scam.vote };
        log(d, "scam", "AI reveal", "Card " + (i + 1) + ": " + r.verdict + (aiRight ? " (AI +1)" : "") + (classRight ? " (Students +1)" : ""));
        /* game layer: XP and streak ride on the class call, first reveal
           only, so re-asking the AI on an old card cannot farm points */
        if (firstReveal) {
          if (classRight === true) logXp(d, xpForCorrect(d, XP.scamCorrect), "Scam or Safe card " + (i + 1) + " correct");
          else if (classRight === false) xpForWrong(d);
          logBadges(d);
        }
      });
      setScamBusy(false);
    };
    return (
      <>
        <PageHead id="scam" icon={<ShieldIcon size={42} />} />
        <Objective>{lang === "my" ? "အထောက်အထားကို ရွေးပြီး လုံခြုံတဲ့ လုပ်ဆောင်ချက်ကို ဆုံးဖြတ်ပါ။" : "Inspect the evidence, classify the threat, and choose the safest action."}</Objective>
        {dots(CARDS.length, i, d => !!S.scam.revealed[d],
          d => mut(dd => { dd.scam.index = d; dd.scam.vote = null; }), "Card", "#58cc02", "#46a302")}
        <div className="pv-card bg-white p-5 sm:p-8">
          <div className="whitespace-pre-wrap rounded-[20px] border-[3px] border-dashed border-[#d9d4f5] bg-[#faf9ff] p-5 text-[23px] font-medium leading-[1.7] sm:p-7 sm:text-[31px]">
            {lang === "my" ? c.my : c.en}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="text-[20px] font-bold sm:text-[22px]">{t("classSaid")}:</span>
            <button data-testid="scam-vote-scam" onClick={() => vote("scam")}
              className="pv-btn min-h-[60px] px-6 text-[20px] sm:min-h-[76px] sm:px-9 sm:text-[25px]" style={{ background: "#ff4b4b", ["--pv-shade" as string]: "#d33131" }}>
              {t("scamBtn")}
            </button>
            <button data-testid="scam-vote-safe" onClick={() => vote("safe")}
              className="pv-btn min-h-[60px] px-6 text-[20px] sm:min-h-[76px] sm:px-9 sm:text-[25px]" style={{ background: "#58cc02", ["--pv-shade" as string]: "#46a302" }}>
              {t("safeBtn")}
            </button>
            <button data-testid="scam-ask-ai" onClick={askAi} disabled={scamBusy}
              className="pv-btn min-h-[60px] px-6 text-[20px] disabled:opacity-45 sm:min-h-[76px] sm:px-9 sm:text-[25px]" style={{ background: "#2b2140", ["--pv-shade" as string]: "#17102e" }}>
              {t("askAi")}
            </button>
            {S.scam.vote && !rev ? (
              <span className="rounded-full bg-[#fff3c4] px-4 py-2 text-lg font-extrabold text-[#7a5200]">
                {t("yourVote")}: {S.scam.vote === "scam" ? t("scamBtn") : t("safeBtn")}
              </span>
            ) : null}
          </div>
          {scamBusy ? <div className="mt-5 text-2xl font-bold text-[#ff9600]">{t("thinking")}</div> : null}
          {rev && !scamBusy ? (
            <div className="mt-6" data-testid="scam-reveal">
              <div className={`break-words text-[32px] font-black sm:text-[42px] ${rev.verdict === "scam" ? "text-[#d33131]" : "text-[#46a302]"}`}>
                {rev.verdict === "scam" ? "⚠ " + t("scamBtn") : "✓ " + t("safeBtn")}
              </div>
              <div className="mt-1 text-[21px] font-semibold text-[#5b5872]">
                {rev.classVote ? t("classSaid") + ": " + rev.classVote + (rev.classRight ? " ✓" : " ✗") + " · " : ""}
                AI {rev.aiRight ? "✓ +1" : "✗"}
              </div>
              <div className="mt-4 text-[24px] font-extrabold">
                {rev.verdict === "scam" ? t("redFlags") : t("whySafe")}
              </div>
              <ul className="ml-6 mt-2 list-disc text-[19px] leading-[1.75] sm:text-[23px]">
                {rev.flags.map((f, fi) => <li key={fi}>{f}</li>)}
              </ul>
              {liveNote ? <FeedbackPanel title={liveNote} tone="sky">{lang === "my" ? "အဖြေကို အတန်းအတွက် လုံခြုံရေးသင်ခန်းစာအဖြစ် အသုံးပြုပါ။" : "Use this explanation as a defensive learning aid; the lesson verdict remains authoritative."}</FeedbackPanel> : null}
            </div>
          ) : null}
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <button onClick={() => mut(d => { d.scam.index = (i + CARDS.length - 1) % CARDS.length; })}
            className="pv-btn min-h-[72px] bg-white px-8 text-[23px] text-[#2b2140]" style={{ ["--pv-shade" as string]: "rgba(23,15,66,0.25)" }}>← {t("prev")}</button>
          <button onClick={() => mut(d => { d.scam.index = (i + 1) % CARDS.length; })}
            className="pv-btn min-h-[72px] bg-white px-8 text-[23px] text-[#2b2140]" style={{ ["--pv-shade" as string]: "rgba(23,15,66,0.25)" }}>{t("next")} →</button>
        </div>
        {pageRecords("scam")}
      </>
    );
  };

  const renderVault = () => {
    const v = S.vault;
    const doVaultAttempt = async (attempt: string, trickId?: string) => {
      if (!attempt || v.attemptsLeft <= 0 || vaultBusy) return;
      setVaultBusy(true);
      const r = await Api.call("vault", { level: v.level, attempt, trick: trickId, lang });
      bumpUsage(r.usage);
      setVaultLive(r.source === "live" && r.explanation ? r.explanation : null);
      mut(d => {
        d.vault.attemptsLeft -= 1;
        d.vault.log.push({ level: v.level, attempt, reply: r.reply!, won: !!r.won });
        const firstWin = !!r.won && !d.vault.won[v.level];
        if (r.won && !d.vault.won[v.level]) { d.vault.won[v.level] = true; d.scores.students += 1; }
        if (!r.won && d.vault.attemptsLeft === 0 && !d.vault.won[v.level]) { d.scores.ai += 1; }
        log(d, "vault", r.won ? "student win" : "attempt", "Level " + (v.level + 1) + ": " + attempt);
        if (firstWin) logXp(d, xpFlat(d, XP.vaultWin), "Hack the Bot level " + (v.level + 1) + " cleared");
        logBadges(d);
      });
      setVaultInput("");
      setVaultBusy(false);
    };
    const send = () => doVaultAttempt(vaultInput.trim());
    const sendTrick = (tr: VaultTrick) => doVaultAttempt(lang === "my" ? tr.attemptMy : tr.attemptEn, tr.id);
    const levelLog = v.log.filter(x => x.level === v.level).slice(-4);
    return (
      <>
        <PageHead id="vault" icon={<RobotIcon size={42} />} />
        <Objective>{lang === "my" ? "ဘော့ရဲ့ လျှို့ဝှက်ချက်ကို ကာကွယ်တဲ့ စည်းမျဉ်းကို ရှာပါ။" : "Identify the manipulation attempt and design a safer response."}</Objective>

        {/* How to play: the panel from the approved preview */}
        <div className="pv-card mb-6 bg-white px-5 py-6 sm:px-8 sm:py-7">
          <h3 className="text-[26px] font-black">🎯 {t("vaultHowTitle")}</h3>
          <p className="mt-2 max-w-4xl text-[21px] font-semibold leading-relaxed text-[#3c3a55]">{t("vaultHowBody")}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[t("vaultStep1"), t("vaultStep2"), t("vaultStep3")].map((s, si) => (
              <div key={si} className="flex items-center gap-3.5 rounded-[18px] bg-[#f6f4fc] px-5 py-4">
                <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#a560e8] text-[21px] font-black text-white shadow-[0_4px_0_#8c4fd6]">{si + 1}</span>
                <span className="text-[19px] font-bold leading-snug">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          {[0, 1, 2].map(l => (
            <button key={l} data-testid={`vault-level-${l}`}
              onClick={() => { mut(d => { d.vault.level = l; d.vault.attemptsLeft = 5; }); setVaultLive(null); }}
              className="pv-btn min-h-[72px] px-7 text-[22px]"
              style={v.level === l
                ? { background: "#a560e8", ["--pv-shade" as string]: "#8c4fd6" }
                : { background: "#ffffff", color: "#2b2140", ["--pv-shade" as string]: "rgba(23,15,66,0.25)" }}>
              {t("level")} {l + 1} {v.won[l] ? "🏆" : ""}
            </button>
          ))}
          <span className="rounded-full bg-[#fff3c4] px-5 py-3 text-[19px] font-extrabold text-[#7a5200] shadow-[0_4px_0_#e0a800]">
            {v.attemptsLeft} {t("attemptsLeft")}
          </span>
        </div>

        {/* Trick cards */}
        <div className="mb-2 text-[19px] font-black tracking-widest text-white/90">{t("trickPick").toUpperCase()}</div>
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {VAULT_TRICKS.map(tr => (
            <button key={tr.id} data-testid={`vault-trick-${tr.id}`}
              onClick={() => sendTrick(tr)} disabled={vaultBusy || v.attemptsLeft <= 0}
              className="pv-trick text-left disabled:opacity-50">
              <span className="pv-trick-glyph">{tr.glyph}</span>
              <span>
                <span className="block text-[21px] font-black leading-tight">{lang === "my" ? tr.my : tr.en}</span>
                <span className="mt-1 block text-[16px] font-medium leading-snug text-[#5b5872]">{lang === "my" ? tr.descMy : tr.descEn}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="pv-card bg-white p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text" value={vaultInput} maxLength={200}
              onChange={e => setVaultInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") send(); }}
              placeholder={t("tryIt") + "..."}
              className="pv-input min-h-[64px] min-w-0 flex-1 text-[20px] sm:min-h-[76px] sm:text-[24px]"
            />
            <button data-testid="vault-send" onClick={send} disabled={vaultBusy}
              className="pv-btn min-h-[64px] px-7 text-[21px] disabled:opacity-45 sm:min-h-[76px] sm:px-9 sm:text-[25px]" style={{ background: "#a560e8", ["--pv-shade" as string]: "#8c4fd6" }}>
              {t("send")}
            </button>
          </div>
          {vaultBusy ? <div className="mt-5 text-2xl font-bold text-[#ff9600]">{t("thinking")}</div> : null}
          <div className="mt-6 flex flex-col gap-4">
            {levelLog.map((x, xi) => {
              const lesson = VAULT_LESSONS[x.level];
              const isLast = xi === levelLog.length - 1;
              return (
                <div key={xi} className="flex flex-col gap-3">
                  <div className="flex justify-end">
                    <div className="pv-bubble pv-bubble-student">🧑 {x.attempt}</div>
                  </div>
                  <div className="flex justify-start">
                    <div className="pv-bubble pv-bubble-bot">🛡 {x.reply}</div>
                  </div>
                  <LessonBox title={t("vaultWhy")}>
                    {lang === "my" ? (x.won ? lesson.winMy : lesson.failMy) : (x.won ? lesson.winEn : lesson.failEn)}
                  </LessonBox>
                  {isLast && vaultLive ? (
                    <FeedbackPanel title="Live mentor explanation" tone="sky">{vaultLive}</FeedbackPanel>
                  ) : null}
                </div>
              );
            })}
            {levelLog.length === 0 ? (
              <p className="text-[20px] font-semibold text-[#8a87a0]">
                {lang === "my" ? "လှည့်ကွက် ကတ် တစ်ခုကို နှိပ်ပြီး စကြည့်ပါ။ Bot က ဘယ်လို ပြန်ဖြေလဲ ကြည့်ပါ။" : "Tap a trick card to begin. Watch how the bot answers."}
              </p>
            ) : null}
          </div>
        </div>
        {pageRecords("vault")}
      </>
    );
  };

  const renderRoast = () => {
    const check = async () => {
      const pw = pwInput;
      if (!pw) return;
      const score = pwScore(pw);
      const r = await Api.call("roast", { score, length: pw.length, patternFlags: pwFlags(pw), lang });
      setLiveNote(r.source === "live" ? "Live mentor explanation" : "Demo backup explanation");
      bumpUsage(r.usage);
      const masked = pw.slice(0, 2) + "•".repeat(Math.max(2, pw.length - 2));
      mut(d => {
        d.roast.history.unshift({ masked, score, roast: r.roast!, time: now() });
        log(d, "roast", "password checked", masked + " score " + score + "/4");
        /* only the masked form and the score are stored, never the password */
        logXp(d, xpFlat(d, XP.roastByScore[score]), "Password Roast score " + score + "/4");
        logBadges(d);
      });
      setRoastOut({ roast: r.roast!, tip: r.tip!, score, explanation: r.explanation });
      setPwInput("");
    };
    const shownScore = roastOut ? roastOut.score : null;
    return (
      <>
        <PageHead id="roast" icon={<KeyIcon size={42} />} />
        <Objective>{lang === "my" ? "Password အတုနဲ့ အကောင့်ကာကွယ်မှုကို မြှင့်တင်ပါ။" : "Build a long, unique identity defense without entering a real password."}</Objective>
        <div className="pv-card bg-white p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text" value={pwInput}
              onChange={e => setPwInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") check(); }}
              placeholder="aung123 / blue-elephant-river-42"
              className="pv-input min-h-[64px] min-w-0 flex-1 text-[20px] sm:min-h-[76px] sm:text-[24px]"
            />
            <button data-testid="roast-check" onClick={check}
              className="pv-btn min-h-[64px] px-7 text-[21px] sm:min-h-[76px] sm:px-9 sm:text-[25px]" style={{ background: "#ff9600", ["--pv-shade" as string]: "#e08600" }}>
              {t("checkPw")}
            </button>
          </div>
          <div className="mt-6 h-[28px] overflow-hidden rounded-full bg-[#eceaf6]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: shownScore !== null ? ((shownScore + 1) * 20) + "%" : "0%",
                background: shownScore !== null ? METER_COLORS[shownScore] : "transparent",
              }}
            />
          </div>
          {roastOut ? (
            <div className="mt-5 flex flex-col gap-3" data-testid="roast-out">
              <div className="rounded-[20px] bg-[#e9fbe0] px-6 py-5 text-[23px] font-semibold leading-relaxed">🛡 {roastOut.roast}</div>
              <div className="rounded-[20px] bg-[#e3f4fe] px-6 py-5 text-[23px] font-semibold leading-relaxed">{roastOut.tip}</div>
              {roastOut.explanation ? <FeedbackPanel title={liveNote ?? ""} tone="sky">{roastOut.explanation}</FeedbackPanel> : null}
              {liveNote ? <FeedbackPanel title={liveNote} tone="sky">{lang === "my" ? "အမှန်တကယ် စကားဝှက် မထည့်ပါနဲ့။ ရှည်လျား၊ မတူညီတဲ့ passphrase နဲ့ MFA သုံးပါ။" : "Never enter a real password here. Use a long, unique passphrase and enable MFA."}</FeedbackPanel> : null}
            </div>
          ) : null}
        </div>
        <div className="pv-card mt-6 bg-white p-4 sm:p-7">
          <h3 className="mb-4 text-2xl font-black">History</h3>
          <div className="flex flex-col gap-3">
            {S.roast.history.slice(0, 6).map((h, hi) => (
              <div key={hi} className="rounded-[18px] bg-[#f6f4fc] px-5 py-4 text-[20px] leading-relaxed">
                <span className="font-extrabold">{h.masked}</span> · score {h.score}/4
                <div>{h.roast}</div>
                <div className="mt-1 text-base font-semibold text-[#8a87a0]">{h.time}</div>
              </div>
            ))}
            {S.roast.history.length === 0 ? (
              <div className="rounded-[18px] bg-[#f6f4fc] px-5 py-4 text-[20px]">No roasts yet.</div>
            ) : null}
          </div>
        </div>
        {pageRecords("roast")}
      </>
    );
  };

  const renderAsk = () => {
    const ask = async () => {
      const q = askInput.trim();
      if (!q || askBusy) return;
      setAskBusy(true);
      const r = await Api.call("ask", { question: q, lang });
      bumpUsage(r.usage);
      mut(d => {
        d.ask.history.unshift({ q, a: r.answer!, source: r.source, time: now() });
        log(d, "ask", "question answered", q);
        logXp(d, xpFlat(d, XP.askQuestion), "Q&A question");
        logBadges(d);
      });
      setAskInput("");
      setAskBusy(false);
    };
    return (
      <>
        <PageHead id="ask" icon={<ChatIcon size={42} />} />
        <Objective>{lang === "my" ? "ဆိုက်ဘာ လုံခြုံရေး သို့မဟုတ် အွန်လိုင်း ဘေးကင်းရေး အကြောင်း မေးပါ။ ရိုးရှင်းတဲ့ ဘာသာနဲ့ ဖြေပေးပါမယ်။" : "Ask anything about cybersecurity or staying safe online. Answers come back in plain language."}</Objective>
        <div className="pv-card bg-white p-5 sm:p-8">
          <textarea
            value={askInput} maxLength={300}
            onChange={e => setAskInput(e.target.value)}
            placeholder="e.g. Someone got my Facebook password. What do I do first?"
            className="pv-input min-h-[120px] w-full text-[24px]"
          />
          <button data-testid="ask-send" onClick={ask} disabled={askBusy}
            className="pv-btn mt-4 min-h-[76px] px-9 text-[25px] disabled:opacity-45" style={{ background: "#1cb0f6", ["--pv-shade" as string]: "#1899d6" }}>
            {t("askQ")}
          </button>
          {askBusy ? <div className="mt-5 text-2xl font-bold text-[#ff9600]">{t("thinking")}</div> : null}
        </div>
        <div className="pv-card mt-6 bg-white p-4 sm:p-7">
          <h3 className="mb-4 text-2xl font-black">History</h3>
          <div className="flex flex-col gap-3">
            {S.ask.history.slice(0, 6).map((h, hi) => (
              <div key={hi} className="rounded-[18px] bg-[#f6f4fc] px-5 py-4 text-[20px] leading-relaxed">
                <div className="font-extrabold">🧑 {h.q}</div>
                <div>🛡 {h.a}</div>
                <div className="mt-1 text-base font-semibold text-[#8a87a0]">{h.time} · source: {h.source}</div>
              </div>
            ))}
            {S.ask.history.length === 0 ? (
              <div className="rounded-[18px] bg-[#f6f4fc] px-5 py-4 text-[20px]">No questions yet.</div>
            ) : null}
          </div>
        </div>
        {pageRecords("ask")}
      </>
    );
  };

  const renderQuiz = () => {
    const total = QUIZ.length;
    const answered = Object.keys(S.quiz.answers).length;
    const correct = Object.entries(S.quiz.answers).filter(([i, a]) => a === QUIZ[Number(i)].a).length;
    const rank = answered === total ? (correct >= 7 ? "Guardian 🏆" : correct >= 5 ? "Defender 🛡" : "Rookie 🌱") : "";
    const i = S.quiz.index, q = QUIZ[i], picked = S.quiz.answers[i];
    const opts = lang === "my" ? q.optsMy : q.optsEn;
    const warmedUp = Object.keys(S.scam.revealed).length > 0 && S.vault.log.length > 0 &&
      S.roast.history.length > 0 && S.ask.history.length > 0;
    return (
      <>
        <PageHead id="quiz" icon={<TrophyIcon size={42} />} />
        <Objective>{lang === "my" ? "အထောက်အထားနဲ့ ဆုံးဖြတ်ချက်ကို အသုံးပြုပြီး Cyber Defense Command ကို ပြီးမြောက်ပါ။" : "Combine threat analysis, identity defense, privacy, and incident response in the final command."}</Objective>
        <div className="pv-card relative mb-6 overflow-hidden p-5 pt-12 text-white sm:p-8" style={{ background: "linear-gradient(120deg,#ff4b4b,#ff9600)" }}>
          <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-[13px] font-black tracking-widest text-[#d33131] shadow-[0_4px_0_rgba(23,15,66,0.25)] sm:right-7 sm:top-6 sm:px-4 sm:py-1.5 sm:text-[16px]" style={{ transform: "rotate(4deg)" }}>
            👑 {t("stopBoss")}
          </span>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Image src="/assets/asset-trophy.webp" alt="" width={110} height={110} className="h-[72px] w-[72px] rounded-[18px] bg-white/90 object-contain p-1.5 sm:h-[110px] sm:w-[110px] sm:rounded-[22px]" />
            <div className="min-w-0 flex-1">
              <h2 className="break-words text-[28px] font-black leading-tight sm:text-[46px]" style={{ textShadow: "0 3px 0 rgba(23,15,66,0.25)" }}>{t("bossHead")}</h2>
              <p className="mt-2 max-w-4xl text-[18px] font-semibold leading-relaxed text-white/90 sm:text-[22px]">{t("quizSub")}</p>
            </div>
          </div>
          {!warmedUp ? (
            <div className="mt-5 rounded-[20px] bg-white/90 px-6 py-4 text-[20px] font-bold leading-relaxed text-[#2b2140]">
              💡 {t("bossNote")}
            </div>
          ) : null}
        </div>
        {dots(total, i, d => S.quiz.answers[d] !== undefined,
          d => mut(dd => { dd.quiz.index = d; }), "Question", "#ff4b4b", "#d33131")}
        <div className="pv-card bg-white p-5 sm:p-8">
          <div className="whitespace-pre-wrap rounded-[20px] border-[3px] border-dashed border-[#d9d4f5] bg-[#faf9ff] p-5 text-[23px] font-medium leading-[1.7] sm:p-7 sm:text-[31px]">
            {lang === "my" ? q.qMy : q.qEn}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            {opts.map((o, oi) => {
              let style: React.CSSProperties = { background: "#ffffff", color: "#2b2140", ["--pv-shade" as string]: "rgba(23,15,66,0.2)" };
              if (picked !== undefined) {
                if (oi === q.a) style = { background: "#58cc02", color: "#ffffff", ["--pv-shade" as string]: "#46a302" };
                else if (oi === picked) style = { background: "#ff4b4b", color: "#ffffff", ["--pv-shade" as string]: "#d33131" };
              }
              return (
                <button key={oi} disabled={picked !== undefined} data-testid={`quiz-opt-${oi}`}
                  onClick={() => mut(d => {
                    const right = oi === q.a;
                    d.quiz.answers[i] = oi;
                    if (right) d.scores.students += 1;
                    log(d, "quiz", right ? "correct" : "wrong", "Q" + (i + 1));
                    if (right) logXp(d, xpForCorrect(d, XP.quizCorrect), "Finale Quiz Q" + (i + 1) + " correct");
                    else xpForWrong(d);
                    logBadges(d);
                  })}
                  className="pv-btn min-h-[60px] max-w-full whitespace-normal px-5 text-left text-[19px] disabled:opacity-95 sm:min-h-[76px] sm:px-8 sm:text-[23px]" style={style}>
                  {o}
                </button>
              );
            })}
          </div>
          {picked !== undefined ? (
            <div className="mt-5 rounded-[20px] bg-[#e9fbe0] px-6 py-5 text-[23px] font-semibold leading-relaxed" data-testid="quiz-explain">
              {picked === q.a ? "✓ " : "✗ "}{lang === "my" ? q.exMy : q.exEn}
            </div>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-4">
            <button onClick={() => mut(d => { d.quiz.index = (i + total - 1) % total; })}
              className="pv-btn min-h-[72px] bg-white px-8 text-[23px] text-[#2b2140]" style={{ ["--pv-shade" as string]: "rgba(23,15,66,0.25)" }}>← {t("prev")}</button>
            <button onClick={() => mut(d => { d.quiz.index = (i + 1) % total; })}
              className="pv-btn min-h-[72px] bg-white px-8 text-[23px] text-[#2b2140]" style={{ ["--pv-shade" as string]: "rgba(23,15,66,0.25)" }}>{t("next")} →</button>
          </div>
        </div>
        {rank ? (
          <div className="pv-card mt-6 bg-white p-5 sm:p-8">
            <div className="text-[40px] font-black text-[#46a302]">{t("finalRank")}: {rank}</div>
            <div className="mt-3 rounded-[20px] bg-[#e9fbe0] px-6 py-5 text-[23px] font-semibold leading-relaxed">
              {correct} / {total} correct. Final 3 actions: strong passphrase, turn on 2FA, check the address before clicking.
            </div>
          </div>
        ) : null}
        {pageRecords("quiz")}
      </>
    );
  };

  const renderRecords = () => {
    const exportJson = () => {
      const blob = new Blob([JSON.stringify(S.records, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "cybershield-records.json";
      a.click();
      URL.revokeObjectURL(a.href);
    };
    return (
      <>
        <PageHead id="records" icon={<BookIcon size={42} />} />
        <div className="mb-6 flex flex-wrap gap-4">
          <button onClick={exportJson}
            className="pv-btn min-h-[60px] max-w-full whitespace-normal px-5 text-[19px] sm:min-h-[72px] sm:px-8 sm:text-[23px]" style={{ background: "#2b2140", ["--pv-shade" as string]: "#17102e" }}>
            {t("exportBtn")}
          </button>
        </div>

        {/* Badge shelf: earned badges in colour, the rest waiting in grey */}
        <div className="pv-card mb-8 bg-white p-4 sm:p-7">
          <h3 className="text-[26px] font-black sm:text-[30px]">🏅 {t("badges")}</h3>
          <p className="mb-5 mt-1 text-[17px] font-semibold leading-relaxed text-[#5b5872] sm:text-[19px]">{t("badgesSub")}</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
            {BADGES.map((b, bi) => {
              const has = !!S.game.badges[b.id];
              const col = BADGE_COLORS[bi % BADGE_COLORS.length];
              return (
                <div
                  key={b.id}
                  className="flex items-center gap-4 rounded-[22px] px-5 py-4"
                  style={{ background: has ? "#f6f4fc" : "#f4f2fa", opacity: has ? 1 : 0.72 }}
                >
                  <span
                    className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full text-[34px] text-white shadow"
                    style={{ background: has ? col : "#c9c5dd", filter: has ? undefined : "grayscale(1)" }}
                  >
                    {b.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[22px] font-extrabold leading-tight">{b.en}</div>
                    <div className="text-[17px] leading-snug text-[#5b5872]">
                      {lang === "my" ? b.descMy : b.descEn}
                    </div>
                    <div className={`mt-1 inline-block rounded-full px-3 py-0.5 text-[14px] font-extrabold ${has ? "bg-[#e9fbe0] text-[#2c5c05]" : "bg-white text-[#8a87a0]"}`}>
                      {has ? t("earned") : "🔒 " + t("locked")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="pv-card overflow-x-auto bg-white p-4 sm:p-7">
          <table className="w-full min-w-[620px] border-collapse text-[19px]">
            <thead>
              <tr>
                {["Time", "Page", "Action", "Detail"].map(h => (
                  <th key={h} className="border-b-[3px] border-[#eceaf6] px-3 py-3 text-left align-top text-[16px] font-black uppercase tracking-wide text-[#8a87a0]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {S.records.map((r, ri) => (
                <tr key={ri}>
                  <td className="border-b border-[#f1eef9] px-3 py-3 align-top">{r.time}</td>
                  <td className="border-b border-[#f1eef9] px-3 py-3 align-top">
                    <span className="inline-block rounded-full bg-[#e3f4fe] px-3 py-1 text-base font-extrabold">{r.page}</span>
                  </td>
                  <td className="border-b border-[#f1eef9] px-3 py-3 align-top">{r.action}</td>
                  <td className="border-b border-[#f1eef9] px-3 py-3 align-top">{r.detail}</td>
                </tr>
              ))}
              {S.records.length === 0 ? (
                <tr><td colSpan={4} className="px-3 py-3">No records yet.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const pages: Record<string, () => ReactNode> = {
    home: renderHome, scam: renderScam, vault: renderVault, roast: renderRoast,
    ask: renderAsk, quiz: renderQuiz, records: renderRecords,
    rush: () => <RushGame ctx={ctx} />,
    link: () => <LinkDetectiveGame ctx={ctx} />,
    privacy: () => <PrivacyGame ctx={ctx} />,
    permission: () => <PermissionPanicGame ctx={ctx} />,
    spot: () => <SpotFakeGame ctx={ctx} />,
    deepfake: () => <DeepfakeGame ctx={ctx} />,
    call: () => <ScamCallGame ctx={ctx} />,
    friend: () => <FriendFraudGame ctx={ctx} />,
    boss: () => <BossFightGame ctx={ctx} />,
  };

  const navList = (close?: () => void) => (
    <nav className="flex flex-col gap-2.5">
      {PAGES.map(p => {
        const c = SECTION_COLORS[p.id] ?? SECTION_COLORS.home;
        const active = S.page === p.id;
        return (
          <button
            key={p.id}
            data-testid={close ? `mobile-nav-${p.id}` : `nav-${p.id}`}
            onClick={() => { navTo(p.id); close?.(); }}
            className={`pv-nav min-h-[64px] ${active ? "" : "pv-nav-idle"}`}
            style={active ? { background: c.color, ["--pv-shade" as string]: c.shade, color: "#ffffff" } : undefined}
          >
            <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px] bg-white/25">
              {pageIcon(p.id, 24)}
            </span>
            <span className="min-w-0 flex-1 leading-tight">{t(p.id)}</span>
            {NEW_GAME_IDS.has(p.id) ? (
              <span className="rounded-full bg-[#ff4b4b] px-2 py-0.5 text-[11px] font-black tracking-widest text-white">NEW</span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );

  const langReset = (close?: () => void) => (
    <>
      <div className="flex gap-2">
        <button onClick={() => setLang("en")}
          className={`pv-nav min-h-[56px] flex-1 justify-center ${lang === "en" ? "" : "pv-nav-idle"}`}
          style={lang === "en" ? { background: "#2b2140", ["--pv-shade" as string]: "#17102e", color: "#fff" } : undefined}>EN</button>
        <button onClick={() => setLang("my")}
          className={`pv-nav min-h-[56px] flex-1 justify-center ${lang === "my" ? "" : "pv-nav-idle"}`}
          style={lang === "my" ? { background: "#2b2140", ["--pv-shade" as string]: "#17102e", color: "#fff" } : undefined}>မြန်မာ</button>
      </div>
      <button onClick={() => { resetAll(); close?.(); }}
        className="pv-btn min-h-[56px] bg-[#ffe3e3] px-4 text-[17px] text-[#b3261e]" style={{ ["--pv-shade" as string]: "#f3b8b8" }}>
        Reset all records
      </button>
    </>
  );

  return (
    <div className="pv-root flex flex-col min-[1101px]:flex-row">
      {/* Mobile top bar: logo, current tally, hamburger */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/15 bg-[#2b2140]/95 px-4 py-3 backdrop-blur min-[1101px]:hidden">
        <button onClick={() => setMobileNav(true)} aria-label="Open menu" aria-expanded={mobileNav} aria-controls="mobile-nav"
          className="pv-btn h-[48px] w-[48px] shrink-0 p-0" style={{ background: "rgba(255,255,255,0.16)", ["--pv-shade" as string]: "rgba(0,0,0,0.3)" }}>
          <MenuIcon size={26} />
        </button>
        <span className="flex min-w-0 items-center gap-2 text-[18px] font-black text-white">
          <Image src="/assets/asset-shield.webp" alt="" width={34} height={34} className="h-[34px] w-[34px] shrink-0 rounded-[10px] bg-white object-contain p-0.5" />
          <span className="truncate">CyberShield</span>
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-white/15 px-3 py-1 text-[14px] font-black text-white">
          {S.scores.students} – {S.scores.ai}
        </span>
      </header>

      {/* Desktop sidebar: every section, one tap, always visible */}
      <aside className="sticky top-0 hidden h-screen w-[320px] shrink-0 flex-col gap-2.5 overflow-y-auto p-5 min-[1101px]:flex">
        <div className="flex items-center gap-3 px-1 pb-2 pt-1">
          <span className="pv-card flex h-[74px] w-[74px] shrink-0 items-center justify-center bg-white p-1">
            <Image src="/assets/asset-shield.webp" alt="CyberShield Arena shield" width={62} height={62} className="rounded-[16px] object-contain" />
          </span>
          <div>
            <h1 className="text-[25px] font-black leading-tight text-white" style={{ textShadow: "0 3px 0 rgba(23,15,66,0.3)" }}>CyberShield Arena</h1>
            <small className="text-[15px] font-bold text-white/80">Students vs AI</small>
          </div>
        </div>

        {navList()}

        <div className="flex-1" />
        {langReset()}
      </aside>

      {/* Main column */}
      <main className="min-w-0 flex-1 px-4 pb-10 pt-4 sm:px-7 sm:pt-6">
        <div className="mb-3 flex items-stretch gap-2 sm:mb-6 sm:flex-wrap sm:gap-4">
          <div className="pv-card flex min-w-0 flex-1 flex-col justify-between gap-2 bg-white px-3 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-6 sm:py-4">
            <div>
              <div className="text-[13px] font-bold leading-tight text-[#5b5872] sm:text-[21px]">{t("students")}</div>
              <div className="text-[32px] font-black leading-none text-[#46a302] sm:text-[58px]" data-testid="score-students">{S.scores.students}</div>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <button onClick={() => adj("students", -1)} aria-label="Students minus"
                className="pv-btn h-[38px] w-[38px] bg-[#f1eef9] text-[18px] text-[#2b2140] sm:h-[68px] sm:w-[68px] sm:text-[28px]" style={{ ["--pv-shade" as string]: "#d9d4ec" }}>−</button>
              <button onClick={() => adj("students", 1)} aria-label="Students plus"
                className="pv-btn h-[38px] w-[38px] text-[18px] sm:h-[68px] sm:w-[68px] sm:text-[28px]" style={{ background: "#58cc02", ["--pv-shade" as string]: "#46a302" }}>+</button>
            </div>
          </div>
          <div className="pv-card flex min-w-0 flex-1 flex-col justify-between gap-2 bg-white px-3 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-6 sm:py-4">
            <div>
              <div className="text-[13px] font-bold leading-tight text-[#5b5872] sm:text-[21px]">AI</div>
              <div className="text-[32px] font-black leading-none text-[#1899d6] sm:text-[58px]" data-testid="score-ai">{S.scores.ai}</div>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <button onClick={() => adj("ai", -1)} aria-label="AI minus"
                className="pv-btn h-[38px] w-[38px] bg-[#f1eef9] text-[18px] text-[#2b2140] sm:h-[68px] sm:w-[68px] sm:text-[28px]" style={{ ["--pv-shade" as string]: "#d9d4ec" }}>−</button>
              <button onClick={() => adj("ai", 1)} aria-label="AI plus"
                className="pv-btn h-[38px] w-[38px] text-[18px] sm:h-[68px] sm:w-[68px] sm:text-[28px]" style={{ background: "#1cb0f6", ["--pv-shade" as string]: "#1899d6" }}>+</button>
            </div>
          </div>
          <div className="pv-card hidden flex-wrap items-center gap-3 bg-white px-4 py-4 text-[16px] font-semibold text-[#5b5872] sm:flex sm:px-6 sm:text-[18px]">
            <span>{t("usage")}</span> <b className="text-[21px] text-[#2b2140] sm:text-[23px]">{S.usage.calls}</b>
            <span>·</span> <span>{t("tokens")}</span> <b className="text-[21px] text-[#2b2140] sm:text-[23px]">{S.usage.tokens.toLocaleString()}</b>
          </div>
        </div>

        {(() => {
          const rf = rankFor(S.game.xp);
          const pct = rf.next ? Math.min(100, Math.round((rf.into / rf.span) * 100)) : 100;
          /* Mobile keeps the HUD on the home page only, so a game starts on screen. */
          return (
            <div className={S.page === "home" ? "" : "hidden min-[1101px]:block"}>
              <PlayerHud rank={lang === "my" ? rf.rank.my : rf.rank.en} xp={S.game.xp} next={rf.next ? `${rf.next.at - S.game.xp} ${t("xpToNext")}: ${lang === "my" ? rf.next.my : rf.next.en}` : null} pct={pct} streak={S.game.streak} best={S.game.bestStreak} label={t("shieldPoints")} streakLabel={t("streak")} bestLabel={t("bestStreak")} nextLabel={t("xpToNext")} maxLabel={t("maxRank")} icon={rf.rank.icon} />
            </div>
          );
        })()}

        {(pages[S.page] || renderHome)()}

        <div className="mt-10 rounded-[26px] bg-[#2b2140] px-6 py-7 text-center shadow-[0_8px_0_rgba(23,15,66,0.35)]">
          <div className="text-[21px] font-black tracking-wide text-white">
            CyberShield Arena · Stop · Check · Do not share · Report
          </div>
          <div className="mt-1.5 text-[16px] font-semibold text-white/60">UCS Magway · IT &amp; Cyber Youth Panel</div>
        </div>
      </main>

      {/* Mobile drawer: same sections, language and reset as the sidebar */}
      {mobileNav ? (
        <div className="fixed inset-0 z-50 min-[1101px]:hidden">
          <button aria-label="Close menu" onClick={() => setMobileNav(false)}
            className="absolute inset-0 h-full w-full bg-[#17102e]/60" />
          <div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Main menu"
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] flex-col gap-2.5 overflow-y-auto bg-[#f7f5ff] p-4 shadow-[12px_0_40px_rgba(23,15,66,0.35)]">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2 text-[18px] font-black text-[#2b2140]">
                <Image src="/assets/asset-shield.webp" alt="" width={34} height={34} className="h-[34px] w-[34px] shrink-0 rounded-[10px] bg-white object-contain p-0.5" />
                <span className="truncate">CyberShield Arena</span>
              </span>
              <button onClick={() => setMobileNav(false)} aria-label="Close menu" autoFocus
                className="pv-btn h-[44px] w-[44px] shrink-0 bg-[#eceaf6] p-0 text-[#2b2140]" style={{ ["--pv-shade" as string]: "#d9d4ec" }}>
                <CloseIcon size={22} />
              </button>
            </div>
            {navList(() => setMobileNav(false))}
            <div className="flex-1" />
            {langReset(() => setMobileNav(false))}
          </div>
        </div>
      ) : null}

      {/* Level-up celebration: bright stamp + confetti, one big tap away */}
      {celeb !== null ? (() => {
        const r = rankFor(S.game.xp);
        const confetti = ["#58cc02", "#1cb0f6", "#ff9600", "#a560e8", "#ff4b4b", "#ffc800"];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17102e]/60 p-6" role="dialog" aria-modal="true">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              {Array.from({ length: 28 }, (_, ci) => (
                <span
                  key={ci}
                  className="confetti-bit"
                  style={{
                    left: (ci * 37) % 100 + "%",
                    background: confetti[ci % confetti.length],
                    animationDelay: (ci % 7) * 0.35 + "s",
                    borderRadius: ci % 3 === 0 ? "50%" : "3px",
                  }}
                />
              ))}
            </div>
            <div className="pv-card celeb-pop relative w-full max-w-[620px] bg-white p-10 text-center">
              <div className="text-[26px] font-black uppercase tracking-widest text-[#8a87a0]">{t("levelUp")}</div>
              <div className="stamp-in mx-auto mt-6 flex h-[190px] w-[190px] flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#ffd93b] to-[#ffc800] shadow-[0_10px_0_#e0a800]">
                <span className="text-[84px] leading-none">{r.rank.icon}</span>
                <span className="mt-2 px-3 text-[21px] font-black leading-tight text-[#7a5200]">{lang === "my" ? r.rank.my : r.rank.en}</span>
              </div>
              <div className="mt-6 text-[24px] font-bold text-[#5b5872]">
                {t("newRank")} · 🛡 {S.game.xp} {t("shieldPoints")}
              </div>
              <button
                onClick={() => setCeleb(null)}
                className="pv-btn mt-8 min-h-[84px] w-full px-9 text-[27px]"
                style={{ background: "#58cc02", ["--pv-shade" as string]: "#46a302" }}
              >
                {t("tapContinue")} →
              </button>
            </div>
          </div>
        );
      })() : null}
    </div>
  );
}
