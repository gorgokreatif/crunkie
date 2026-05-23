"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { VeganBadge } from "./VeganBadge";
import { EASE_PREMIUM } from "@/lib/utils";
import type { Cookie } from "@/data/cookies";

const PILL_STYLES = [
  { bg: "#AF5950", text: "#FFFDF8" },
  { bg: "#4D7792", text: "#FFFDF8" },
  { bg: "#C79A5B", text: "#FFFDF8" },
  { bg: "#AF5950", text: "#FFFDF8" },
];

const VEGAN_PILL_STYLES = [
  { bg: "#4A8C5C", text: "#FFFDF8" },
  { bg: "#2D6B40", text: "#FFFDF8" },
  { bg: "#6AAF7C", text: "#FFFDF8" },
  { bg: "#4A8C5C", text: "#FFFDF8" },
];

const SPRINKLES = [
  { color: "#AF5950", size: 10, x: "18%",  y: "22%", dur: 3.2, delay: 0 },
  { color: "#4D7792", size: 7,  x: "78%",  y: "18%", dur: 4.0, delay: 0.5 },
  { color: "#C79A5B", size: 12, x: "82%",  y: "68%", dur: 3.6, delay: 1.0 },
  { color: "#AF5950", size: 6,  x: "14%",  y: "72%", dur: 4.4, delay: 0.3 },
  { color: "#4D7792", size: 9,  x: "48%",  y: "8%",  dur: 3.0, delay: 0.8 },
  { color: "#C79A5B", size: 7,  x: "88%",  y: "42%", dur: 4.8, delay: 1.4 },
  { color: "#AF5950", size: 11, x: "8%",   y: "44%", dur: 3.8, delay: 0.6 },
];

const VEGAN_SPRINKLES = [
  { color: "#4A8C5C", size: 10, x: "18%",  y: "22%", dur: 3.2, delay: 0 },
  { color: "#6AAF7C", size: 7,  x: "78%",  y: "18%", dur: 4.0, delay: 0.5 },
  { color: "#2D6B40", size: 12, x: "82%",  y: "68%", dur: 3.6, delay: 1.0 },
  { color: "#4A8C5C", size: 6,  x: "14%",  y: "72%", dur: 4.4, delay: 0.3 },
  { color: "#6AAF7C", size: 9,  x: "48%",  y: "8%",  dur: 3.0, delay: 0.8 },
  { color: "#2D6B40", size: 7,  x: "88%",  y: "42%", dur: 4.8, delay: 1.4 },
  { color: "#4A8C5C", size: 11, x: "8%",   y: "44%", dur: 3.8, delay: 0.6 },
];

interface Props {
  cookie: Cookie;
  backLabel: string;
  flavorLabel: string;
}

