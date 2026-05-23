"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { Building2, Hotel, Calendar, Snowflake, Brush } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/utils";

const SEGMENT_COLORS = ["#AF5950", "#C79A5B", "#4D7792"];
const SEGMENT_ICONS = [Building2, Hotel, Calendar];

const FLOATING_COOKIES = [
  { slug: "barelylegal", left: "72%", top: "32%", rotate: 18, size: 260, delay: 0.4, floatY: [-10, 10, -10] as [number, number, number], dur: 5.5 },
  { slug: "pistachio",    left: "82%", top: "60%", rotate: -14, size: 180, delay: 0.7, floatY: [8, -12, 8] as [number, number, number],  dur: 6.2 },
  { slug: "blackout",    left: "61%", top: "10%", rotate: 8,  size: 140, delay: 0.9, floatY: [-8, 8, -8] as [number, number, number],  dur: 4.8 },
];

const SPRINKLES = [
  { color: "#C79A5B", size: 10, x: "12%", y: "28%", dur: 3.2, delay: 0 },
  { color: "#AF5950", size: 7,  x: "22%", y: "72%", dur: 4.0, delay: 0.5 },
  { color: "#4D7792", size: 12, x: "55%", y: "18%", dur: 3.6, delay: 1.0 },
  { color: "#C79A5B", size: 8,  x: "8%",  y: "54%", dur: 4.4, delay: 0.3 },
  { color: "#AF5950", size: 6,  x: "88%", y: "32%", dur: 3.0, delay: 0.8 },
  { color: "#4D7792", size: 9,  x: "92%", y: "68%", dur: 4.8, delay: 1.4 },
];

interface FormData {
  name: string; company: string; type: string; quantity: string; message: string;
  send: string; namePlaceholder: string; companyPlaceholder: string;
  typePlaceholder: string; quantityPlaceholder: string; messagePlaceholder: string;
}

interface Props {
  heroSubtitle: string;
  heroBody: string;
  segmentsTitle: string;
  segments: { title: string; body: string }[];
  miniBoxTitle: string;
  miniBoxSubtitle: string;
  miniBoxBody: string;
  frozenTitle: string;
  frozenSubtitle: string;
  frozenBody: string;
  frozenSteps: string[];
  customTitle: string;
  customBody: string;
  ctaTitle: string;
  ctaBody: string;
  form: FormData;
}

function WordReveal({
  text,
  delay = 0,
  color = "white",
  size,
}: {
  text: string;
  delay?: number;
  color?: "white" | "red" | "gold" | "dark";
  size?: string;
}) {
  const colorClass =
    color === "red"   ? "text-crunkie-red"
    : color === "gold"  ? "text-crunkie-gold"
    : color === "dark"  ? "text-crunkie-dark"
    : "text-crunkie-white";
  return (
    <span className="inline-flex flex-wrap gap-x-[0.22em]" style={size ? { fontSize: size } : undefined}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: delay + i * 0.08, duration: 0.75, ease: EASE_PREMIUM }}
            className={`inline-block ${colorClass}`}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function DarkFormField({
  label, name, type = "text", placeholder, required, rows,
}: {
  label: string; name: string; type?: "text" | "email" | "textarea";
  placeholder: string; required?: boolean; rows?: number;
}) {
  const cls = "w-full border border-crunkie-cream/10 bg-crunkie-cream/5 px-4 py-3 font-sans text-sm text-crunkie-white placeholder:text-crunkie-cream/25 focus:border-crunkie-gold/50 focus:bg-crunkie-cream/8 focus:outline-none transition-all duration-200 rounded-sm";
  return (
    <div>
      <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-crunkie-cream/40">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea name={name} rows={rows ?? 5} placeholder={placeholder} required={required} className={`${cls} resize-none`} />
      ) : (
        <input type={type} name={name} placeholder={placeholder} required={required} className={cls} />
      )}
    </div>
  );
}

