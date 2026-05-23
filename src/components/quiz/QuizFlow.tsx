"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getCookieBySlug } from "@/data/cookies";
import { EASE_PREMIUM } from "@/lib/utils";

type Phase = "intro" | "q1" | "q2" | "q3" | "q4" | "calculating" | "result";

// ── Scoring system ────────────────────────────────────────────────────────────
const SCORES: Record<string, Record<string, number>> = {
  q1_a: { softspot: 3, habit: 2, lotus: 2, oreo: 1 },
  q1_b: { redflag: 2, blackout: 2, flex: 2, "berry-trouble": 2 },
  q1_c: { nightshift: 3, "barely-legal": 2, hazel: 1, pistachio: 1 },
  q1_d: { walnut: 2, golden: 2, salt: 2, chocolate: 2 },
  q2_a: { softspot: 2, lotus: 2, golden: 1, walnut: 1 },
  q2_b: { "matcha-kiss": 3, pistachio: 2, "peel-me-slow": 2, "clean-cheat": 1, "vegan-vice": 1 },
  q2_c: { redflag: 2, "berry-trouble": 2, oreo: 3, flex: 1 },
  q2_d: { chocolate: 2, salt: 2, hazel: 2, walnut: 1 },
  q3_a: { redflag: 3, blackout: 3, "barely-legal": 2, nightshift: 1 },
  q3_b: { "peel-me-slow": 3, "berry-trouble": 2, "matcha-kiss": 1 },
  q3_c: { "barely-legal": 2, flex: 3, hazel: 2, chocolate: 1, salt: 1 },
  q3_d: { "clean-cheat": 3, "vegan-vice": 3 },
  q4_a: { nightshift: 2, habit: 2, softspot: 1, walnut: 1 },
  q4_b: { redflag: 2, flex: 2, "barely-legal": 1, oreo: 1 },
  q4_c: { "matcha-kiss": 2, golden: 2, pistachio: 1, "peel-me-slow": 1 },
  q4_d: { blackout: 2, "berry-trouble": 2, lotus: 1, salt: 1 },
};

function computeResult(answers: string[]): string {
  const totals: Record<string, number> = {};
  for (const key of answers) {
    for (const [slug, pts] of Object.entries(SCORES[key] ?? {})) {
      totals[slug] = (totals[slug] ?? 0) + pts;
    }
  }
  let best = "chocolate";
  let bestScore = -1;
  for (const [slug, score] of Object.entries(totals)) {
    if (score > bestScore) { bestScore = score; best = slug; }
  }
  return best;
}

// ── Per-question decorative cookies (floating in background) ──────────────────
const Q_BG_COOKIES: Record<string, { slug: string; side: "left" | "right"; top: string; size: number; rotate: number }[]> = {
  q1: [
    { slug: "blackout",  side: "right", top: "18%", size: 180, rotate: 14  },
    { slug: "softspot",  side: "left",  top: "62%", size: 130, rotate: -18 },
  ],
  q2: [
    { slug: "lotus",      side: "left",  top: "15%", size: 170, rotate: -12 },
    { slug: "matcha-kiss",side: "right", top: "60%", size: 135, rotate: 20  },
  ],
  q3: [
    { slug: "redflag",    side: "right", top: "14%", size: 175, rotate: 16  },
    { slug: "peel-me-slow",side:"left",  top: "64%", size: 130, rotate: -16 },
  ],
  q4: [
    { slug: "flex",       side: "left",  top: "16%", size: 170, rotate: -10 },
    { slug: "oreo",       side: "right", top: "62%", size: 135, rotate: 18  },
  ],
};

// ── Phase config ──────────────────────────────────────────────────────────────
const PHASE_ACCENT: Partial<Record<Phase, string>> = {
  intro:       "#AF5950",
  q1:          "#C79A5B",
  q2:          "#4D7792",
  q3:          "#AF5950",
  q4:          "#6BA876",
  calculating: "#AF5950",
  result:      "#AF5950",
};

const PHASE_BLOB_COLOR: Partial<Record<Phase, string>> = {
  intro:       "#5A1A10",
  q1:          "#4A3008",
  q2:          "#0A1E34",
  q3:          "#3A1010",
  q4:          "#0A2214",
  calculating: "#1A1010",
  result:      "#5A1A10",
};

const TOTAL_QUESTIONS = 4;

