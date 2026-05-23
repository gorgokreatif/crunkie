"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getCookieBySlug } from "@/data/cookies";
import { EASE_PREMIUM } from "@/lib/utils";

interface SlideItem {
  slug: string;
  left: number;
  top: number;
  size: string;
  rotate: number;
  entryFrom: { x: number; y: number; rotate: number };
  floatY: [number, number, number];
  floatDuration: number;
  z: number;
  hideMobile?: boolean;
}

interface Slide {
  id: string;
  accent: string;
  bg: {
    base: string;
    blobs: Array<{
      color: string;
      left: string;
      top: string;
      size: string;
      blur: string;
      opacity: number;
    }>;
  };
  items: SlideItem[];
}

const SLIDES: Slide[] = [
  {
    id: "barely-legal",
    accent: "#AF5950",
    bg: {
      base: "#1C1108",
      blobs: [
        { color: "#6B2D1A", left: "22%", top: "38%", size: "50vw", blur: "90px", opacity: 0.55 },
        { color: "#AF5950", left: "72%", top: "62%", size: "36vw", blur: "110px", opacity: 0.18 },
        { color: "#C79A5B", left: "84%", top: "16%", size: "26vw", blur: "70px", opacity: 0.14 },
      ],
    },
    items: [
      { slug: "barely-legal", left: 50, top: 50, size: "clamp(200px,28vw,380px)", rotate: -2, entryFrom: { x: 0, y: 80, rotate: -12 }, floatY: [-12, 12, -12], floatDuration: 5.8, z: 3 },
      { slug: "hazel", left: 76, top: 22, size: "clamp(110px,15vw,200px)", rotate: 14, entryFrom: { x: 90, y: -50, rotate: 22 }, floatY: [-7, 7, -7], floatDuration: 4.9, z: 2 },
      { slug: "chocolate", left: 21, top: 74, size: "clamp(88px,11vw,150px)", rotate: -16, entryFrom: { x: -75, y: 65, rotate: -28 }, floatY: [-5, 5, -5], floatDuration: 6.2, z: 2, hideMobile: true },
    ],
  },
  {
    id: "blackout",
    accent: "#C79A5B",
    bg: {
      base: "#08060A",
      blobs: [
        { color: "#1A0D18", left: "40%", top: "45%", size: "60vw", blur: "100px", opacity: 0.80 },
        { color: "#2A1428", left: "20%", top: "30%", size: "40vw", blur: "80px", opacity: 0.60 },
        { color: "#C79A5B", left: "78%", top: "68%", size: "24vw", blur: "80px", opacity: 0.12 },
      ],
    },
    items: [
      { slug: "blackout", left: 50, top: 50, size: "clamp(200px,28vw,380px)", rotate: 1, entryFrom: { x: 0, y: -70, rotate: 8 }, floatY: [-10, 10, -10], floatDuration: 6.4, z: 3 },
      { slug: "oreo", left: 22, top: 24, size: "clamp(110px,15vw,200px)", rotate: -14, entryFrom: { x: -80, y: -40, rotate: -24 }, floatY: [-7, 7, -7], floatDuration: 5.2, z: 2 },
      { slug: "nightshift", left: 78, top: 74, size: "clamp(88px,11vw,150px)", rotate: 18, entryFrom: { x: 75, y: 65, rotate: 28 }, floatY: [-5, 5, -5], floatDuration: 5.8, z: 2, hideMobile: true },
    ],
  },
  {
    id: "flex",
    accent: "#C79A5B",
    bg: {
      base: "#0A0E18",
      blobs: [
        { color: "#1A2A52", left: "35%", top: "45%", size: "55vw", blur: "100px", opacity: 0.70 },
        { color: "#4D7792", left: "70%", top: "25%", size: "32vw", blur: "85px", opacity: 0.35 },
        { color: "#C79A5B", left: "18%", top: "68%", size: "26vw", blur: "75px", opacity: 0.18 },
      ],
    },
    items: [
      { slug: "flex", left: 50, top: 50, size: "clamp(200px,28vw,380px)", rotate: -1, entryFrom: { x: 0, y: 80, rotate: -7 }, floatY: [-12, 12, -12], floatDuration: 5.5, z: 3 },
      { slug: "golden", left: 77, top: 22, size: "clamp(110px,15vw,200px)", rotate: 13, entryFrom: { x: 85, y: -55, rotate: 22 }, floatY: [-8, 8, -8], floatDuration: 4.7, z: 2 },
      { slug: "walnut", left: 19, top: 72, size: "clamp(88px,11vw,150px)", rotate: -13, entryFrom: { x: -75, y: 55, rotate: -22 }, floatY: [-5, 5, -5], floatDuration: 6.0, z: 2, hideMobile: true },
    ],
  },
  {
    id: "clean-cheat",
    accent: "#6BA876",
    bg: {
      base: "#060F08",
      blobs: [
        { color: "#0E2E14", left: "40%", top: "42%", size: "58vw", blur: "100px", opacity: 0.75 },
        { color: "#1D5A28", left: "68%", top: "26%", size: "35vw", blur: "85px", opacity: 0.40 },
        { color: "#8FA877", left: "18%", top: "70%", size: "28vw", blur: "70px", opacity: 0.22 },
      ],
    },
    items: [
      { slug: "clean-cheat", left: 50, top: 50, size: "clamp(200px,28vw,380px)", rotate: 2, entryFrom: { x: -50, y: 70, rotate: 10 }, floatY: [-11, 11, -11], floatDuration: 6.0, z: 3 },
      { slug: "matcha-kiss", left: 24, top: 22, size: "clamp(110px,15vw,200px)", rotate: -15, entryFrom: { x: -85, y: -45, rotate: -26 }, floatY: [-7, 7, -7], floatDuration: 5.0, z: 2 },
      { slug: "pistachio", left: 78, top: 72, size: "clamp(88px,11vw,150px)", rotate: 14, entryFrom: { x: 75, y: 55, rotate: 24 }, floatY: [-5, 5, -5], floatDuration: 5.6, z: 2, hideMobile: true },
    ],
  },
  {
    id: "lotus",
    accent: "#C79A5B",
    bg: {
      base: "#160C02",
      blobs: [
        { color: "#6B3508", left: "42%", top: "44%", size: "56vw", blur: "100px", opacity: 0.60 },
        { color: "#C79A5B", left: "20%", top: "26%", size: "30vw", blur: "80px", opacity: 0.20 },
        { color: "#AF5950", left: "78%", top: "66%", size: "28vw", blur: "75px", opacity: 0.16 },
      ],
    },
    items: [
      { slug: "lotus", left: 50, top: 50, size: "clamp(200px,28vw,380px)", rotate: -1, entryFrom: { x: 60, y: 60, rotate: 8 }, floatY: [-12, 12, -12], floatDuration: 5.7, z: 3 },
      { slug: "softspot", left: 75, top: 22, size: "clamp(110px,15vw,200px)", rotate: 15, entryFrom: { x: 90, y: -40, rotate: 26 }, floatY: [-7, 7, -7], floatDuration: 5.1, z: 2 },
      { slug: "habit", left: 21, top: 74, size: "clamp(88px,11vw,150px)", rotate: -11, entryFrom: { x: -70, y: 65, rotate: -20 }, floatY: [-5, 5, -5], floatDuration: 6.3, z: 2, hideMobile: true },
    ],
  },
  {
    id: "salt",
    accent: "#4D7792",
    bg: {
      base: "#070C14",
      blobs: [
        { color: "#0E2238", left: "44%", top: "44%", size: "56vw", blur: "100px", opacity: 0.75 },
        { color: "#4D7792", left: "72%", top: "22%", size: "34vw", blur: "90px", opacity: 0.30 },
        { color: "#C79A5B", left: "18%", top: "70%", size: "26vw", blur: "70px", opacity: 0.14 },
      ],
    },
    items: [
      { slug: "salt", left: 50, top: 50, size: "clamp(200px,28vw,380px)", rotate: 1, entryFrom: { x: 0, y: -75, rotate: -6 }, floatY: [-12, 12, -12], floatDuration: 5.9, z: 3 },
      { slug: "peel-me-slow", left: 78, top: 70, size: "clamp(110px,15vw,200px)", rotate: 12, entryFrom: { x: 85, y: 55, rotate: 22 }, floatY: [-7, 7, -7], floatDuration: 4.8, z: 2 },
      { slug: "redflag", left: 22, top: 22, size: "clamp(88px,11vw,150px)", rotate: -14, entryFrom: { x: -80, y: -45, rotate: -24 }, floatY: [-5, 5, -5], floatDuration: 5.5, z: 2, hideMobile: true },
    ],
  },
];

