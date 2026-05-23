"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { getCookieBySlug } from "@/data/cookies";
import { EASE_PREMIUM } from "@/lib/utils";

type Q1Val = "night" | "social" | "focused" | "grounded";
type Q2Val = "cozy" | "mindful" | "adventurous" | "generous";
type Q3Val = "intense" | "fresh" | "elevated" | "clean";
type Phase = "intro" | "q1" | "q2" | "q3" | "result";

const RESULT_MAP: Record<string, string> = {
  "night-cozy-intense": "blackout",
  "night-cozy-fresh": "peel-me-slow",
  "night-cozy-elevated": "hazel",
  "night-cozy-clean": "vegan-vice",
  "night-mindful-intense": "nightshift",
  "night-mindful-fresh": "matcha-kiss",
  "night-mindful-elevated": "pistachio",
  "night-mindful-clean": "vegan-vice",
  "night-adventurous-intense": "barely-legal",
  "night-adventurous-fresh": "berry-trouble",
  "night-adventurous-elevated": "flex",
  "night-adventurous-clean": "vegan-vice",
  "night-generous-intense": "blackout",
  "night-generous-fresh": "hazel",
  "night-generous-elevated": "hazel",
  "night-generous-clean": "clean-cheat",
  "social-cozy-intense": "lotus",
  "social-cozy-fresh": "berry-trouble",
  "social-cozy-elevated": "oreo",
  "social-cozy-clean": "clean-cheat",
  "social-mindful-intense": "redflag",
  "social-mindful-fresh": "matcha-kiss",
  "social-mindful-elevated": "pistachio",
  "social-mindful-clean": "clean-cheat",
  "social-adventurous-intense": "redflag",
  "social-adventurous-fresh": "berry-trouble",
  "social-adventurous-elevated": "flex",
  "social-adventurous-clean": "vegan-vice",
  "social-generous-intense": "redflag",
  "social-generous-fresh": "peel-me-slow",
  "social-generous-elevated": "flex",
  "social-generous-clean": "vegan-vice",
  "focused-cozy-intense": "nightshift",
  "focused-cozy-fresh": "peel-me-slow",
  "focused-cozy-elevated": "barely-legal",
  "focused-cozy-clean": "vegan-vice",
  "focused-mindful-intense": "nightshift",
  "focused-mindful-fresh": "matcha-kiss",
  "focused-mindful-elevated": "pistachio",
  "focused-mindful-clean": "clean-cheat",
  "focused-adventurous-intense": "barely-legal",
  "focused-adventurous-fresh": "peel-me-slow",
  "focused-adventurous-elevated": "hazel",
  "focused-adventurous-clean": "vegan-vice",
  "focused-generous-intense": "nightshift",
  "focused-generous-fresh": "hazel",
  "focused-generous-elevated": "barely-legal",
  "focused-generous-clean": "clean-cheat",
  "grounded-cozy-intense": "lotus",
  "grounded-cozy-fresh": "golden",
  "grounded-cozy-elevated": "softspot",
  "grounded-cozy-clean": "clean-cheat",
  "grounded-mindful-intense": "walnut",
  "grounded-mindful-fresh": "matcha-kiss",
  "grounded-mindful-elevated": "pistachio",
  "grounded-mindful-clean": "clean-cheat",
  "grounded-adventurous-intense": "salt",
  "grounded-adventurous-fresh": "berry-trouble",
  "grounded-adventurous-elevated": "chocolate",
  "grounded-adventurous-clean": "vegan-vice",
  "grounded-generous-intense": "salt",
  "grounded-generous-fresh": "walnut",
  "grounded-generous-elevated": "habit",
  "grounded-generous-clean": "clean-cheat",
};

// Per-phase background blob colors
const PHASE_BLOBS: Record<Phase, { color: string; accent: string }> = {
  intro:  { color: "#6B2D1A", accent: "#AF5950" },
  q1:     { color: "#5A3A08", accent: "#C79A5B" },
  q2:     { color: "#0E2238", accent: "#4D7792" },
  q3:     { color: "#1A2A18", accent: "#6BA876" },
  result: { color: "#6B2D1A", accent: "#AF5950" },
};

const slideVariants = {
  enter: (rm: boolean) => ({ opacity: 0, x: rm ? 0 : 40 }),
  center: { opacity: 1, x: 0 },
  exit: (rm: boolean) => ({ opacity: 0, x: rm ? 0 : -40 }),
};

