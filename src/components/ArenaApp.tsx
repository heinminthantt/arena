"use client";

/* CyberShield Arena: Next.js port of the single-file demo.
   Same state shape, same localStorage key ("cybershield-arena-demo-v1"),
   same mock Api.call() stub. Design: Creatie scrapbook pattern
   (cream graph paper, pastels, hills scene, soft shadows, black marquee).
   Burmese renders in MiSans Myanmar via the font stack in globals.css. */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Api, BADGES, CARDS, ICONIMG, PAGES, QUIZ, STORAGE_KEY, T, XP,
  freshState, migrateState, pwScore, rankFor, syncBadges,
  xpFlat, xpForCorrect, xpForWrong,
  type ArenaState, type Lang,
} from "@/lib/content";
import Hills from "@/components/Hills";

const PASTELS = ["#f5b8d0", "#bfe3f5", "#c8f0d8", "#fff3b0", "#c2b3f3", "#f9d9a8"];
const METER_COLORS = ["#e53935", "#ed9948", "#f5b301", "#82b26b", "#3f6d30"];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function ArenaApp() {
  const [S, setS] = useState<ArenaState | null>(null);
  const loaded = useRef(false);

  /* transient UI state (never stored, same as the DOM-only state in the demo) */
  const [scamBusy, setScamBusy] = useState(false);
  const [askBusy, setAskBusy] = useState(false);
  const [vaultBusy, setVaultBusy] = useState(false);
  const [vaultInput, setVaultInput] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [askInput, setAskInput] = useState("");
  const [roastOut, setRoastOut] = useState<{ roast: string; tip: string; score: number } | null>(null);

  /* game layer: level-up celebration (transient; the rank itself lives in state) */
  const [celeb, setCeleb] = useState<number | null>(null);
  const prevRank = useRef<number | null>(null);

  /* load once from localStorage, exactly like the demo, but folded through
     migrateState so saves from before the game layer gain the new fields
     (XP, streak, badges) without losing a single record */
  useEffect(() => {
    let initial = freshState();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) initial = migrateState(JSON.parse(raw));
    } catch { /* keep fresh state */ }
    loaded.current = true;
    setS(initial);
  }, []);

  /* save on every change, like the demo's save() after every action */
  useEffect(() => {
    if (S && loaded.current) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); } catch { /* storage full/blocked */ }
    }
  }, [S]);

  /* level-up watcher: the first sighting after load just sets the baseline
     (a migrated save may already sit at a high rank); only a genuine
     crossing during play opens the celebration */
  useEffect(() => {
    if (!S) return;
    const idx = rankFor(S.game.xp).index;
    if (prevRank.current === null) { prevRank.current = idx; return; }
    if (idx > prevRank.current) setCeleb(idx);
    prevRank.current = idx;
  }, [S]);

  if (!S) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-2xl font-bold text-ink-soft">CyberShield Arena…</p>
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
      <div className="relative mt-6">
        <span className="tape" />
        <div className="sticker p-7">
          <h3 className="mb-4 text-2xl font-extrabold">📒 {t("playAgain")}</h3>
          <div className="flex flex-col gap-3">
            {rows.map((r, i) => (
              <div key={i} className="rounded-2xl bg-cream px-5 py-4 text-[21px] leading-relaxed">
                <span className="font-extrabold">{r.action}</span> · {r.detail}
                <div className="mt-1 text-base text-ink-soft">{r.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const pageHead = (icon: string, key: string, subKey: string) => (
    <>
      <h2 className="headline text-[52px]">{icon} {t(key)}</h2>
      <p className="mb-7 mt-2 max-w-4xl text-[23px] leading-relaxed text-ink-soft">{t(subKey)}</p>
    </>
  );

  const dots = (
    count: number, current: number, doneMap: (i: number) => boolean,
    onPick: (i: number) => void, label: string,
  ) => (
    <div className="mb-5 flex flex-wrap gap-3" role="navigation" aria-label={label}>
      {Array.from({ length: count }, (_, d) => (
        <button
          key={d}
          onClick={() => onPick(d)}
          aria-label={`${label} ${d + 1}`}
          className={`flex h-[72px] w-[72px] items-center justify-center rounded-full text-[22px] font-extrabold shadow-[0_6px_16px_rgba(0,0,0,0.10)] transition-transform active:scale-95 ${
            d === current
              ? "bg-sun text-ink ring-4 ring-ink/70"
              : doneMap(d)
                ? "bg-pastel-mint text-ink"
                : "bg-white text-ink border border-paper-line"
          }`}
        >
          {d + 1}
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
      : id === "roast" ? "" + S.roast.history.length : "";
    return (
      <>
        <div className="sticker relative overflow-hidden">
          <Hills className="absolute inset-0 h-full w-full" />
          <div className="relative flex flex-wrap items-center gap-8 p-9">
            <div className="min-w-[320px] flex-1">
              <span className="glass-hero inline-block rounded-full px-5 py-2.5 text-lg font-extrabold tracking-wide text-ink">
                UCS MAGWAY · IT &amp; CYBER YOUTH PANEL
              </span>
              <h2
                className="headline mt-5 text-[76px] text-white"
                style={{ textShadow: "0 3px 0 rgba(63,109,48,.45), 0 10px 28px rgba(0,0,0,.25)" }}
              >
                CyberShield<br />Arena
              </h2>
              <p className="mt-4 max-w-[640px] rounded-3xl bg-white/75 p-5 text-[23px] leading-relaxed text-ink backdrop-blur-sm">
                {t("homeSub")}
              </p>
              <p className="mt-4 inline-block rounded-full bg-sun px-5 py-2 text-lg font-extrabold text-ink shadow">
                DEMO BUILD: every section works. Only the live Claude API is left to connect.
              </p>
            </div>
            <div className="relative h-[300px] w-[330px] shrink-0">
              <Image src="/assets/asset-shield.webp" alt="Voxel shield" width={250} height={250}
                className="absolute left-[36px] top-[14px] rounded-[26px] bg-white/70 object-contain p-2" priority />
              <Image src="/assets/asset-key.webp" alt="" width={92} height={92}
                className="animate-floaty absolute right-0 top-0 rounded-[20px] bg-white object-contain p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.15)]" />
              <Image src="/assets/asset-bubble.webp" alt="" width={86} height={86}
                className="animate-floaty absolute bottom-0 left-0 rounded-[20px] bg-white object-contain p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.15)]" style={{ animationDelay: ".8s" }} />
              <Image src="/assets/asset-trophy.webp" alt="" width={90} height={90}
                className="animate-floaty absolute bottom-0 right-1 rounded-[20px] bg-white object-contain p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.15)]" style={{ animationDelay: "1.6s" }} />
            </div>
          </div>
        </div>

        <div className="my-6 overflow-hidden rounded-full bg-ink py-3.5" aria-hidden="true">
          <div className="animate-marquee flex w-max whitespace-nowrap text-[21px] font-extrabold tracking-wider text-white">
            <span>STOP <span className="text-lime">✦</span> စဉ်းစားပါ <span className="text-lime">✦</span> CHECK <span className="text-lime">✦</span> မမျှဝေပါနဲ့ <span className="text-lime">✦</span> DO NOT SHARE <span className="text-lime">✦</span> REPORT <span className="text-lime">✦</span> သတင်းပို့ပါ <span className="text-lime">✦</span> STAY SAFE <span className="text-lime">✦</span>&nbsp;</span>
            <span>STOP <span className="text-lime">✦</span> စဉ်းစားပါ <span className="text-lime">✦</span> CHECK <span className="text-lime">✦</span> မမျှဝေပါနဲ့ <span className="text-lime">✦</span> DO NOT SHARE <span className="text-lime">✦</span> REPORT <span className="text-lime">✦</span> သတင်းပို့ပါ <span className="text-lime">✦</span> STAY SAFE <span className="text-lime">✦</span>&nbsp;</span>
          </div>
        </div>

        {/* Journey map: the trail up the hill, stops mirror the real records */}
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
            if (id === "roast") {
              return S.roast.history.some(h => h.score >= 3) ? "done"
                : S.roast.history.length > 0 ? "doing" : "todo";
            }
            if (id === "ask") return S.ask.history.length > 0 ? "done" : "todo";
            if (id === "quiz") {
              const n = Object.keys(S.quiz.answers).length;
              return n === 0 ? "todo" : n >= QUIZ.length ? "done" : "doing";
            }
            return "todo";
          };
          const stops: { id: string; x: number; y: number; boss?: boolean }[] = [
            { id: "start", x: 5, y: 60 },
            { id: "scam", x: 22, y: 28 },
            { id: "vault", x: 39, y: 53 },
            { id: "roast", x: 56, y: 26 },
            { id: "ask", x: 72, y: 51 },
            { id: "quiz", x: 89, y: 31, boss: true },
          ];
          const stateChip = (st: StopState) =>
            st === "done" ? "bg-pastel-mint" : st === "doing" ? "bg-sun" : "bg-white/85";
          const stateText = (st: StopState) =>
            st === "done" ? t("stateDone") : st === "doing" ? t("stateDoing") : t("stateTodo");
          return (
            <div className="sticker relative mb-6 overflow-hidden">
              <div className="bg-gradient-to-b from-pastel-sky/70 via-cream to-cream px-8 pb-4 pt-7">
                <h3 className="headline text-[38px]">🗺️ {t("journey")}</h3>
                <p className="mt-1 max-w-4xl text-[20px] leading-relaxed text-ink-soft">{t("journeySub")}</p>
              </div>
              <div className="relative h-[360px]">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    d="M 60 180 C 150 78, 190 84, 264 84 C 340 84, 390 168, 468 168 C 550 168, 590 72, 672 78 C 750 84, 790 162, 864 159 C 950 155, 990 66, 1068 72"
                    fill="none" stroke="#b08968" strokeWidth="7" strokeLinecap="round" strokeDasharray="1 18" opacity="0.65"
                  />
                </svg>
                <Hills className="absolute bottom-0 left-0 h-[74px] w-full opacity-70" />
                {stops.map(stop => {
                  const isStart = stop.id === "start";
                  const st: StopState = isStart ? "done" : stopState(stop.id);
                  const size = stop.boss ? 118 : 92;
                  return (
                    <button
                      key={stop.id}
                      onClick={() => (isStart ? window.scrollTo(0, 0) : go(stop.id))}
                      className="group absolute flex w-[168px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 active:scale-95"
                      style={{ left: stop.x + "%", top: stop.y + "%" }}
                      aria-label={isStart ? t("stopStart") : t(stop.id)}
                    >
                      {stop.boss ? (
                        <span className="rounded-md bg-pin px-3 py-1 text-[15px] font-black tracking-widest text-white shadow" style={{ transform: "rotate(-5deg)" }}>
                          👑 {t("stopBoss")}
                        </span>
                      ) : null}
                      <span
                        className={`relative flex items-center justify-center rounded-full border-4 border-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition-transform group-hover:-translate-y-1 ${
                          stop.boss ? "bg-pastel-lilac" : st === "done" ? "bg-leaf" : st === "doing" ? "bg-sun" : "bg-white"
                        }`}
                        style={{ width: size, height: size, minWidth: 72, minHeight: 72 }}
                      >
                        {isStart ? (
                          <span className="text-[40px]">🚩</span>
                        ) : ICONIMG[stop.id] ? (
                          <Image src={ICONIMG[stop.id]} alt="" width={stop.boss ? 74 : 56} height={stop.boss ? 74 : 56} className="object-contain" />
                        ) : (
                          <span className="text-[36px]">⭐</span>
                        )}
                        {st === "done" && !isStart ? (
                          <span className="absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-full bg-leaf-deep text-[19px] font-black text-white shadow">✓</span>
                        ) : null}
                      </span>
                      <span className="rounded-full bg-white/90 px-3.5 py-1 text-center text-[17px] font-extrabold leading-tight shadow-sm">
                        {isStart ? t("stopStart") : t(stop.id)}
                      </span>
                      {!isStart ? (
                        <span className={`rounded-full px-3 py-0.5 text-[14px] font-extrabold ${stateChip(st)}`}>
                          {stateText(st)}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
          {PAGES.filter(p => p.id !== "home").map((p, idx) => (
            <button
              key={p.id}
              onClick={() => go(p.id)}
              className="sticker relative p-7 text-left transition-transform hover:-translate-y-1 active:scale-[.98]"
              style={{ background: PASTELS[idx % PASTELS.length] }}
            >
              <span className="pushpin" />
              <div>
                {ICONIMG[p.id]
                  ? <Image src={ICONIMG[p.id]} alt="" width={112} height={112} className="h-[112px] w-[112px] object-contain" />
                  : <span className="text-[44px]">{p.icon}</span>}
              </div>
              <h3 className="mt-3 text-[28px] font-extrabold">{t(p.id)}</h3>
              <p className="mt-1 text-[19px] leading-relaxed text-ink/70">{t(p.id + "Sub")}</p>
              {done(p.id) ? (
                <div className="mt-3 inline-block rounded-full bg-white/80 px-4 py-1.5 text-[17px] font-extrabold">
                  Progress: {done(p.id)}
                </div>
              ) : null}
            </button>
          ))}
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
        {pageHead("🃏", "scam", "scamSub")}
        {dots(CARDS.length, i, d => !!S.scam.revealed[d],
          d => mut(dd => { dd.scam.index = d; dd.scam.vote = null; }), "Card")}
        <div className="relative">
          <span className="pushpin" />
          <div className="sticker p-8">
            <div className="whitespace-pre-wrap rounded-3xl border-2 border-dashed border-paper-line bg-cream p-7 text-[32px] leading-[1.7]">
              {lang === "my" ? c.my : c.en}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-[22px] font-bold">{t("classSaid")}:</span>
              <button onClick={() => vote("scam")} className="min-h-[76px] rounded-full bg-pin px-9 text-[25px] font-extrabold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[.97]">
                {t("scamBtn")}
              </button>
              <button onClick={() => vote("safe")} className="min-h-[76px] rounded-full bg-leaf-deep px-9 text-[25px] font-extrabold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[.97]">
                {t("safeBtn")}
              </button>
              <button onClick={askAi} disabled={scamBusy} className="min-h-[76px] rounded-full bg-ink px-9 text-[25px] font-extrabold text-cream shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[.97] disabled:opacity-45">
                {t("askAi")}
              </button>
              {S.scam.vote && !rev ? (
                <span className="rounded-full bg-pastel-butter px-4 py-2 text-lg font-extrabold">
                  {t("yourVote")}: {S.scam.vote === "scam" ? t("scamBtn") : t("safeBtn")}
                </span>
              ) : null}
            </div>
            {scamBusy ? <div className="mt-5 text-2xl font-bold text-pastel-peach">{t("thinking")}</div> : null}
            {rev && !scamBusy ? (
              <div className="mt-6">
                <div className={`text-[42px] font-black ${rev.verdict === "scam" ? "text-pin" : "text-leaf-deep"}`}>
                  {rev.verdict === "scam" ? "⚠ " + t("scamBtn") : "✓ " + t("safeBtn")}
                </div>
                <div className="mt-1 text-[21px] text-ink-soft">
                  {rev.classVote ? t("classSaid") + ": " + rev.classVote + (rev.classRight ? " ✓" : " ✗") + " · " : ""}
                  AI {rev.aiRight ? "✓ +1" : "✗"}
                </div>
                <div className="mt-4 text-[24px] font-extrabold">
                  {rev.verdict === "scam" ? t("redFlags") : t("whySafe")}
                </div>
                <ul className="ml-6 mt-2 list-disc text-[23px] leading-[1.75]">
                  {rev.flags.map((f, fi) => <li key={fi}>{f}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <button onClick={() => mut(d => { d.scam.index = (i + CARDS.length - 1) % CARDS.length; })}
            className="min-h-[76px] rounded-full bg-white px-8 text-[24px] font-extrabold shadow-[0_8px_20px_rgba(0,0,0,0.10)] border border-paper-line active:scale-[.97]">← {t("prev")}</button>
          <button onClick={() => mut(d => { d.scam.index = (i + 1) % CARDS.length; })}
            className="min-h-[76px] rounded-full bg-white px-8 text-[24px] font-extrabold shadow-[0_8px_20px_rgba(0,0,0,0.10)] border border-paper-line active:scale-[.97]">{t("next")} →</button>
        </div>
        {pageRecords("scam")}
      </>
    );
  };

  const renderVault = () => {
    const v = S.vault;
    const send = async () => {
      const attempt = vaultInput.trim();
      if (!attempt || v.attemptsLeft <= 0 || vaultBusy) return;
      setVaultBusy(true);
      const r = await Api.call("vault", { level: v.level, attempt, lang });
      bumpUsage(r.usage);
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
    return (
      <>
        {pageHead("🔐", "vault", "vaultSub")}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          {[0, 1, 2].map(l => (
            <button key={l}
              onClick={() => mut(d => { d.vault.level = l; d.vault.attemptsLeft = 5; })}
              className={`min-h-[72px] rounded-full px-7 text-[22px] font-extrabold shadow-[0_6px_16px_rgba(0,0,0,0.10)] active:scale-[.97] ${
                v.level === l ? "bg-ink text-cream" : "bg-white text-ink border border-paper-line"}`}>
              {t("level")} {l + 1} {v.won[l] ? "🏆" : ""}
            </button>
          ))}
          <span className="rounded-full bg-pastel-butter px-5 py-3 text-[19px] font-extrabold">
            {v.attemptsLeft} {t("attemptsLeft")}
          </span>
        </div>
        <div className="relative">
          <span className="tape" />
          <div className="sticker p-8">
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="text" value={vaultInput} maxLength={200}
                onChange={e => setVaultInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") send(); }}
                placeholder={t("tryIt") + "..."}
                className="min-h-[76px] min-w-[280px] flex-1 rounded-2xl border border-input-line bg-white px-5 text-[25px]"
              />
              <button onClick={send} disabled={vaultBusy}
                className="min-h-[76px] rounded-full bg-ink px-9 text-[25px] font-extrabold text-cream shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[.97] disabled:opacity-45">
                {t("send")}
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {v.log.filter(x => x.level === v.level).slice(-4).map((x, xi) => (
                <div key={xi} className="rounded-2xl bg-cream px-5 py-4 text-[21px] leading-relaxed">
                  <div className="font-extrabold">🧑 {x.attempt}</div>
                  <div>🛡 {x.reply}</div>
                </div>
              ))}
            </div>
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
      const r = await Api.call("roast", { score, length: pw.length, lang });
      bumpUsage(r.usage);
      const masked = pw.slice(0, 2) + "•".repeat(Math.max(2, pw.length - 2));
      mut(d => {
        d.roast.history.unshift({ masked, score, roast: r.roast!, time: now() });
        log(d, "roast", "password checked", masked + " score " + score + "/4");
        /* only the masked form and the score are stored, never the password */
        logXp(d, xpFlat(d, XP.roastByScore[score]), "Password Roast score " + score + "/4");
        logBadges(d);
      });
      setRoastOut({ roast: r.roast!, tip: r.tip!, score });
      setPwInput("");
    };
    const shownScore = roastOut ? roastOut.score : null;
    return (
      <>
        {pageHead("🔑", "roast", "roastSub")}
        <div className="relative">
          <span className="pushpin" />
          <div className="sticker p-8">
            <div className="rounded-2xl bg-pastel-butter px-5 py-3 text-[20px] font-bold text-ink">
              ⚠ {lang === "my" ? "စကားဝှက် အတု သာ သုံးပါ" : "Use fake passwords only"}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <input
                type="text" value={pwInput}
                onChange={e => setPwInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") check(); }}
                placeholder="aung123 / blue-elephant-river-42"
                className="min-h-[76px] min-w-[280px] flex-1 rounded-2xl border border-input-line bg-white px-5 text-[25px]"
              />
              <button onClick={check}
                className="min-h-[76px] rounded-full bg-ink px-9 text-[25px] font-extrabold text-cream shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[.97]">
                {t("checkPw")}
              </button>
            </div>
            <div className="mt-6 h-[30px] overflow-hidden rounded-full border border-paper-line bg-cream-deep">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: shownScore !== null ? ((shownScore + 1) * 20) + "%" : "0%",
                  background: shownScore !== null ? METER_COLORS[shownScore] : "transparent",
                }}
              />
            </div>
            {roastOut ? (
              <div className="mt-5 flex flex-col gap-3">
                <div className="rounded-3xl bg-pastel-mint px-6 py-5 text-[23px] leading-relaxed">🛡 {roastOut.roast}</div>
                <div className="rounded-3xl bg-pastel-sky px-6 py-5 text-[23px] leading-relaxed">{roastOut.tip}</div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="relative mt-6">
          <span className="tape" />
          <div className="sticker p-7">
            <h3 className="mb-4 text-2xl font-extrabold">History</h3>
            <div className="flex flex-col gap-3">
              {S.roast.history.slice(0, 6).map((h, hi) => (
                <div key={hi} className="rounded-2xl bg-cream px-5 py-4 text-[21px] leading-relaxed">
                  <span className="font-extrabold">{h.masked}</span> · score {h.score}/4
                  <div>{h.roast}</div>
                  <div className="mt-1 text-base text-ink-soft">{h.time}</div>
                </div>
              ))}
              {S.roast.history.length === 0 ? (
                <div className="rounded-2xl bg-cream px-5 py-4 text-[21px]">No roasts yet.</div>
              ) : null}
            </div>
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
        logXp(d, xpFlat(d, XP.askQuestion), "Ask the Hacker question");
        logBadges(d);
      });
      setAskInput("");
      setAskBusy(false);
    };
    return (
      <>
        {pageHead("💬", "ask", "askSub")}
        <div className="relative">
          <span className="pushpin" />
          <div className="sticker p-8">
            <textarea
              value={askInput} maxLength={300}
              onChange={e => setAskInput(e.target.value)}
              placeholder="e.g. Someone got my Facebook password. What do I do first?"
              className="min-h-[120px] w-full rounded-2xl border border-input-line bg-white p-5 text-[25px]"
            />
            <button onClick={ask} disabled={askBusy}
              className="mt-4 min-h-[76px] rounded-full bg-ink px-9 text-[25px] font-extrabold text-cream shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[.97] disabled:opacity-45">
              {t("askQ")}
            </button>
            {askBusy ? <div className="mt-5 text-2xl font-bold text-pastel-peach">{t("thinking")}</div> : null}
          </div>
        </div>
        <div className="relative mt-6">
          <span className="tape" />
          <div className="sticker p-7">
            <h3 className="mb-4 text-2xl font-extrabold">History</h3>
            <div className="flex flex-col gap-3">
              {S.ask.history.slice(0, 6).map((h, hi) => (
                <div key={hi} className="rounded-2xl bg-cream px-5 py-4 text-[21px] leading-relaxed">
                  <div className="font-extrabold">🧑 {h.q}</div>
                  <div>🛡 {h.a}</div>
                  <div className="mt-1 text-base text-ink-soft">{h.time} · source: {h.source}</div>
                </div>
              ))}
              {S.ask.history.length === 0 ? (
                <div className="rounded-2xl bg-cream px-5 py-4 text-[21px]">No questions yet.</div>
              ) : null}
            </div>
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
        {/* Boss framing: the quiz is the final boss of the journey.
            The note below is a SOFT gate only; it never blocks anything. */}
        <div className="sticker relative mb-6 overflow-hidden bg-gradient-to-br from-pastel-lilac via-[#ded2fb] to-pastel-sky p-8">
          <span className="absolute right-7 top-6 rounded-md bg-pin px-4 py-1.5 text-[17px] font-black tracking-widest text-white shadow"
            style={{ transform: "rotate(4deg)" }}>
            👑 {t("stopBoss")}
          </span>
          <div className="flex flex-wrap items-center gap-6">
            <Image src="/assets/asset-trophy.webp" alt="" width={110} height={110} className="h-[110px] w-[110px] object-contain" />
            <div className="min-w-[300px] flex-1">
              <h2 className="headline text-[52px]">{t("bossHead")}</h2>
              <p className="mt-2 max-w-4xl text-[23px] leading-relaxed text-ink/75">{t("quizSub")}</p>
            </div>
          </div>
          {!warmedUp ? (
            <div className="mt-5 rounded-3xl bg-white/80 px-6 py-4 text-[21px] font-bold leading-relaxed">
              💡 {t("bossNote")}
            </div>
          ) : null}
        </div>
        {dots(total, i, d => S.quiz.answers[d] !== undefined,
          d => mut(dd => { dd.quiz.index = d; }), "Question")}
        <div className="relative">
          <span className="pushpin" />
          <div className="sticker p-8">
            <div className="whitespace-pre-wrap rounded-3xl border-2 border-dashed border-paper-line bg-cream p-7 text-[32px] leading-[1.7]">
              {lang === "my" ? q.qMy : q.qEn}
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              {opts.map((o, oi) => {
                let cls = "bg-white text-ink border border-paper-line";
                if (picked !== undefined) {
                  if (oi === q.a) cls = "bg-leaf-deep text-white";
                  else if (oi === picked) cls = "bg-pin text-white";
                }
                return (
                  <button key={oi} disabled={picked !== undefined}
                    onClick={() => mut(d => {
                      const right = oi === q.a;
                      d.quiz.answers[i] = oi;
                      if (right) d.scores.students += 1;
                      log(d, "quiz", right ? "correct" : "wrong", "Q" + (i + 1));
                      if (right) logXp(d, xpForCorrect(d, XP.quizCorrect), "Finale Quiz Q" + (i + 1) + " correct");
                      else xpForWrong(d);
                      logBadges(d);
                    })}
                    className={`min-h-[76px] rounded-full px-8 text-[24px] font-extrabold shadow-[0_8px_20px_rgba(0,0,0,0.10)] active:scale-[.97] disabled:opacity-90 ${cls}`}>
                    {o}
                  </button>
                );
              })}
            </div>
            {picked !== undefined ? (
              <div className="mt-5 rounded-3xl bg-pastel-mint px-6 py-5 text-[23px] leading-relaxed">
                {picked === q.a ? "✓ " : "✗ "}{lang === "my" ? q.exMy : q.exEn}
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-4">
              <button onClick={() => mut(d => { d.quiz.index = (i + total - 1) % total; })}
                className="min-h-[76px] rounded-full bg-white px-8 text-[24px] font-extrabold shadow-[0_8px_20px_rgba(0,0,0,0.10)] border border-paper-line active:scale-[.97]">← {t("prev")}</button>
              <button onClick={() => mut(d => { d.quiz.index = (i + 1) % total; })}
                className="min-h-[76px] rounded-full bg-white px-8 text-[24px] font-extrabold shadow-[0_8px_20px_rgba(0,0,0,0.10)] border border-paper-line active:scale-[.97]">{t("next")} →</button>
            </div>
          </div>
        </div>
        {rank ? (
          <div className="sticker mt-6 p-8">
            <div className="text-[42px] font-black text-leaf-deep">{t("finalRank")}: {rank}</div>
            <div className="mt-3 rounded-3xl bg-pastel-mint px-6 py-5 text-[23px] leading-relaxed">
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
        {pageHead("📒", "records", "recordsSub")}
        <div className="mb-6 flex flex-wrap gap-4">
          <button onClick={exportJson}
            className="min-h-[76px] rounded-full bg-ink px-9 text-[25px] font-extrabold text-cream shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-[.97]">
            {t("exportBtn")}
          </button>
        </div>

        {/* Badge shelf: earned badges in colour, the rest waiting in grey */}
        <div className="relative mb-8">
          <span className="pushpin" />
          <div className="sticker p-7">
            <h3 className="text-[30px] font-extrabold">🏅 {t("badges")}</h3>
            <p className="mb-5 mt-1 text-[20px] leading-relaxed text-ink-soft">{t("badgesSub")}</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
              {BADGES.map((b, bi) => {
                const has = !!S.game.badges[b.id];
                return (
                  <div
                    key={b.id}
                    className="flex items-center gap-4 rounded-3xl px-5 py-4"
                    style={{
                      background: has ? PASTELS[bi % PASTELS.length] : "#f1eee2",
                      opacity: has ? 1 : 0.75,
                    }}
                  >
                    <span
                      className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-[3px] border-dashed border-ink/25 bg-white text-[36px] shadow"
                      style={has ? undefined : { filter: "grayscale(1)" }}
                    >
                      {b.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[23px] font-extrabold leading-tight">{b.en}</div>
                      <div className="text-[18px] leading-snug text-ink/70">
                        {lang === "my" ? b.descMy : b.descEn}
                      </div>
                      <div className={`mt-1 inline-block rounded-full px-3 py-0.5 text-[15px] font-extrabold ${has ? "bg-white/85" : "bg-white/60 text-ink-soft"}`}>
                        {has ? t("earned") : "🔒 " + t("locked")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="relative">
          <span className="tape" />
          <div className="sticker overflow-x-auto p-7">
            <table className="w-full border-collapse text-[19px]">
              <thead>
                <tr>
                  {["Time", "Page", "Action", "Detail"].map(h => (
                    <th key={h} className="border-b-2 border-paper-line px-3 py-3 text-left align-top text-[17px] uppercase tracking-wide text-ink-soft">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {S.records.map((r, ri) => (
                  <tr key={ri}>
                    <td className="border-b border-paper-line px-3 py-3 align-top">{r.time}</td>
                    <td className="border-b border-paper-line px-3 py-3 align-top">
                      <span className="inline-block rounded-full bg-pastel-sky px-3 py-1 text-base font-extrabold">{r.page}</span>
                    </td>
                    <td className="border-b border-paper-line px-3 py-3 align-top">{r.action}</td>
                    <td className="border-b border-paper-line px-3 py-3 align-top">{r.detail}</td>
                  </tr>
                ))}
                {S.records.length === 0 ? (
                  <tr><td colSpan={4} className="px-3 py-3">No records yet.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  const pages: Record<string, () => React.ReactNode> = {
    home: renderHome, scam: renderScam, vault: renderVault, roast: renderRoast,
    ask: renderAsk, quiz: renderQuiz, records: renderRecords,
  };

  return (
    <div className="flex min-h-screen max-[1100px]:flex-col">
      {/* Sidebar: every section, one tap, always visible */}
      <aside className="glass-strong sticky top-0 flex h-screen w-[330px] shrink-0 flex-col gap-3 overflow-y-auto p-5 max-[1100px]:static max-[1100px]:h-auto max-[1100px]:w-full">
        <div className="flex items-center gap-3 px-1 pb-2 pt-1">
          <Image src="/assets/asset-shield.webp" alt="CyberShield Arena shield" width={72} height={72}
            className="h-[72px] w-[72px] rounded-[18px] bg-white object-contain p-1" />
          <div>
            <h1 className="headline text-[26px]">CyberShield Arena</h1>
            <small className="text-[15px] text-ink-soft">Students vs AI</small>
            <div>
              <span className="mt-1 inline-block rounded-full bg-sun px-3.5 py-1 text-[13px] font-extrabold tracking-wide text-ink shadow">
                DEMO: API NOT CONNECTED
              </span>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-3">
          {PAGES.map(p => (
            <button
              key={p.id}
              onClick={() => navTo(p.id)}
              className={`flex min-h-[72px] w-full items-center gap-3 rounded-[18px] px-4 text-left text-[21px] font-bold transition-all active:scale-[.98] ${
                S.page === p.id
                  ? "bg-ink text-cream shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                  : "sticker-soft text-ink hover:-translate-y-0.5"
              }`}
            >
              {ICONIMG[p.id]
                ? <Image src={ICONIMG[p.id]} alt="" width={44} height={44} className="h-11 w-11 rounded-xl bg-white object-contain p-0.5" />
                : <span className="text-[26px]">{p.icon}</span>}
              {t(p.id)}
            </button>
          ))}
        </nav>

        <div className="flex-1" />
        <div className="flex gap-2">
          <button onClick={() => setLang("en")}
            className={`min-h-[72px] flex-1 rounded-[16px] text-[19px] font-extrabold active:scale-[.98] ${
              lang === "en" ? "bg-ink text-cream" : "sticker-soft"}`}>EN</button>
          <button onClick={() => setLang("my")}
            className={`min-h-[72px] flex-1 rounded-[16px] text-[19px] font-extrabold active:scale-[.98] ${
              lang === "my" ? "bg-ink text-cream" : "sticker-soft"}`}>မြန်မာ</button>
        </div>
        <button onClick={resetAll}
          className="min-h-[72px] rounded-[16px] bg-[#fdecec] px-4 text-[18px] font-extrabold text-[#b3261e] shadow-[0_6px_16px_rgba(0,0,0,0.08)] active:scale-[.98]">
          Reset all records
        </button>
      </aside>

      {/* Main column */}
      <main className="min-w-0 flex-1 px-7 pb-10 pt-6">
        <div className="mb-6 flex flex-wrap items-stretch gap-4">
          <div className="sticker flex min-w-[280px] flex-1 items-center justify-between px-6 py-4">
            <div>
              <div className="text-[22px] font-bold text-ink-soft">{t("students")}</div>
              <div className="text-[60px] font-black leading-none text-leaf-deep">{S.scores.students}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => adj("students", -1)} aria-label="Students minus"
                className="h-[72px] w-[72px] rounded-2xl bg-cream text-[30px] font-black shadow active:scale-95">−</button>
              <button onClick={() => adj("students", 1)} aria-label="Students plus"
                className="h-[72px] w-[72px] rounded-2xl bg-pastel-mint text-[30px] font-black shadow active:scale-95">+</button>
            </div>
          </div>
          <div className="sticker flex min-w-[280px] flex-1 items-center justify-between px-6 py-4">
            <div>
              <div className="text-[22px] font-bold text-ink-soft">AI</div>
              <div className="text-[60px] font-black leading-none text-[#2f7fc4]">{S.scores.ai}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => adj("ai", -1)} aria-label="AI minus"
                className="h-[72px] w-[72px] rounded-2xl bg-cream text-[30px] font-black shadow active:scale-95">−</button>
              <button onClick={() => adj("ai", 1)} aria-label="AI plus"
                className="h-[72px] w-[72px] rounded-2xl bg-pastel-sky text-[30px] font-black shadow active:scale-95">+</button>
            </div>
          </div>
          <div className="sticker flex items-center gap-3 px-6 py-4 text-[19px] text-ink-soft">
            <span>{t("usage")}</span> <b className="text-[23px] text-ink">{S.usage.calls}</b>
            <span>·</span> <span>{t("tokens")}</span> <b className="text-[23px] text-ink">{S.usage.tokens.toLocaleString()}</b>
            <span>·</span>
            <span className="rounded-full bg-pastel-lilac px-3.5 py-1 text-[14px] font-extrabold tracking-wide text-ink">
              BACKUP ANSWERS
            </span>
          </div>
        </div>

        {/* Game layer: rank, Shield Points bar and streak, visible everywhere */}
        {(() => {
          const rf = rankFor(S.game.xp);
          const pct = rf.next ? Math.min(100, Math.round((rf.into / rf.span) * 100)) : 100;
          return (
            <div className="sticker mb-6 flex flex-wrap items-center gap-5 px-6 py-4">
              <div className="stamp-badge flex h-[84px] w-[84px] shrink-0 flex-col items-center justify-center rounded-full border-4 border-dashed border-ink/25 bg-sun text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
                <span className="text-[34px] leading-none">{rf.rank.icon}</span>
              </div>
              <div className="min-w-[300px] flex-1">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-[28px] font-black">{lang === "my" ? rf.rank.my : rf.rank.en}</span>
                  <span className="text-[21px] font-bold text-ink-soft">
                    🛡 {S.game.xp} {t("shieldPoints")}
                  </span>
                  {S.game.streak >= 2 ? (
                    <span className="rounded-full bg-[#ffe3c2] px-4 py-1.5 text-[19px] font-extrabold text-[#9a4d00]">
                      🔥 {t("streak")} ×{S.game.streak}
                    </span>
                  ) : null}
                  {S.game.bestStreak >= 3 ? (
                    <span className="rounded-full bg-cream px-4 py-1.5 text-[17px] font-extrabold text-ink-soft">
                      {t("bestStreak")} 🔥 ×{S.game.bestStreak}
                    </span>
                  ) : null}
                </div>
                <div className="mt-2.5 h-[22px] overflow-hidden rounded-full border border-paper-line bg-cream-deep">
                  <div className="xp-fill h-full rounded-full" style={{ width: pct + "%" }} />
                </div>
                <div className="mt-1.5 text-[17px] font-bold text-ink-soft">
                  {rf.next
                    ? <>{rf.next.at - S.game.xp} {t("xpToNext")}: {lang === "my" ? rf.next.my : rf.next.en}</>
                    : <>{t("maxRank")} 👑</>}
                </div>
              </div>
            </div>
          );
        })()}

        {(pages[S.page] || renderHome)()}

        <div className="relative mt-10 overflow-hidden rounded-[26px] shadow-[0_10px_28px_rgba(0,0,0,0.10)]">
          <Hills className="block h-[150px] w-full" />
          <div className="absolute inset-x-0 bottom-3 text-center text-[19px] font-extrabold text-white"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,.35)" }}>
            CyberShield Arena · Stop · Check · Do not share · Report
          </div>
        </div>
      </main>

      {/* Level-up celebration: scrapbook stamp + paper confetti, one big tap away */}
      {celeb !== null ? (() => {
        const r = rankFor(S.game.xp);
        const confetti = ["#f5b8d0", "#bfe3f5", "#c8f0d8", "#fff3b0", "#c2b3f3", "#c0e83d"];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-6" role="dialog" aria-modal="true">
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
            <div className="sticker celeb-pop relative w-full max-w-[620px] p-10 text-center">
              <span className="tape" />
              <div className="text-[26px] font-black uppercase tracking-widest text-ink-soft">{t("levelUp")}</div>
              <div className="stamp-in mx-auto mt-6 flex h-[190px] w-[190px] flex-col items-center justify-center rounded-full border-[6px] border-dashed border-ink/30 bg-sun shadow-[0_14px_34px_rgba(0,0,0,0.22)]">
                <span className="text-[84px] leading-none">{r.rank.icon}</span>
                <span className="mt-2 px-3 text-[21px] font-black leading-tight">{lang === "my" ? r.rank.my : r.rank.en}</span>
              </div>
              <div className="mt-6 text-[24px] font-bold text-ink-soft">
                {t("newRank")} · 🛡 {S.game.xp} {t("shieldPoints")}
              </div>
              <button
                onClick={() => setCeleb(null)}
                className="mt-8 min-h-[84px] w-full rounded-full bg-ink px-9 text-[27px] font-extrabold text-cream shadow-[0_10px_24px_rgba(0,0,0,0.20)] active:scale-[.97]"
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