// ── Floating cookie decoration (used in bg of question screens) ───────────────
function FloatingCookie({
  slug,
  side,
  top,
  size,
  rotate,
  reducedMotion,
  floatDir,
}: {
  slug: string;
  side: "left" | "right";
  top: string;
  size: number;
  rotate: number;
  reducedMotion: boolean;
  floatDir: number;
}) {
  const cookie = getCookieBySlug(slug);
  if (!cookie) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: rotate * 1.6, x: side === "left" ? -60 : 60 }}
      animate={{ opacity: 1, scale: 1, rotate, x: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.15 }}
      className="pointer-events-none absolute hidden sm:block"
      style={{
        [side]: "-4%",
        top,
        width: size,
        height: size,
        opacity: 0.13,
      }}
    >
      <motion.div
        animate={reducedMotion ? {} : { y: [0, floatDir * 14, 0] }}
        transition={{ duration: 5 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full"
      >
        <Image src={cookie.image} alt="" fill className="object-contain" sizes="200px" />
      </motion.div>
    </motion.div>
  );
}

// ── Intro Screen ──────────────────────────────────────────────────────────────
function IntroScreen({ onStart, reducedMotion }: { onStart: () => void; reducedMotion: boolean }) {
  const t = useTranslations("quiz");
  const titleLines = t("title").split("\n");
  const blurSize = reducedMotion ? "blur(28px)" : "blur(110px)";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-28 text-center">
      {/* Background blobs */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[56vw] w-[56vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35"
        style={{ backgroundColor: "#AF5950", filter: blurSize }} />
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-[28vw] w-[28vw] rounded-full opacity-15"
        style={{ backgroundColor: "#C79A5B", filter: reducedMotion ? "blur(20px)" : "blur(70px)" }} />

      {/* Dot grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{ backgroundImage: "radial-gradient(circle,#FFFDF8 1.5px,transparent 1.5px)", backgroundSize: "26px 26px" }} />

      {/* Floating cookie decorations (desktop) */}
      {!reducedMotion && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -80, rotate: -20 }}
            animate={{ opacity: 0.12, x: 0, rotate: -12 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100, damping: 18 }}
            className="pointer-events-none absolute -left-6 top-[22%] hidden w-[200px] sm:block"
          >
            <motion.div animate={{ y: [-8, 8, -8] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <Image src="/assets/cookies/cookie-barelylegal.png" alt="" width={200} height={200} className="object-contain drop-shadow-xl" />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 80, rotate: 20 }}
            animate={{ opacity: 0.1, x: 0, rotate: 14 }}
            transition={{ delay: 1.0, type: "spring", stiffness: 100, damping: 18 }}
            className="pointer-events-none absolute -right-4 bottom-[20%] hidden w-[160px] sm:block"
          >
            <motion.div animate={{ y: [8, -8, 8] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
              <Image src="/assets/cookies/cookie-redflag.png" alt="" width={160} height={160} className="object-contain drop-shadow-xl" />
            </motion.div>
          </motion.div>
        </>
      )}

      {/* Watermark */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
        <span className="font-display font-black italic leading-none text-crunkie-white/[0.025]"
          style={{ fontSize: "clamp(8rem,22vw,20rem)", whiteSpace: "nowrap" }}>CRUNKIE</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: EASE_PREMIUM }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-crunkie-red/30 bg-crunkie-red/10 px-4 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-crunkie-red" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-crunkie-red">The Quiz</span>
        </motion.div>

        {/* Title */}
        <div className="mb-6">
          {titleLines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease: EASE_PREMIUM }}
                className={`block font-display font-black leading-[0.88] ${i === 1 ? "italic text-crunkie-red" : "text-crunkie-white"}`}
                style={{ fontSize: "clamp(3.2rem,9.5vw,7.5rem)" }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Wavy underline */}
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.65, duration: 0.55, ease: EASE_PREMIUM }} style={{ originX: 0.5 }} className="mb-7">
          <svg width="190" height="12" viewBox="0 0 190 12" fill="none">
            <path d="M2 6C15 2 30 10 48 6S76 2 95 6 124 10 142 6s32-4 46 0"
              stroke="#AF5950" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.7, ease: EASE_PREMIUM }}
          className="mb-10 font-sans text-base text-crunkie-cream/55 lg:text-lg">
          {t("subtitle")}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.7, ease: EASE_PREMIUM }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
          onClick={onStart}
          className="rounded-full bg-crunkie-red px-12 py-4 font-sans text-sm font-bold uppercase tracking-[0.24em] text-crunkie-white shadow-lg shadow-crunkie-red/35 transition-shadow hover:shadow-xl hover:shadow-crunkie-red/45"
        >
          {t("start")} →
        </motion.button>
      </motion.div>
    </div>
  );
}

// ── Question Screen ───────────────────────────────────────────────────────────
const OPTION_ACCENTS = ["#AF5950", "#C79A5B", "#4D7792", "#6BA876"];