// ── Intro Screen ─────────────────────────────────────────────────────────────
function IntroScreen({ onStart, reducedMotion }: { onStart: () => void; reducedMotion: boolean }) {
  const t = useTranslations("quiz");
  const titleLines = t("title").split("\n");
  const blur1 = reducedMotion ? "blur(30px)" : "blur(120px)";
  const blur2 = reducedMotion ? "blur(20px)" : "blur(80px)";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* Background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vw] w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{ backgroundColor: "#AF5950", filter: blur1 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] rounded-full opacity-15"
        style={{ backgroundColor: "#C79A5B", filter: blur2 }}
      />

      {/* Watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span
          className="font-display font-black italic leading-none text-crunkie-white/[0.025]"
          style={{ fontSize: "clamp(8rem, 22vw, 20rem)", whiteSpace: "nowrap" }}
        >
          CRUNKIE
        </span>
      </div>

      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #FFFDF8 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_PREMIUM }}
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
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-crunkie-red">
            The Quiz
          </span>
        </motion.div>

        {/* Title */}
        <div className="mb-6 overflow-hidden">
          {titleLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease: EASE_PREMIUM }}
              className="block"
            >
              <span
                className={`block font-display font-black leading-[0.9] text-crunkie-white ${
                  i === 1 ? "italic text-crunkie-red" : ""
                }`}
                style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
              >
                {line}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Wavy underline */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.55, ease: EASE_PREMIUM }}
          style={{ originX: 0.5 }}
          className="mb-8"
        >
          <svg width="180" height="12" viewBox="0 0 180 12" fill="none">
            <path
              d="M2 6C14 2 28 10 45 6S72 2 90 6 118 10 135 6s30-4 43 0"
              stroke="#AF5950"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: EASE_PREMIUM }}
          className="mb-10 font-sans text-base text-crunkie-cream/60 lg:text-lg"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7, ease: EASE_PREMIUM }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="rounded-full bg-crunkie-red px-10 py-4 font-sans text-sm font-bold uppercase tracking-[0.22em] text-crunkie-white shadow-lg shadow-crunkie-red/30 transition-shadow hover:shadow-xl hover:shadow-crunkie-red/40"
        >
          {t("start")} →
        </motion.button>
      </motion.div>
    </div>
  );
}

// ── Question Screen ───────────────────────────────────────────────────────────
interface QuestionOption {
  value: string;
  emoji: string;
  labelKey: string;
}

