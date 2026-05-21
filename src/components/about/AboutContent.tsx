"use client";

import { useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  animate,
} from "framer-motion";
import Image from "next/image";
import { Award, Sparkles, Heart } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/utils";

interface BgCookie {
  src: string;
  size: string;
  rotate: number;
  opacity: number;
  delay: number;
  floatY: [string, string];
  floatDur: number;
  right?: string;
  left?: string;
  top?: string;
  bottom?: string;
}

const HERO_COOKIES: BgCookie[] = [
  {
    src: "/assets/cookies/cookie-golden.png",
    right: "-2%", top: "6%",
    size: "clamp(200px,22vw,320px)",
    rotate: 22, opacity: 0.11, delay: 0.35,
    floatY: ["-7%", "7%"], floatDur: 7.2,
  },
  {
    src: "/assets/cookies/cookie-salt.png",
    left: "-2%", bottom: "8%",
    size: "clamp(130px,15vw,210px)",
    rotate: -16, opacity: 0.08, delay: 0.55,
    floatY: ["6%", "-6%"], floatDur: 8.8,
  },
];

const VALUE_ICONS = [Award, Sparkles, Heart];
const VALUE_ACCENTS = ["#AF5950", "#C79A5B", "#4D7792"];

function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const val = useMotionValue(0);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(val, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toString();
      },
    });
    return () => controls.stop();
  }, [isInView, val, to]);

  return <span ref={ref} className={className}>0</span>;
}

interface Props {
  heroTagline: string;
  storyTitle: string;
  storyBody: string;
  storyBody2: string;
  valuesTitle: string;
  values: Array<{ title: string; body: string }>;
  locationTitle: string;
  address: string;
  aachenSoon: string;
  getDirections: string;
}