function QuestionScreen({
  qKey,
  phaseNum,
  options,
  phaseAccent,
  onSelect,
  reducedMotion,
}: {
  qKey: "q1" | "q2" | "q3" | "q4";
  phaseNum: number;
  options: { value: string; emoji: string; labelKey: string }[];
  phaseAccent: string;
  onSelect: (answerKey: string) => void;
  reducedMotion: boolean;
}) {
  const t = useTranslations("quiz");
  const [selected, setSelected] = useState<string | null>(null);
  const bgCookies = Q_BG_COOKIES[qKey] ?? [];

  const handleSelect = useCallback((value: string) => {
    if (selected) return;
    setSelected(value);
    setTimeout(() => onSelect(`${qKey}_${value}`), 400);
  }, [selected, onSelect, qKey]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-24">
      {/* Dot grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: "radial-gradient(circle,#FFFDF8 1.5px,transparent 1.5px)", backgroundSize: "26px 26px" }} />

      {/* Ghost question number */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
        <span className="font-display font-black leading-none"
          style={{ fontSize: "clamp(16rem,42vw,36rem)", color: `${phaseAccent}07` }}>
          {String(phaseNum).padStart(2, "0")}
        </span>
      </div>

      {/* Background floating cookie decorations */}
      {bgCookies.map((c, i) => (
        <FloatingCookie
          key={c.slug}
          slug={c.slug}
          side={c.side}
          top={c.top}
          size={c.size}
          rotate={c.rotate}
          reducedMotion={reducedMotion}
          floatDir={i % 2 === 0 ? 1 : -1}
        />
      ))}

      <div className="relative z-10 mx-auto w-full max-w-lg">
        {/* Progress */}
        <div className="mb-10 flex items-center justify-center gap-3">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
            <motion.div key={i}
              animate={{ width: i + 1 === phaseNum ? 32 : 8, backgroundColor: i + 1 <= phaseNum ? phaseAccent : "#FFFDF820" }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="h-[5px] rounded-full"
            />
          ))}
          <span className="ml-1 font-sans text-[10px] font-bold tracking-widest text-crunkie-cream/25">
            {phaseNum}/{TOTAL_QUESTIONS}
          </span>
        </div>

        {/* Question */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.55, ease: EASE_PREMIUM }}
          className="mb-8 text-center font-display font-black leading-tight text-crunkie-white"
          style={{ fontSize: "clamp(1.6rem,4.5vw,2.6rem)" }}
        >
          {t(`${qKey}.question` as any)}
        </motion.h2>

        {/* Option cards */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => {
            const isSelected = selected === opt.value;
            const isDimmed = selected !== null && !isSelected;
            const accent = OPTION_ACCENTS[i];

            return (
              <motion.button
                key={opt.value}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 22 }}
                animate={{ opacity: isDimmed ? 0.38 : 1, y: 0 }}
                transition={{ delay: reducedMotion ? 0 : 0.08 + i * 0.06, duration: 0.42, ease: EASE_PREMIUM }}
                whileHover={!selected && !reducedMotion ? { scale: 1.03, y: -3 } : {}}
                whileTap={!selected ? { scale: 0.96 } : {}}
                onClick={() => handleSelect(opt.value)}
                className="relative flex min-h-[152px] flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border p-5 text-center transition-colors duration-200"
                style={{
                  borderColor: isSelected ? accent : "rgba(255,255,255,0.09)",
                  backgroundColor: isSelected ? `${accent}20` : "rgba(255,255,255,0.05)",
                }}
              >
                {/* Subtle top accent stripe on selected */}
                {isSelected && (
                  <motion.div
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                    transition={{ duration: 0.28 }}
                    className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
                    style={{ backgroundColor: accent, originX: 0 }}
                  />
                )}

                {/* Checkmark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: accent }}
                  >
                    <span className="text-[9px] font-black text-crunkie-dark">✓</span>
                  </motion.div>
                )}

                {/* Emoji */}
                <span className="text-5xl leading-none">{opt.emoji}</span>

                {/* Label */}
                <span className="font-sans text-sm leading-snug text-crunkie-cream/75">
                  {t(`${qKey}.${opt.labelKey}` as any)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Calculating Screen ────────────────────────────────────────────────────────
function CalculatingScreen({ reducedMotion }: { reducedMotion: boolean }) {
  const t = useTranslations("quiz");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <motion.div
        animate={reducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        className="text-7xl"
      >
        🍪
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-display font-black italic text-crunkie-cream/60"
        style={{ fontSize: "clamp(1.1rem,3vw,1.6rem)" }}
      >
        {t("calculating")}
      </motion.p>
      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.22 }}
            className="h-2 w-2 rounded-full bg-crunkie-red"
          />
        ))}
      </div>
    </div>
  );
}

// ── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({
  slug,
  onRestart,
  reducedMotion,
}: {
  slug: string;
  onRestart: () => void;
  reducedMotion: boolean;
}) {
  const t = useTranslations("quiz");
  const cookie = getCookieBySlug(slug);
  const [copied, setCopied] = useState(false);
  const blurSize = reducedMotion ? "blur(28px)" : "blur(100px)";

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const text = `I'm a ${cookie?.name ?? "Crunkie"} — which one are you? 🍪`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: "Which Crunkie Are You?", text, url }); } catch { /* cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch { /* unavailable */ }
    }
  }, [cookie]);

  if (!cookie) return null;

  const tagline = t(`results.${slug}.tagline` as any);
  const personality = t(`results.${slug}.personality` as any);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-[55vw] w-[55vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-28"
        style={{ backgroundColor: "#AF5950", filter: blurSize }} />
      <div aria-hidden className="pointer-events-none absolute right-0 bottom-0 h-[32vw] w-[32vw] rounded-full opacity-14"
        style={{ backgroundColor: "#C79A5B", filter: reducedMotion ? "blur(20px)" : "blur(80px)" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: "radial-gradient(circle,#FFFDF8 1.5px,transparent 1.5px)", backgroundSize: "26px 26px" }} />

      <div className="relative z-10 mx-auto max-w-xl px-6 pb-24 pt-28 text-center">
        {/* You are label */}
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.34em] text-crunkie-cream/38">
          {t("youAre")}
        </motion.p>

        {/* Cookie name */}
        <div className="mb-3 overflow-hidden">
          <motion.h1 initial={{ y: "110%" }} animate={{ y: "0%" }}
            transition={{ delay: 0.18, duration: 0.85, ease: EASE_PREMIUM }}
            className="font-display font-black leading-[0.88] text-crunkie-white"
            style={{ fontSize: "clamp(3rem,11vw,7.5rem)" }}>
            {cookie.name}
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-8 font-display text-xl font-black italic text-crunkie-red lg:text-2xl">
          {tagline}
        </motion.p>

        {/* Cookie image */}
        <motion.div
          initial={{ scale: 0.45, opacity: 0, rotate: -18 }}
          animate={{ scale: 1, opacity: 1, rotate: reducedMotion ? 0 : -5 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 18 }}
          className="mx-auto mb-8 h-60 w-60 md:h-80 md:w-80"
        >
          <motion.div
            animate={reducedMotion ? {} : { y: [-12, 12, -12] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image src={cookie.image} alt={cookie.name} fill priority
              className="object-contain drop-shadow-2xl"
              sizes="(max-width:768px) 240px,320px" />
          </motion.div>
        </motion.div>

        {/* Personality */}
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: EASE_PREMIUM }}
          className="mx-auto mb-8 max-w-sm font-sans text-base leading-relaxed text-crunkie-cream/60 lg:text-lg">
          {personality}
        </motion.p>

        {/* Flavor pills */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.62 }}
          className="mb-10 flex flex-wrap justify-center gap-2">
          {cookie.flavorNotes.map((note, i) => (
            <motion.span key={note}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + i * 0.07, type: "spring", bounce: 0.35 }}
              className="rounded-full border border-crunkie-cream/10 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-crunkie-cream/40">
              {note}
            </motion.span>
          ))}
          {cookie.isVegan && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + cookie.flavorNotes.length * 0.07, type: "spring", bounce: 0.35 }}
              className="rounded-full border border-[#6BA876]/30 bg-[#6BA876]/10 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-[#6BA876]">
              Vegan
            </motion.span>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.6, ease: EASE_PREMIUM }}
          className="flex flex-col items-center gap-3">
          <button onClick={handleShare}
            className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-crunkie-red px-8 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.18em] text-crunkie-white shadow-lg shadow-crunkie-red/30 transition-all hover:scale-105 hover:shadow-xl active:scale-95">
            {copied ? t("shareFallback") : t("share")}
            <span>{copied ? "✓" : "↗"}</span>
          </button>

          <Link href={`/cookies/${slug}`}
            className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full border-2 border-crunkie-cream/12 px-8 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.18em] text-crunkie-cream/50 transition-all hover:border-crunkie-red hover:text-crunkie-white active:scale-95">
            {t("viewCookie")} →
          </Link>

          <button onClick={onRestart}
            className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-crunkie-cream/22 transition-colors hover:text-crunkie-cream/50">
            {t("restart")}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ── Question data ─────────────────────────────────────────────────────────────