function QuestionScreen({
  phaseNum,
  questionKey,
  options,
  accent,
  onSelect,
  reducedMotion,
}: {
  phaseNum: number;
  questionKey: string;
  options: QuestionOption[];
  accent: string;
  onSelect: (value: string) => void;
  reducedMotion: boolean;
}) {
  const t = useTranslations("quiz");
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = useCallback(
    (value: string) => {
      if (selected) return;
      setSelected(value);
      setTimeout(() => onSelect(value), 380);
    },
    [selected, onSelect]
  );

  const qKey = `q${phaseNum}` as "q1" | "q2" | "q3";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-24">
      {/* Ghost question number */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span
          className="font-display font-black leading-none"
          style={{ fontSize: "clamp(14rem, 38vw, 32rem)", color: `${accent}09` }}
        >
          {String(phaseNum).padStart(2, "0")}
        </span>
      </div>

      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: "radial-gradient(circle, #FFFDF8 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {[1, 2, 3].map((n) => (
            <motion.div
              key={n}
              animate={{
                width: n === phaseNum ? 28 : 8,
                backgroundColor: n === phaseNum ? accent : "#FFFDF820",
              }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="h-[6px] rounded-full"
            />
          ))}
        </div>

        {/* Question */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-8 text-center font-sans text-xs font-bold uppercase tracking-[0.3em] text-crunkie-cream/40"
        >
          {t(`${qKey}.question` as any)}
        </motion.p>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => {
            const isSelected = selected === opt.value;
            const isDimmed = selected !== null && !isSelected;

            return (
              <motion.button
                key={opt.value}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reducedMotion ? 0 : 0.1 + i * 0.07, duration: 0.4, ease: EASE_PREMIUM }}
                whileHover={!selected && !reducedMotion ? { scale: 1.02, y: -2 } : {}}
                whileTap={!selected ? { scale: 0.97 } : {}}
                onClick={() => handleSelect(opt.value)}
                className="relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300"
                style={{
                  borderColor: isSelected ? accent : "rgba(255,255,255,0.08)",
                  backgroundColor: isSelected
                    ? `${accent}18`
                    : "rgba(255,255,255,0.04)",
                  opacity: isDimmed ? 0.4 : 1,
                }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: accent }}
                  >
                    <span className="text-[9px] font-bold text-crunkie-dark">✓</span>
                  </motion.div>
                )}

                <span className="mb-3 block text-2xl">{opt.emoji}</span>
                <span className="block font-sans text-sm leading-snug text-crunkie-cream/80">
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
  const blur1 = reducedMotion ? "blur(30px)" : "blur(110px)";
  const blur2 = reducedMotion ? "blur(20px)" : "blur(90px)";

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const text = `I'm a ${cookie?.name ?? "Crunkie"} — which one are you? 🍪`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Which Crunkie Are You?", text, url });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        // clipboard unavailable
      }
    }
  }, [cookie]);

  if (!cookie) return null;

  const tagline = t(`results.${slug}.tagline` as any);
  const personality = t(`results.${slug}.personality` as any);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[55vw] w-[55vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25"
        style={{ backgroundColor: "#AF5950", filter: blur1 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 h-[35vw] w-[35vw] rounded-full opacity-15"
        style={{ backgroundColor: "#C79A5B", filter: blur2 }}
      />

      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: "radial-gradient(circle, #FFFDF8 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl px-6 pb-24 pt-28 text-center">
        {/* "You are" label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.32em] text-crunkie-cream/40"
        >
          {t("youAre")}
        </motion.p>

        {/* Cookie name */}
        <div className="mb-2 overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 0.18, duration: 0.85, ease: EASE_PREMIUM }}
            className="font-display font-black leading-[0.88] text-crunkie-white"
            style={{ fontSize: "clamp(3.2rem, 10vw, 7rem)" }}
          >
            {cookie.name}
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-10 font-display text-xl font-black italic text-crunkie-red lg:text-2xl"
        >
          {tagline}
        </motion.p>

        {/* Cookie image */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: reducedMotion ? 0 : -4 }}
          transition={{ delay: 0.22, type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto mb-10 h-56 w-56 md:h-72 md:w-72"
        >
          <motion.div
            animate={reducedMotion ? {} : { y: [-10, 10, -10] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image
              src={cookie.image}
              alt={cookie.name}
              fill
              priority
              className="object-contain drop-shadow-2xl"
              sizes="(max-width:768px) 224px, 288px"
            />
          </motion.div>
        </motion.div>

        {/* Personality */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: EASE_PREMIUM }}
          className="mx-auto mb-8 max-w-md font-sans text-base leading-relaxed text-crunkie-cream/65 lg:text-lg"
        >
          {personality}
        </motion.p>

        {/* Flavor pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.62 }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {cookie.flavorNotes.map((note, i) => (
            <motion.span
              key={note}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + i * 0.07, type: "spring", bounce: 0.35 }}
              className="rounded-full border border-crunkie-cream/12 bg-crunkie-cream/6 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-crunkie-cream/45"
            >
              {note}
            </motion.span>
          ))}
          {cookie.isVegan && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 + cookie.flavorNotes.length * 0.07, type: "spring", bounce: 0.35 }}
              className="rounded-full border border-[#6BA876]/30 bg-[#6BA876]/10 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-widest text-[#6BA876]"
            >
              Vegan
            </motion.span>
          )}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.6, ease: EASE_PREMIUM }}
          className="flex flex-col items-center gap-3"
        >
          {/* Share */}
          <button
            onClick={handleShare}
            className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-crunkie-red px-8 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.18em] text-crunkie-white shadow-lg shadow-crunkie-red/30 transition-all hover:scale-105 hover:shadow-xl active:scale-95"
          >
            {copied ? t("shareFallback") : t("share")}
            <span>{copied ? "✓" : "↗"}</span>
          </button>

          {/* View cookie */}
          <Link
            href={`/cookies/${slug}`}
            className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full border-2 border-crunkie-cream/14 px-8 py-3.5 font-sans text-sm font-bold uppercase tracking-[0.18em] text-crunkie-cream/55 transition-all hover:border-crunkie-red hover:text-crunkie-white active:scale-95"
          >
            {t("viewCookie")} →
          </Link>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="mt-2 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-crunkie-cream/25 transition-colors hover:text-crunkie-cream/50"
          >
            {t("restart")}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ── Main QuizFlow ─────────────────────────────────────────────────────────────
const Q1_OPTIONS: QuestionOption[] = [
  { value: "night", emoji: "🎬", labelKey: "a" },
  { value: "social", emoji: "🎉", labelKey: "b" },
  { value: "focused", emoji: "☕", labelKey: "c" },
  { value: "grounded", emoji: "😴", labelKey: "d" },
];

const Q2_OPTIONS: QuestionOption[] = [
  { value: "cozy", emoji: "🛋️", labelKey: "a" },
  { value: "mindful", emoji: "🌿", labelKey: "b" },
  { value: "adventurous", emoji: "🎨", labelKey: "c" },
  { value: "generous", emoji: "🍳", labelKey: "d" },
];

const Q3_OPTIONS: QuestionOption[] = [
  { value: "intense", emoji: "🌶️", labelKey: "a" },
  { value: "fresh", emoji: "🍋", labelKey: "b" },
  { value: "elevated", emoji: "🍫", labelKey: "c" },
  { value: "clean", emoji: "🌱", labelKey: "d" },
];

export function QuizFlow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<[Q1Val?, Q2Val?, Q3Val?]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const blob = PHASE_BLOBS[phase];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px), (prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleStart = useCallback(() => setPhase("q1"), []);

  const handleQ1 = useCallback((val: string) => {
    setAnswers([val as Q1Val]);
    setPhase("q2");
  }, []);

  const handleQ2 = useCallback(
    (val: string) => {
      setAnswers([answers[0], val as Q2Val]);
      setPhase("q3");
    },
    [answers]
  );

  const handleQ3 = useCallback(
    (val: string) => {
      setAnswers([answers[0], answers[1], val as Q3Val]);
      setPhase("result");
    },
    [answers]
  );

  const handleRestart = useCallback(() => {
    setAnswers([]);
    setPhase("intro");
  }, []);

  const resultSlug =
    phase === "result" && answers[0] && answers[1] && answers[2]
      ? RESULT_MAP[`${answers[0]}-${answers[1]}-${answers[2]}`] ?? "chocolate"
      : null;

  return (
    <motion.div
      animate={{ backgroundColor: "#1F1714" }}
      className="min-h-screen text-crunkie-white"
      style={{ backgroundColor: "#1F1714" }}
    >
      {/* Background blob — no AnimatePresence on mobile to avoid repaint cost */}
      {reducedMotion ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <div
            className="absolute left-1/4 top-1/4 rounded-full"
            style={{
              width: "50vw",
              height: "50vw",
              backgroundColor: blob.color,
              filter: "blur(30px)",
              opacity: 0.5,
            }}
          />
        </div>
      ) : (
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${phase}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            aria-hidden
            className="pointer-events-none fixed inset-0 overflow-hidden"
            style={{ zIndex: 0 }}
          >
            <div
              className="absolute left-1/4 top-1/4 rounded-full"
              style={{
                width: "50vw",
                height: "50vw",
                backgroundColor: blob.color,
                filter: "blur(100px)",
                opacity: 0.7,
              }}
            />
          </motion.div>
        </AnimatePresence>
      )}

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            custom={reducedMotion}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
          >
            <IntroScreen onStart={handleStart} reducedMotion={reducedMotion} />
          </motion.div>
        )}

        {phase === "q1" && (
          <motion.div
            key="q1"
            custom={reducedMotion}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
          >
            <QuestionScreen
              phaseNum={1}
              questionKey="q1"
              options={Q1_OPTIONS}
              accent={PHASE_BLOBS.q1.accent}
              onSelect={handleQ1}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        )}

        {phase === "q2" && (
          <motion.div
            key="q2"
            custom={reducedMotion}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
          >
            <QuestionScreen
              phaseNum={2}
              questionKey="q2"
              options={Q2_OPTIONS}
              accent={PHASE_BLOBS.q2.accent}
              onSelect={handleQ2}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        )}

        {phase === "q3" && (
          <motion.div
            key="q3"
            custom={reducedMotion}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
          >
            <QuestionScreen
              phaseNum={3}
              questionKey="q3"
              options={Q3_OPTIONS}
              accent={PHASE_BLOBS.q3.accent}
              onSelect={handleQ3}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        )}

        {phase === "result" && resultSlug && (
          <motion.div
            key="result"
            custom={reducedMotion}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE_PREMIUM }}
          >
            <ResultScreen slug={resultSlug} onRestart={handleRestart} reducedMotion={reducedMotion} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
