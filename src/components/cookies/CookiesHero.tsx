"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, animate, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { EASE_PREMIUM } from "@/lib/utils";

/* Cookies floating in the header background */
const BG_COOKIES = [
  { src: "/assets/cookies/cookie-blackout.png", left: "84%", top: "22%", size: "clamp(130px,14vw,210px)", rotate: 20 },
  { src: "/assets/cookies/cookie-lotus.png",    left: "6%",  top: "62%", size: "clamp(100px,11vw,165px)", rotate: -16 },
  { src: "/assets/cookies/cookie-salt.png",     left: "74%", top: "76%", size: "clamp(80px,9vw,130px)",   rotate: 25 },
];

function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const val = useMotionValue(0);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(val, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toString();
      },
    });
    return () => controls.stop();
  }, [isInView, val, to]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}

interface CookiesHeroProps {
  title: string;
  subtitle: string;
  countLabel: string;
  count: number;
}

export function CookiesHero({ title, subtitle, countLabel, count }: CookiesHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div ref={sectionRef} className="relative overflow-hidden bg-crunkie-dark pb-20 pt-36 lg:pb-28 lg:pt-44">

      {/* Parallax background layer */}
      <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-[-10%]">
        {/* Atmospheric blobs */}
        <div className="absolute left-[-5%] top-[15%] h-[50vw] max-h-[420px] w-[50vw] max-w-[420px] rounded-full bg-crunkie-red/8 blur-[110px]" />
        <div
          className="absolute right-[-4%] bottom-[8%] h-[42vw] max-h-[360px] w-[42vw] max-w-[360px] rounded-full blur-[100px]"
          style={{ backgroundColor: "rgba(77,119,146,0.10)" }}
        />
        <div className="absolute left-[38%] top-[55%] h-[32vw] max-h-[280px] w-[32vw] max-w-[280px] rounded-full bg-crunkie-gold/6 blur-[85px]" />

        {/* Dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: "radial-gradient(circle, #FFFDF8 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />
      </motion.div>

      {/* Floating background cookies */}
      {BG_COOKIES.map((fc, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.55, rotate: fc.rotate - 12 }}
          animate={{ opacity: 0.09, scale: 1, rotate: fc.rotate }}
          transition={{ delay: 0.2 + i * 0.18, duration: 1.3, ease: EASE_PREMIUM }}
          style={{ left: fc.left, top: fc.top, width: fc.size, height: fc.size }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 hidden sm:block"
        >
          <motion.div
            animate={{ y: ["-7%", "7%", "-7%"] }}
            transition={{ duration: 6.5 + i * 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <Image src={fc.src} alt="" fill className="object-contain" sizes="210px" />
          </motion.div>
        </motion.div>
      ))}

      {/* Giant watermark C */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none overflow-hidden hidden lg:block"
      >
        <motion.span
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 1.1, ease: EASE_PREMIUM }}
          className="block font-display font-black italic leading-none text-crunkie-cream/[0.025]"
          style={{ fontSize: "clamp(10rem,28vw,25rem)" }}
        >
          C
        </motion.span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* Eyebrow */}
        <div className="mb-5 overflow-hidden">
          <motion.p
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE_PREMIUM }}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-crunkie-gold"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.28, duration: 0.5, ease: EASE_PREMIUM }}
              style={{ originX: 0 }}
              className="block h-px w-8 bg-crunkie-gold"
            />
            Crunkie
          </motion.p>
        </div>

        {/* Title — word by word */}
        <h1
          className="font-display font-black leading-[0.9] text-crunkie-white"
          style={{ fontSize: "clamp(3rem,9vw,8rem)" }}
        >
          {title.split(" ").map((word, wi) => (
            <span key={wi} className="mr-[0.18em] inline-block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.22 + wi * 0.13, duration: 0.82, ease: EASE_PREMIUM }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52, duration: 0.7, ease: EASE_PREMIUM }}
          className="mt-5 max-w-md font-sans text-base text-crunkie-cream/45 lg:text-lg"
        >
          {subtitle}
        </motion.p>

        {/* Animated count */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.6, ease: EASE_PREMIUM }}
          className="mt-4 flex items-end gap-2"
        >
          <CountUp
            to={count}
            className="font-display text-5xl font-black leading-none text-crunkie-red/30 lg:text-7xl"
          />
          <span className="mb-1 font-sans text-sm font-medium uppercase tracking-[0.22em] text-crunkie-cream/20 lg:mb-2">
            {countLabel}
          </span>
        </motion.div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.82, duration: 0.7, ease: EASE_PREMIUM }}
          style={{ originX: 0 }}
          className="mt-8 h-px w-24 bg-gradient-to-r from-crunkie-red/50 to-transparent"
        />
      </div>
    </div>
  );
}