export function AboutContent({
  heroTagline,
  storyTitle,
  storyBody,
  storyBody2,
  valuesTitle,
  values,
  locationTitle,
  address,
  aachenSoon,
  getDirections,
}: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallax = useTransform(heroScroll, [0, 1], ["0%", "22%"]);
  const taglineLines = heroTagline.split("\n");

  return (
    <>
      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative flex min-h-[88vh] items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#1C1108" }}
      >
        {/* Parallax bg */}
        <motion.div style={{ y: heroParallax }} className="pointer-events-none absolute inset-[-14%]">
          <div className="absolute left-[12%] top-[28%] h-[50vw] max-h-[400px] w-[50vw] max-w-[400px] rounded-full bg-crunkie-gold/10 blur-[120px]" />
          <div className="absolute right-[8%] top-[18%] h-[40vw] max-h-[340px] w-[40vw] max-w-[340px] rounded-full bg-crunkie-red/8 blur-[100px]" />
          <div
            className="absolute left-[36%] bottom-[14%] h-[32vw] max-h-[280px] w-[32vw] max-w-[280px] rounded-full blur-[90px]"
            style={{ backgroundColor: "rgba(77,119,146,0.08)" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.024]"
            style={{
              backgroundImage: "radial-gradient(circle, #FFFDF8 1.5px, transparent 1.5px)",
              backgroundSize: "26px 26px",
            }}
          />
        </motion.div>

        {/* Floating cookies */}
        {HERO_COOKIES.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.55, rotate: c.rotate - 18 }}
            animate={{ opacity: c.opacity, scale: 1, rotate: c.rotate }}
            transition={{ delay: c.delay, duration: 1.5, ease: EASE_PREMIUM }}
            className="pointer-events-none absolute hidden sm:block"
            style={{
              right: c.right,
              left: c.left,
              top: c.top,
              bottom: c.bottom,
              width: c.size,
              height: c.size,
            }}
          >
            <motion.div
              animate={{ y: c.floatY }}
              transition={{ duration: c.floatDur, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
              className="relative h-full w-full"
            >
              <Image src={c.src} alt="" fill className="object-contain" sizes="320px" />
            </motion.div>
          </motion.div>
        ))}

        {/* Watermark */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden"
        >
          <span
            className="font-display font-black italic leading-none text-crunkie-white/[0.022] whitespace-nowrap"
            style={{ fontSize: "clamp(8rem,22vw,20rem)" }}
          >
            CRUNKIE
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 pb-24 pt-36 text-center lg:px-8">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE_PREMIUM }}
            className="mb-6 flex items-center justify-center gap-3"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE_PREMIUM }}
              style={{ originX: 1 }}
              className="block h-px w-8 bg-crunkie-gold"
            />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.36em] text-crunkie-gold">
              Crunkie · Bonn
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: EASE_PREMIUM }}
              style={{ originX: 0 }}
              className="block h-px w-8 bg-crunkie-gold"
            />
          </motion.div>

          {/* Title — line by line */}
          <h1
            className="font-display font-black leading-[0.9]"
            style={{ fontSize: "clamp(3rem,8vw,7.5rem)" }}
          >
            {taglineLines.map((line, li) => (
              <span key={li} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "112%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.28 + li * 0.16, duration: 0.9, ease: EASE_PREMIUM }}
                  className={`inline-block ${li === 1 ? "italic text-crunkie-red" : "text-crunkie-white"}`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7, ease: EASE_PREMIUM }}
            style={{ originX: 0.5 }}
            className="mx-auto mt-8 h-px w-16 bg-gradient-to-r from-transparent via-crunkie-red/50 to-transparent"
          />
        </div>

        {/* Scroll caret */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-crunkie-cream/14 p-1.5"
          >
            <div className="h-1.5 w-0.5 rounded-full bg-crunkie-cream/26" />
          </motion.div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════
          MANIFESTO
      ══════════════════════════════════ */}
      <section className="overflow-hidden bg-crunkie-softcream py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          {["Not just a cookie.", "It's Crunkie."].map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.18, duration: 0.88, ease: EASE_PREMIUM }}
              className={`font-display font-black leading-[0.9] ${
                i === 1 ? "italic text-crunkie-red" : "text-crunkie-dark"
              }`}
              style={{ fontSize: "clamp(2.8rem,7vw,6.5rem)" }}
            >
              {line}
            </motion.p>
          ))}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.7, ease: EASE_PREMIUM }}
            className="mx-auto mt-6 max-w-xs font-sans text-sm leading-relaxed text-crunkie-dark/45"
          >
            Handcrafted in Bonn. Designed to obsess over.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════
          STORY
      ══════════════════════════════════ */}
      <section className="bg-crunkie-white py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">

            {/* Left */}
            <div>
              <motion.p
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                className="mb-3 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-crunkie-red"
              >
                <span className="h-px w-5 bg-crunkie-red" />
                Our Story
              </motion.p>

              {/* Big decorative number */}
              <div className="relative">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-3 -top-5 select-none font-display font-black leading-none text-crunkie-dark/[0.04]"
                  style={{ fontSize: "clamp(5rem,13vw,11rem)" }}
                >
                  01
                </div>
                <motion.h2
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.75, ease: EASE_PREMIUM }}
                  className="relative font-display text-4xl font-black leading-tight text-crunkie-dark lg:text-5xl"
                >
                  {storyTitle}
                </motion.h2>
              </div>

              {/* Floating cookie */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -4 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 1.1, type: "spring", bounce: 0.3 }}
                className="mt-10 hidden lg:block"
              >
                <motion.div
                  animate={{ y: [0, -14, 0], rotate: [-4, -1, -4] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src="/assets/cookies/cookie-chocolate.png"
                    alt=""
                    width={210}
                    height={210}
                    className="drop-shadow-2xl"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Right */}
            <div className="space-y-6 lg:pt-16">
              {[storyBody, storyBody2].map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.14, duration: 0.7, ease: EASE_PREMIUM }}
                  className="font-sans text-base leading-relaxed text-crunkie-dark/70 lg:text-lg"
                >
                  {text}
                </motion.p>
              ))}

              {/* Pull quote */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE_PREMIUM }}
                className="border-l-4 border-crunkie-red pl-5 pt-2"
              >
                <p className="font-display text-xl font-black italic leading-snug text-crunkie-dark/65 lg:text-2xl">
                  &ldquo;Cologne–Bonn&apos;s most talked-about cookie.&rdquo;
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          STATS
      ══════════════════════════════════ */}
      <section className="bg-crunkie-dark py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-crunkie-cream/8">
            {(
              [
                { value: 20,   label: "Flavors",    symbol: null },
                { value: 1,    label: "Location",   symbol: null },
                { value: null, label: "Obsession",  symbol: "∞"  },
              ] as Array<{ value: number | null; label: string; symbol: string | null }>
            ).map(({ value, label, symbol }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.65, ease: EASE_PREMIUM }}
                className="flex flex-col items-center gap-1.5 py-4"
              >
                <span
                  className="font-display font-black leading-none text-crunkie-white"
                  style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)" }}
                >
                  {symbol ?? <CountUp to={value!} />}
                </span>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-crunkie-cream/30">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          VALUES
      ══════════════════════════════════ */}
      <section className="bg-crunkie-dark py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mb-14">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_PREMIUM }}
              className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-crunkie-gold"
            >
              Our Values
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7, ease: EASE_PREMIUM }}
              className="font-display text-4xl font-black text-crunkie-white lg:text-5xl"
            >
              {valuesTitle}
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {values.map(({ title, body }, i) => {
              const Icon = VALUE_ICONS[i];
              const accent = VALUE_ACCENTS[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 44 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.13, duration: 0.78, ease: EASE_PREMIUM }}
                >
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="group relative h-full overflow-hidden border border-crunkie-cream/8 p-8 transition-colors duration-300 hover:border-crunkie-cream/18"
                    style={{ backgroundColor: "#191110" }}
                  >
                    {/* Hover glow */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `radial-gradient(ellipse 80% 55% at 50% 110%, ${accent}20 0%, transparent 70%)`,
                      }}
                    />

                    {/* Ghost number */}
                    <div
                      aria-hidden
                      className="absolute right-5 top-4 select-none font-display text-5xl font-black leading-none"
                      style={{ color: `${accent}0e` }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: 6 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      className="relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${accent}1a` }}
                    >
                      <Icon size={22} strokeWidth={1.6} style={{ color: accent }} />
                    </motion.div>

                    <h3 className="mb-3 font-display text-xl font-black text-crunkie-white">
                      {title}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-crunkie-cream/48">
                      {body}
                    </p>

                    {/* Bottom accent line */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35 + i * 0.1, duration: 0.65, ease: EASE_PREMIUM }}
                      style={{ originX: 0, backgroundColor: accent }}
                      className="absolute bottom-0 left-0 h-[3px] w-full opacity-35"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          LOCATION
      ══════════════════════════════════ */}
      <section className="bg-crunkie-softcream py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

            <div>
              <motion.p
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                className="mb-3 inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-crunkie-red"
              >
                <span className="h-px w-5 bg-crunkie-red" />
                Location
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.7, ease: EASE_PREMIUM }}
                className="mb-8 font-display text-4xl font-black leading-tight text-crunkie-dark lg:text-5xl"
              >
                {locationTitle}
              </motion.h2>

              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.65, ease: EASE_PREMIUM }}
                  className="border-l-4 border-crunkie-red pl-5"
                >
                  <p className="font-display text-xl font-black text-crunkie-dark">Bonn</p>
                  <p className="mt-0.5 font-sans text-sm text-crunkie-dark/60">{address}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.65, ease: EASE_PREMIUM }}
                  className="border-l-4 border-crunkie-gold/50 pl-5"
                >
                  <p className="font-display text-xl font-black text-crunkie-gold/80">
                    {aachenSoon}
                  </p>
                  <p className="mt-0.5 font-sans text-[10px] uppercase tracking-widest text-crunkie-dark/35">
                    Coming Soon
                  </p>
                </motion.div>
              </div>

              <motion.a
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.42, duration: 0.6, ease: EASE_PREMIUM }}
                whileHover={{ x: 4 }}
                href="https://maps.google.com/?q=Am+Neutor+6,+53113+Bonn"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.22em] text-crunkie-red transition-colors hover:text-crunkie-chocolate"
              >
                {getDirections}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 22 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.85, ease: EASE_PREMIUM }}
              className="overflow-hidden rounded-2xl shadow-2xl shadow-crunkie-dark/10"
            >
              <iframe
                src="https://maps.google.com/maps?q=Am+Neutor+6,+53113+Bonn&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "380px", display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Crunkie Bonn Location"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