function SpinBadge({ text, className }: { text: string; className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.6, type: "spring", bounce: 0.5 }}
      className={`relative h-[76px] w-[76px] shrink-0 ${className ?? ""}`}
    >
      <div className="absolute inset-0 animate-spin-slow">
        <svg viewBox="0 0 76 76" className="h-full w-full">
          <defs>
            <path id="sr" d="M38,38 m-25,0 a25,25 0 1,1 50,0 a25,25 0 1,1-50,0" />
          </defs>
          <text
            fill="rgba(232,225,215,0.45)"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "6px", fontWeight: 700, letterSpacing: "0.15em" }}
          >
            <textPath href="#sr">{text}</textPath>
          </text>
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-crunkie-red" />
      </div>
    </motion.div>
  );
}

export function Hero() {
  const t = useTranslations("home.hero");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const total = SLIDES.length;
  const slide = SLIDES[active];
  const cookie = getCookieBySlug(slide.id);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px), (prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);


  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const smX = useSpring(mX, { stiffness: 32, damping: 16 });
  const smY = useSpring(mY, { stiffness: 32, damping: 16 });
  const pX = useTransform(smX, (v) => v * -14);
  const pY = useTransform(smY, (v) => v * -9);

  const heroRef = useRef<HTMLElement>(null);
  const touchX = useRef(0);

  const go = useCallback(
    (d: number) => {
      setActive((a) => (a + d + total) % total);
      setPaused(true);
      setTimeout(() => setPaused(false), 5000);
    },
    [total]
  );

  const goTo = useCallback((i: number) => {
    setActive(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 5000);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % total), 4200);
    return () => clearInterval(id);
  }, [paused, total]);

  return (
    <motion.section
      ref={heroRef}
      initial={{ backgroundColor: SLIDES[0].bg.base }}
      animate={{ backgroundColor: slide.bg.base }}
      transition={{ backgroundColor: { duration: 0.9, ease: "easeInOut" } }}
      onMouseMove={(e) => {
        const r = heroRef.current?.getBoundingClientRect();
        if (!r) return;
        mX.set((e.clientX / r.width - 0.5) * 2);
        mY.set((e.clientY / r.height - 0.5) * 2);
      }}
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      {/* Dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle, #FFFDF8 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* CRUNKIE watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span
          className="font-display font-black italic leading-none text-crunkie-white/[0.025]"
          style={{ fontSize: "clamp(9rem, 24vw, 22rem)", whiteSpace: "nowrap" }}
        >
          CRUNKIE
        </span>
      </div>

      {/* Animated bg blobs */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`blobs-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          {slide.bg.blobs.map((blob, bi) => (
            <div
              key={bi}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: blob.left,
                top: blob.top,
                width: blob.size,
                height: blob.size,
                backgroundColor: blob.color,
                filter: reducedMotion ? `blur(${Math.min(35, parseInt(blob.blur))}px)` : `blur(${blob.blur})`,
                opacity: blob.opacity,
              }}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* SpinBadge */}
      <SpinBadge
        text="★ CRUNKIE ★ COOKIES ★ BONN ★"
        className="absolute right-5 top-24 z-30 lg:right-9 lg:top-28"
      />

      {/* ── COOKIE STAGE ── */}
      <div
        className="relative z-10 flex flex-1 overflow-hidden"
        style={{ minHeight: "clamp(300px, 55vh, 600px)" }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
          setPaused(true);
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (dx < -50) go(1);
          else if (dx > 50) go(-1);
        }}
      >
        {/* Ghost index number */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`num-${active}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none font-display font-black leading-none"
            style={{ fontSize: "clamp(10rem, 24vw, 22rem)", color: `${slide.accent}12` }}
          >
            {String(active + 1).padStart(2, "0")}
          </motion.div>
        </AnimatePresence>

        {/* Parallax wrapper */}
        <motion.div style={{ x: pX, y: pY }} className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`scene-${active}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0"
            >
              {slide.items.map((item, idx) => {
                const c = getCookieBySlug(item.slug);
                if (!c) return null;
                const isPrimary = idx === 0;

                return (
                  <div
                    key={item.slug}
                    className={item.hideMobile ? "hidden sm:block" : "block"}
                    style={{
                      position: "absolute",
                      left: `${item.left}%`,
                      top: `${item.top}%`,
                      transform: "translate(-50%, -50%)",
                      zIndex: item.z,
                      width: item.size,
                      height: item.size,
                    }}
                  >
                    <motion.div
                      initial={{
                        x: item.entryFrom.x,
                        y: item.entryFrom.y,
                        rotate: item.entryFrom.rotate,
                        opacity: 0,
                        scale: 0.72,
                      }}
                      animate={{ x: 0, y: 0, rotate: item.rotate, opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 22,
                        delay: idx * 0.1,
                      }}
                      className="relative h-full w-full"
                    >
                      {/* Pulsing ring on primary */}
                      {isPrimary && !reducedMotion && (
                        <motion.div
                          animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.04, 0.18] }}
                          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                          className="pointer-events-none absolute inset-[-20%] rounded-full"
                          style={{ backgroundColor: `${slide.accent}50` }}
                        />
                      )}

                      {/* Float */}
                      <motion.div
                        animate={reducedMotion ? {} : { y: item.floatY }}
                        transition={{
                          duration: item.floatDuration,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={c.image}
                          alt={c.name}
                          fill
                          priority={isPrimary && active === 0}
                          className="object-contain drop-shadow-2xl"
                          sizes="(max-width:640px) 200px,(max-width:1024px) 280px,380px"
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="relative z-20 shrink-0 px-6 pb-10 pt-2 lg:px-8 lg:pb-12 lg:pt-4">
        {/* Top gradient fade */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-20 h-20"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.45))" }}
        />

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-2 lg:gap-8">

            {/* LEFT: brand text */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.85, ease: EASE_PREMIUM }}
              className="order-2 lg:order-1"
            >
              <div className="mb-3 flex items-center gap-2.5">
                <motion.span
                  animate={reducedMotion ? {} : { scale: [1, 1.7, 1], opacity: [1, 0.15, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: 1.4 }}
                  className="h-1.5 w-1.5 rounded-full bg-crunkie-red"
                />
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.32em] text-crunkie-cream/60">
                  Bonn, Germany
                </span>
              </div>

              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.32, duration: 0.9, ease: EASE_PREMIUM }}
                  className="font-display font-black leading-[0.88] text-crunkie-white"
                  style={{ fontSize: "clamp(2.2rem, 4.8vw, 4.4rem)" }}
                >
                  {t("tagline")}
                </motion.p>
              </div>
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: "110%" }}
                  animate={{ y: "0%", rotate: -1.4 }}
                  transition={{ delay: 0.48, duration: 0.9, ease: EASE_PREMIUM }}
                  className="mb-3 inline-block font-display font-black italic leading-[0.88] text-crunkie-red"
                  style={{ fontSize: "clamp(2.2rem, 4.8vw, 4.4rem)" }}
                >
                  {t("tagline2")}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.82, duration: 0.55, ease: EASE_PREMIUM }}
                style={{ originX: 0 }}
                className="mb-4"
              >
                <svg width="170" height="11" viewBox="0 0 170 11" fill="none">
                  <path
                    d="M2 5.5C12 1.5 26 9.5 42 5.5S70 1.5 85 5.5 112 9.5 128 5.5s27-4 40 0"
                    stroke="#AF5950"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.6, ease: EASE_PREMIUM }}
                className="mb-5 max-w-[30ch] font-sans text-sm leading-relaxed text-crunkie-cream/65 lg:text-base"
              >
                {t("subtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.88, duration: 0.6, ease: EASE_PREMIUM }}
                className="flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/cookies"
                  className="group inline-flex items-center gap-2 rounded-full bg-crunkie-red px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.22em] text-crunkie-white shadow-lg shadow-crunkie-red/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-crunkie-red/35 active:scale-95"
                >
                  {t("ctaCookies")}
                  <motion.span
                    animate={reducedMotion ? {} : { x: [0, 4, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </Link>
                <Link
                  href="/b2b"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-crunkie-cream/14 px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.22em] text-crunkie-cream/50 transition-all duration-300 hover:border-crunkie-red hover:text-crunkie-white active:scale-95"
                >
                  {t("ctaB2B")}
                </Link>
              </motion.div>
            </motion.div>

            {/* RIGHT: cookie nav */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.8, ease: EASE_PREMIUM }}
              className="order-1 flex flex-col items-start gap-2.5 lg:order-2 lg:items-end"
            >
              <div className="flex items-center gap-2.5">
                <motion.span
                  animate={{ backgroundColor: slide.accent }}
                  transition={{ duration: 0.8 }}
                  className="block h-[2.5px] w-8 rounded-full"
                />
                <span
                  className="font-display font-black leading-none text-crunkie-white/14"
                  style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
                >
                  {String(active + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-xs text-crunkie-cream/22">
                  / {String(total).padStart(2, "0")}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`name-${active}`}
                  initial={{ opacity: 0, y: 18, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{ duration: 0.36, ease: EASE_PREMIUM }}
                  className="text-left lg:text-right"
                >
                  <h2
                    className="font-display font-black leading-[0.9] text-crunkie-white"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 3.4rem)" }}
                  >
                    {cookie?.name ?? ""}
                  </h2>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`pills-${active}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-1.5 lg:justify-end"
                >
                  {(cookie?.flavorNotes ?? []).slice(0, 3).map((n, idx) => (
                    <motion.span
                      key={n}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07, type: "spring", bounce: 0.3 }}
                      className="rounded-full border border-crunkie-cream/10 px-3 py-[3px] font-sans text-[10px] font-semibold uppercase tracking-wider text-crunkie-cream/40"
                    >
                      {n}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-3.5 pt-0.5">
                <motion.button
                  onClick={() => go(-1)}
                  whileHover={{ scale: 1.14, x: -2 }}
                  whileTap={{ scale: 0.86 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  aria-label="Previous"
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-crunkie-cream/12 font-bold text-crunkie-cream/36 transition-colors hover:border-crunkie-red hover:text-crunkie-red"
                >
                  ←
                </motion.button>

                <div className="flex items-center gap-0.5">
                  {SLIDES.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Slide ${i + 1}`}
                      className="flex h-11 items-center justify-center px-1"
                    >
                      <motion.span
                        animate={{
                          width: i === active ? 22 : 7,
                          opacity: i === active ? 1 : 0.28,
                          backgroundColor: i === active ? slide.accent : "#FFFDF8",
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        className="block h-[7px] rounded-full"
                      />
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={() => go(1)}
                  whileHover={{ scale: 1.14, x: 2 }}
                  whileTap={{ scale: 0.86 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  aria-label="Next"
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-crunkie-cream/12 font-bold text-crunkie-cream/36 transition-colors hover:border-crunkie-red hover:text-crunkie-red"
                >
                  →
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`lnk-${active}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.14 }}
                >
                  <Link
                    href={`/cookies/${slide.id}`}
                    className="inline-flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-crunkie-cream/32 transition-colors hover:text-crunkie-red"
                  >
                    View Cookie
                    <motion.span
                      animate={reducedMotion ? {} : { x: [0, 3, 0] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Scroll caret */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
        className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2"
      >
        <motion.div
          animate={reducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-crunkie-cream/14 p-1.5"
        >
          <div className="h-1.5 w-0.5 rounded-full bg-crunkie-cream/26" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