export function B2BContent({
  heroSubtitle, heroBody, segmentsTitle, segments,
  miniBoxTitle, miniBoxSubtitle, miniBoxBody,
  frozenTitle, frozenSubtitle, frozenBody, frozenSteps,
  customTitle, customBody,
  ctaTitle, ctaBody, form,
}: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const sp = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgY = useTransform(sp, [0, 1], ["0%", "-18%"]);

  const heroLines = heroSubtitle.split("\n");

  return (
    <div>
      {/* ────── HERO ────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden flex items-center"
        style={{ backgroundColor: "#16100A" }}
      >
        {/* Parallax ambient glows */}
        <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-[-15%]">
          <div className="absolute left-[-5%] top-[10%] h-[55vw] max-h-[500px] w-[55vw] max-w-[500px] rounded-full blur-[40px] sm:blur-[140px]" style={{ backgroundColor: "rgba(199,154,91,0.08)" }} />
          <div className="absolute right-[5%] bottom-[15%] h-[45vw] max-h-[400px] w-[45vw] max-w-[400px] rounded-full bg-crunkie-red/10 blur-[35px] sm:blur-[120px]" />
          <div className="absolute left-[35%] top-[40%] h-[30vw] max-h-[280px] w-[30vw] max-w-[280px] rounded-full blur-[35px] sm:blur-[100px]" style={{ backgroundColor: "rgba(77,119,146,0.08)" }} />
        </motion.div>

        {/* Dot texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #FFFDF8 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }}
        />

        {/* Watermark */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none">
          <span
            className="font-display font-black italic leading-none whitespace-nowrap"
            style={{ fontSize: "clamp(10rem, 30vw, 28rem)", color: "rgba(199,154,91,0.05)" }}
          >
            B2B
          </span>
        </div>

        {/* Sprinkle dots */}
        {mounted && SPRINKLES.map((s, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute rounded-full"
            style={{ width: s.size, height: s.size, left: s.x, top: s.y, backgroundColor: s.color }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.5, 0.3, 0.5, 0], scale: [0, 1, 0.9, 1, 0], y: [0, -16, 0, 16, 0] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}

        {/* Floating cookies */}
        {mounted && FLOATING_COOKIES.map((fc) => (
          <motion.div
            key={fc.slug}
            initial={{ opacity: 0, scale: 0.6, rotate: fc.rotate * -1 }}
            animate={{ opacity: 0.88, scale: 1, rotate: fc.rotate }}
            transition={{ delay: fc.delay, duration: 1.0, type: "spring", bounce: 0.35 }}
            className="pointer-events-none absolute hidden lg:block"
            style={{ left: fc.left, top: fc.top, transform: "translate(-50%,-50%)" }}
          >
            <motion.div
              animate={{ y: fc.floatY }}
              transition={{ duration: fc.dur, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={`/assets/cookies/cookie-${fc.slug}.png`}
                alt={fc.slug}
                width={fc.size}
                height={fc.size}
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        ))}

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 pb-24 lg:px-8 lg:pt-40">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM }}
            className="mb-8 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-crunkie-gold" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-crunkie-gold">Business</span>
            <span className="h-px w-10 bg-crunkie-gold" />
          </motion.div>

          <h1
            className="mb-6 font-display font-black leading-[0.9]"
            style={{ fontSize: "clamp(3.5rem, 8vw, 8rem)" }}
          >
            {heroLines.map((line, i) => (
              <span key={i} className="block">
                <WordReveal text={line} delay={0.1 + i * 0.15} color={i === 1 ? "red" : "white"} />
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: EASE_PREMIUM }}
            className="mb-10 max-w-lg font-sans text-base leading-relaxed text-crunkie-cream/50 lg:text-lg"
          >
            {heroBody}
          </motion.p>

          <motion.a
            href="mailto:b2b@crunkiecookie.com"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: EASE_PREMIUM }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 rounded-full bg-crunkie-gold px-8 py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-crunkie-dark transition-colors duration-300 hover:bg-crunkie-white"
          >
            b2b@crunkiecookie.com
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
              →
            </motion.span>
          </motion.a>
        </div>

        {/* Scroll caret */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-10 w-6 items-start justify-center rounded-full border-2 p-1.5"
            style={{ borderColor: "rgba(199,154,91,0.3)" }}
          >
            <div className="h-2 w-0.5 rounded-full" style={{ backgroundColor: "rgba(199,154,91,0.5)" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ────── SEGMENTS ────── */}
      <section className="overflow-hidden bg-crunkie-dark py-24 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM }}
            className="mb-16 text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-crunkie-red" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-crunkie-red">Services</span>
              <span className="h-px w-8 bg-crunkie-red" />
            </div>
            <h2
              className="font-display font-black text-crunkie-white"
              style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
            >
              <WordReveal text={segmentsTitle} delay={0} color="white" />
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {segments.map(({ title, body }, i) => {
              const Icon = SEGMENT_ICONS[i];
              const accent = SEGMENT_COLORS[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: EASE_PREMIUM }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-sm border border-crunkie-cream/8 bg-crunkie-chocolate/40 p-8 cursor-default transition-all duration-300"
                >
                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}20 0%, transparent 70%)` }}
                  />

                  {/* Ghost number */}
                  <span
                    className="pointer-events-none absolute top-4 right-5 font-display text-6xl font-black leading-none select-none"
                    style={{ color: `${accent}14` }}
                  >
                    0{i + 1}
                  </span>

                  {/* Icon ring */}
                  <motion.div
                    className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${accent}18` }}
                    whileHover={{ rotate: [-4, 4, -4, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon size={26} style={{ color: accent }} strokeWidth={1.5} />
                  </motion.div>

                  {/* Accent line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.55, ease: EASE_PREMIUM }}
                    style={{ originX: 0, backgroundColor: accent }}
                    className="mb-5 h-[2px] w-10 rounded-full"
                  />

                  <h3 className="mb-3 font-display text-xl font-black text-crunkie-white">{title}</h3>
                  <p className="font-sans text-sm leading-relaxed text-crunkie-cream/45">{body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────── MINI BOX ────── */}
      <section className="overflow-hidden bg-crunkie-softcream py-24 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.75, ease: EASE_PREMIUM }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-6 bg-crunkie-red" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-crunkie-red">
                  {miniBoxSubtitle}
                </span>
              </div>
              <h2
                className="mb-5 font-display font-black leading-tight text-crunkie-dark"
                style={{ fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)" }}
              >
                <WordReveal text={miniBoxTitle} delay={0} color="dark" />
              </h2>
              <p className="font-sans text-base leading-relaxed text-crunkie-dark/65 lg:text-lg">
                {miniBoxBody}
              </p>
              <motion.a
                href="mailto:b2b@crunkiecookie.com"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.55, ease: EASE_PREMIUM }}
                whileHover={{ scale: 1.03 }}
                className="mt-8 inline-flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-[0.2em] text-crunkie-red"
              >
                Order Now
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
                  →
                </motion.span>
              </motion.a>
            </motion.div>

            {/* Cookie grid */}
            <div className="grid grid-cols-2 gap-4">
              {(["barelylegal", "blackout", "lotus", "salt"] as const).map((slug, i) => (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, scale: 0.75, rotate: i % 2 === 0 ? -6 : 6 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -2 : 2 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.7, type: "spring", bounce: 0.4 }}
                  whileHover={{ scale: 1.08, rotate: 0, y: -6 }}
                  className="aspect-square rounded-xl bg-crunkie-cream/60 flex items-center justify-center shadow-sm cursor-default overflow-hidden"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  >
                    <Image
                      src={`/assets/cookies/cookie-${slug}.png`}
                      alt={slug}
                      width={160}
                      height={160}
                      className="object-contain drop-shadow-lg"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────── FROZEN COOKIE PROGRAM ────── */}
      <section className="relative overflow-hidden py-24 lg:py-36" style={{ backgroundColor: "#0D0906" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-5%] top-[20%] h-[50vw] max-h-[400px] w-[50vw] max-w-[400px] rounded-full blur-[40px] sm:blur-[130px]" style={{ backgroundColor: "rgba(77,119,146,0.12)" }} />
          <div className="absolute right-[-5%] bottom-[20%] h-[40vw] max-h-[350px] w-[40vw] max-w-[350px] rounded-full blur-[35px] sm:blur-[110px]" style={{ backgroundColor: "rgba(255,253,248,0.04)" }} />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "radial-gradient(circle, #FFFDF8 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, ease: EASE_PREMIUM }}
              className="mb-4 flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Snowflake size={20} strokeWidth={1.5} style={{ color: "#4D7792" }} />
              </motion.div>
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-crunkie-blue">
                {frozenSubtitle}
              </span>
            </motion.div>

            <h2
              className="mb-4 font-display font-black text-crunkie-white"
              style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
            >
              <WordReveal text={frozenTitle} delay={0} color="white" />
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.65, ease: EASE_PREMIUM }}
              className="max-w-xl font-sans text-base leading-relaxed text-crunkie-cream/45 lg:text-lg"
            >
              {frozenBody}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {frozenSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: i * 0.12, duration: 0.65, ease: EASE_PREMIUM }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-sm border p-6 transition-all duration-300"
                style={{ borderColor: "rgba(77,119,146,0.18)", backgroundColor: "rgba(77,119,146,0.06)" }}
              >
                {/* Animated left accent */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.5, ease: EASE_PREMIUM }}
                  style={{ originY: 0, backgroundColor: "#4D7792" }}
                  className="absolute left-0 top-0 h-full w-[3px]"
                />

                <span
                  className="mb-4 block font-display text-5xl font-black leading-none"
                  style={{ color: "rgba(77,119,146,0.18)" }}
                >
                  0{i + 1}
                </span>
                <p className="font-sans text-sm font-medium leading-relaxed text-crunkie-cream/65">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── CUSTOM BRANDING ────── */}
      <section className="overflow-hidden bg-crunkie-white py-24 lg:py-36">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.8, ease: EASE_PREMIUM }}
              className="order-last lg:order-first"
            >
              <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl bg-crunkie-softcream lg:h-80">
                {([0.85, 0.55, 0.3] as const).map((op, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.1 + i * 0.05, 1], opacity: [op, op * 0.65, op] }}
                    transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
                    className="absolute rounded-full border-2"
                    style={{
                      width: `${180 + i * 80}px`,
                      height: `${180 + i * 80}px`,
                      borderColor: `rgba(199,154,91,${op * 0.28})`,
                    }}
                  />
                ))}
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Brush size={56} strokeWidth={1} style={{ color: "#C79A5B" }} className="relative z-10" />
                </motion.div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, ease: EASE_PREMIUM }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-6 bg-crunkie-gold" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-crunkie-gold">Custom</span>
              </div>
              <h2
                className="mb-5 font-display font-black leading-tight text-crunkie-dark"
                style={{ fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)" }}
              >
                <WordReveal text={customTitle} delay={0} color="dark" />
              </h2>
              <p className="font-sans text-base leading-relaxed text-crunkie-dark/65 lg:text-lg">
                {customBody}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────── INQUIRY FORM ────── */}
      <section className="overflow-hidden bg-crunkie-dark py-24 lg:py-36">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM }}
            className="mb-12 text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-crunkie-gold" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-crunkie-gold">Inquire</span>
              <span className="h-px w-8 bg-crunkie-gold" />
            </div>
            <h2
              className="mb-3 font-display font-black text-crunkie-white"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              {ctaTitle}
            </h2>
            <p className="font-sans text-base text-crunkie-cream/45">{ctaBody}</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: 0.15, duration: 0.65, ease: EASE_PREMIUM }}
            action="mailto:b2b@crunkiecookie.com"
            method="post"
            encType="text/plain"
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DarkFormField label={form.name} name="name" type="text" placeholder={form.namePlaceholder} required />
              <DarkFormField label={form.company} name="company" type="text" placeholder={form.companyPlaceholder} />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DarkFormField label={form.type} name="type" type="text" placeholder={form.typePlaceholder} />
              <DarkFormField label={form.quantity} name="quantity" type="text" placeholder={form.quantityPlaceholder} />
            </div>
            <DarkFormField label={form.message} name="message" type="textarea" placeholder={form.messagePlaceholder} rows={5} />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03, backgroundColor: "#FFFDF8", color: "#1F1714" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 rounded-full bg-crunkie-gold px-8 py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-crunkie-dark transition-colors duration-300"
            >
              {form.send}
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
                →
              </motion.span>
            </motion.button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
