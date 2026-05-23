"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cookies } from "@/data/cookies";
import { EASE_PREMIUM } from "@/lib/utils";

/* Hand-picked 4 cookies that aren't in the featured hero slider */
const SHOWCASE = [
  cookies.find((c) => c.slug === "golden")!,
  cookies.find((c) => c.slug === "lotus")!,
  cookies.find((c) => c.slug === "matcha-kiss")!,
  cookies.find((c) => c.slug === "salt")!,
].filter(Boolean);

/* Entry directions for each card */
const ENTRY = [
  { x: -120, y: -60, rotate: -18 },
  { x: 120, y: -80, rotate: 14 },
  { x: -100, y: 80, rotate: -12 },
  { x: 140, y: 60, rotate: 16 },
];

const ACCENT_COLORS = ["#AF5950", "#C79A5B", "#4D7792", "#AF5950"];

/* ── Single cookie card ── */
function CookieFloat({
  cookie,
  index,
  entry,
  accent,
}: {
  cookie: (typeof SHOWCASE)[number];
  index: number;
  entry: (typeof ENTRY)[number];
  accent: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.5"],
  });
  const sp = useSpring(scrollYProgress, { stiffness: 130, damping: 26 });
  const x = useTransform(sp, [0, 1], [entry.x, 0]);
  const y = useTransform(sp, [0, 1], [entry.y, 0]);
  const rotate = useTransform(sp, [0, 1], [entry.rotate, (index % 2 === 0 ? -3 : 3)]);
  const opacity = useTransform(sp, [0, 0.35], [0, 1]);
  const scale = useTransform(sp, [0, 1], [0.72, 1]);

  /* Slow parallax float while cookie is visible */
  const { scrollYProgress: floatProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const floatY = useTransform(floatProgress, [0, 1], ["8%", "-8%"]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y, rotate, opacity, scale }}
      className="flex flex-col items-center gap-3"
    >
      <motion.div style={{ y: floatY }} className="relative">
        {/* Accent glow */}
        <div
          className="pointer-events-none absolute inset-[-20%] rounded-full blur-[50px] opacity-25"
          style={{ backgroundColor: accent }}
        />

        {/* Number badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ delay: 0.25 + index * 0.08, type: "spring", bounce: 0.55 }}
          className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-black text-crunkie-white shadow-lg"
          style={{ backgroundColor: accent }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.div>

        {/* Cookie image */}
        <div
          className="relative"
          style={{ width: "clamp(160px, 20vw, 260px)", height: "clamp(160px, 20vw, 260px)" }}
        >
          <Image
            src={cookie.image}
            alt={cookie.name}
            fill
            className="object-contain drop-shadow-2xl"
            sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 260px"
          />
        </div>
      </motion.div>

      {/* Cookie info */}
      <div className="text-center">
        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + index * 0.07, duration: 0.5, ease: EASE_PREMIUM }}
          style={{ originX: 0.5, backgroundColor: accent }}
          className="mx-auto mb-2 h-[2px] w-10 rounded-full"
        />
        <h3
          className="font-display font-black leading-tight text-crunkie-white"
          style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.5rem)" }}
        >
          {cookie.name}
        </h3>
        <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-widest text-crunkie-cream/35">
          {cookie.flavorNotes[0]}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Word-by-word reveal heading ── */
function RevealHeading({
  text,
  color = "white",
  delay = 0,
}: {
  text: string;
  color?: "white" | "red";
  delay?: number;
}) {
  return (
    <span className="inline-flex flex-wrap justify-center gap-x-[0.25em]">
      {text.split(" ").map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{
              delay: delay + i * 0.1,
              duration: 0.75,
              ease: EASE_PREMIUM,
            }}
            className={`inline-block font-display font-black ${
              color === "red" ? "text-crunkie-red" : "text-crunkie-white"
            }`}
            style={{ fontSize: "clamp(3.2rem, 7.5vw, 7rem)", lineHeight: 0.92 }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────── */
export function CookieShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-crunkie-dark py-24 lg:py-36"
    >
      {/* ── Background texture ── */}
      <motion.div
        style={{ y: bgParallax }}
        className="pointer-events-none absolute inset-[-15%] opacity-[0.032]"
        aria-hidden
      >
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "radial-gradient(circle, #FFFDF8 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
      </motion.div>

      {/* ── Ambient color blobs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[20%] h-[50vw] max-h-[420px] w-[50vw] max-w-[420px] rounded-full bg-crunkie-red/10 blur-[35px] sm:blur-[120px]" />
        <div className="absolute right-[-8%] bottom-[15%] h-[45vw] max-h-[380px] w-[45vw] max-w-[380px] rounded-full blur-[35px] sm:blur-[100px]" style={{ backgroundColor: "rgba(77,119,146,0.10)" }} />
        <div className="absolute left-[38%] top-[55%] h-[30vw] max-h-[260px] w-[30vw] max-w-[260px] rounded-full bg-crunkie-gold/8 blur-[30px] sm:blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* ── Eyebrow ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-8 flex items-center justify-center gap-3"
        >
          <span className="h-px w-10 bg-crunkie-red" />
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-crunkie-red">
            The Flavors
          </span>
          <span className="h-px w-10 bg-crunkie-red" />
        </motion.div>

        {/* ── Headline ── */}
        <div className="mb-4 text-center leading-none">
          <RevealHeading text="Twenty" delay={0} />
          <br />
          <RevealHeading text="Flavors." color="red" delay={0.14} />
        </div>

        {/* ── Subtext ── */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ delay: 0.38, duration: 0.65, ease: EASE_PREMIUM }}
          className="mb-20 text-center font-sans text-sm leading-relaxed text-crunkie-cream/38 lg:text-base lg:mb-24"
        >
          Each cookie has a name, a story, and a reason to exist.
        </motion.p>

        {/* ── Four cookies ── */}
        <div className="grid grid-cols-2 gap-y-14 gap-x-6 sm:grid-cols-4 sm:gap-x-8 lg:gap-x-12">
          {SHOWCASE.map((c, i) => (
            <CookieFloat
              key={c.slug}
              cookie={c}
              index={i}
              entry={ENTRY[i]}
              accent={ACCENT_COLORS[i]}
            />
          ))}
        </div>

        {/* ── Stats row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ delay: 0.15, duration: 0.7, ease: EASE_PREMIUM }}
          className="mt-20 grid grid-cols-3 divide-x divide-crunkie-cream/8 border-t border-crunkie-cream/8 pt-10 lg:mt-28"
        >
          {[
            { num: "20", label: "Flavors" },
            { num: "01", label: "Bonn, Germany" },
            { num: "∞", label: "Obsession" },
          ].map(({ num, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-4 lg:px-8">
              <span
                className="font-display font-black leading-none text-crunkie-white"
                style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
              >
                {num}
              </span>
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-crunkie-cream/30">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.22, duration: 0.6, ease: EASE_PREMIUM }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/cookies"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-crunkie-cream/14 px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.24em] text-crunkie-cream/55 transition-all duration-300 hover:border-crunkie-red hover:text-crunkie-white active:scale-95"
          >
            View All Cookies
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="text-crunkie-red"
            >→</motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