export function CookieDetailHero({ cookie, backLabel, flavorLabel }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* Cookie parallax on scroll */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const cookieY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const cookieScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);

  /* Mouse parallax */
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const smX = useSpring(mX, { stiffness: 30, damping: 15 });
  const smY = useSpring(mY, { stiffness: 30, damping: 15 });
  const cookieOffX = useTransform(smX, (v) => v * -18);
  const cookieOffY = useTransform(smY, (v) => v * -14);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, [mX, mY]);

  const words = cookie.name.split(" ");
  const isVegan = cookie.isVegan;
  const sprinkles = isVegan ? VEGAN_SPRINKLES : SPRINKLES;
  const pillStyles = isVegan ? VEGAN_PILL_STYLES : PILL_STYLES;
  const accentColor = isVegan ? "#4A8C5C" : "#AF5950";

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-crunkie-softcream"
    >
      {/* Dot grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #1F1714 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Giant watermark cookie name */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
      >
        <span
          className="font-display font-black italic leading-none whitespace-nowrap"
          style={{ fontSize: "clamp(8rem, 22vw, 20rem)", color: `${accentColor}0d` }}
        >
          {cookie.name}
        </span>
      </div>

      {/* Floating sprinkle dots */}
      {mounted && sprinkles.map((s, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: s.size,
            height: s.size,
            left: s.x,
            top: s.y,
            backgroundColor: s.color,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.55, 0.35, 0.55, 0],
            scale: [0, 1, 0.9, 1, 0],
            y: [0, -18, 0, 18, 0],
          }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.55, ease: EASE_PREMIUM }}
        className="absolute top-28 left-6 z-20 lg:left-8"
      >
        <Link
          href="/cookies"
          className="inline-flex items-center gap-2 rounded-full border border-crunkie-dark/12 bg-crunkie-white/80 px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.24em] text-crunkie-dark/55 backdrop-blur-sm transition-all duration-200 hover:border-crunkie-red hover:text-crunkie-red"
        >
          ← {backLabel}
        </Link>
      </motion.div>

      {/* Vegan badge */}
      {cookie.isVegan && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -22 }}
          animate={{ opacity: 1, scale: 1, rotate: -6 }}
          transition={{ delay: 1.0, type: "spring", bounce: 0.6 }}
          className="absolute top-[26%] right-[8%] z-20 lg:right-[14%]"
        >
          <VeganBadge size="lg" />
        </motion.div>
      )}

      {/* Cookie — scroll parallax + mouse float */}
      <motion.div
        style={{ y: cookieY, scale: cookieScale, x: cookieOffX }}
        className="relative z-10 flex items-center justify-center"
      >
        {/* Pulsing glow — primary */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.14, 0.28, 0.14] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            className="h-[65vw] max-h-[520px] w-[65vw] max-w-[520px] rounded-full blur-[30px] sm:blur-[90px]"
            style={{ backgroundColor: `${accentColor}33` }}
          />
        </motion.div>

        {/* Pulsing glow — secondary */}
        <motion.div
          animate={{ scale: [1, 1.10, 1], opacity: [0.10, 0.22, 0.10] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            className="h-[40vw] max-h-[320px] w-[40vw] max-w-[320px] rounded-full blur-[25px] sm:blur-[70px]"
            style={{ backgroundColor: isVegan ? "rgba(106,175,124,0.18)" : "rgba(77,119,146,0.18)" }}
          />
        </motion.div>

        {/* The cookie */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: 18 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.3, type: "spring", bounce: 0.4 }}
          whileHover={{ rotate: 5, scale: 1.04 }}
          style={{ y: cookieOffY }}
        >
          <motion.div
            animate={{ y: [-12, 12, -12], rotate: [-2, 2.5, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src={cookie.image}
              alt={cookie.name}
              width={580}
              height={580}
              priority
              className="relative h-[52vw] max-h-[460px] w-[52vw] max-w-[460px] object-contain drop-shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom info panel — cream gradient, always visible */}
      <div className="absolute inset-x-0 bottom-0 z-20 pb-16 pt-36"
        style={{ background: "linear-gradient(to top, #F7F0E7 55%, #F7F0E7cc 75%, transparent 100%)" }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          {/* Cookie name — word-by-word reveal */}
          <h1
            className="mb-5 font-display font-black leading-[0.88]"
            style={{ fontSize: "clamp(3rem, 9vw, 8rem)", color: accentColor }}
          >
            {words.map((word, i) => (
              <span key={i} className="mr-[0.2em] inline-block overflow-hidden last:mr-0">
                <motion.span
                  initial={{ y: "115%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.82, ease: EASE_PREMIUM }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Flavor notes — fly in from different directions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="mr-1 font-sans text-[10px] font-bold uppercase tracking-[0.32em] text-crunkie-dark/35">
              {flavorLabel}
            </span>
            {cookie.flavorNotes.map((note, i) => {
              const ps = pillStyles[i % pillStyles.length];
              const fromX = i % 2 === 0 ? -40 : 40;
              return (
                <motion.span
                  key={note}
                  initial={{ opacity: 0, x: fromX, y: -20, rotate: fromX > 0 ? 8 : -8 }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: (i % 3 - 1) * 3 }}
                  transition={{ delay: 0.45 + i * 0.12, type: "spring", bounce: 0.55 }}
                  whileHover={{ scale: 1.08, rotate: 0 }}
                  className="inline-block rounded-full px-4 py-1.5 font-sans text-xs font-bold uppercase tracking-wide"
                  style={{ backgroundColor: ps.bg, color: ps.text }}
                >
                  {note}
                </motion.span>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="absolute bottom-6 right-8 z-30"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-crunkie-dark/15 p-1.5"
        >
          <div className="h-2 w-0.5 rounded-full bg-crunkie-dark/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