const QUESTIONS: { qKey: "q1" | "q2" | "q3" | "q4"; phase: Phase; phaseNum: number; options: { value: string; emoji: string; labelKey: string }[] }[] = [
  {
    qKey: "q1", phase: "q1", phaseNum: 1,
    options: [
      { value: "a", emoji: "🎬", labelKey: "a" },
      { value: "b", emoji: "🎉", labelKey: "b" },
      { value: "c", emoji: "☕", labelKey: "c" },
      { value: "d", emoji: "😴", labelKey: "d" },
    ],
  },
  {
    qKey: "q2", phase: "q2", phaseNum: 2,
    options: [
      { value: "a", emoji: "🛋️", labelKey: "a" },
      { value: "b", emoji: "🌿", labelKey: "b" },
      { value: "c", emoji: "🎨", labelKey: "c" },
      { value: "d", emoji: "🍳", labelKey: "d" },
    ],
  },
  {
    qKey: "q3", phase: "q3", phaseNum: 3,
    options: [
      { value: "a", emoji: "🌶️", labelKey: "a" },
      { value: "b", emoji: "🍋", labelKey: "b" },
      { value: "c", emoji: "🍫", labelKey: "c" },
      { value: "d", emoji: "🌱", labelKey: "d" },
    ],
  },
  {
    qKey: "q4", phase: "q4", phaseNum: 4,
    options: [
      { value: "a", emoji: "🎵", labelKey: "a" },
      { value: "b", emoji: "🎭", labelKey: "b" },
      { value: "c", emoji: "🌸", labelKey: "c" },
      { value: "d", emoji: "💥", labelKey: "d" },
    ],
  },
];

// ── Main QuizFlow ─────────────────────────────────────────────────────────────
export function QuizFlow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px),(prefers-reduced-motion:reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-advance from calculating → result
  useEffect(() => {
    if (phase !== "calculating") return;
    const t = setTimeout(() => {
      setResult(computeResult(answers));
      setPhase("result");
    }, 900);
    return () => clearTimeout(t);
  }, [phase, answers]);

  const handleStart = useCallback(() => setPhase("q1"), []);

  const handleAnswer = useCallback((answerKey: string, nextPhase: Phase) => {
    setAnswers((prev) => {
      const next = [...prev, answerKey];
      // if last question, go to calculating
      if (nextPhase === "calculating") {
        setTimeout(() => setPhase("calculating"), 0);
      } else {
        setPhase(nextPhase);
      }
      return next;
    });
  }, []);

  const handleRestart = useCallback(() => {
    setAnswers([]);
    setResult(null);
    setPhase("intro");
  }, []);

  const accent = PHASE_ACCENT[phase] ?? "#AF5950";
  const blobColor = PHASE_BLOB_COLOR[phase] ?? "#3A1010";

  const slideVariants = {
    enter: { opacity: 0, x: reducedMotion ? 0 : 44 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: reducedMotion ? 0 : -44 },
  };

  return (
    <div className="min-h-screen text-crunkie-white" style={{ backgroundColor: "#1F1714" }}>
      {/* Static background blob */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute left-1/4 top-1/4 rounded-full transition-colors duration-700"
          style={{
            width: "52vw", height: "52vw",
            backgroundColor: blobColor,
            filter: reducedMotion ? "blur(30px)" : "blur(90px)",
            opacity: 0.65,
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div key="intro" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.32, ease: EASE_PREMIUM }}>
              <IntroScreen onStart={handleStart} reducedMotion={reducedMotion} />
            </motion.div>
          )}

          {QUESTIONS.map((q, qi) =>
            phase === q.phase ? (
              <motion.div key={q.phase} variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.32, ease: EASE_PREMIUM }}>
                <QuestionScreen
                  qKey={q.qKey}
                  phaseNum={q.phaseNum}
                  options={q.options}
                  phaseAccent={PHASE_ACCENT[q.phase] ?? "#AF5950"}
                  onSelect={(key) => handleAnswer(key, QUESTIONS[qi + 1]?.phase ?? "calculating")}
                  reducedMotion={reducedMotion}
                />
              </motion.div>
            ) : null
          )}

          {phase === "calculating" && (
            <motion.div key="calculating" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.32, ease: EASE_PREMIUM }}>
              <CalculatingScreen reducedMotion={reducedMotion} />
            </motion.div>
          )}

          {phase === "result" && result && (
            <motion.div key="result" variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.32, ease: EASE_PREMIUM }}>
              <ResultScreen slug={result} onRestart={handleRestart} reducedMotion={reducedMotion} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
