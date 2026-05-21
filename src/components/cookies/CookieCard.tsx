"use client";

import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { VeganBadge } from "./VeganBadge";
import { EASE_PREMIUM } from "@/lib/utils";
import type { Cookie } from "@/data/cookies";

/* Per-card tilt angles */
const TILTS = [
  -3.2, 2.4, -1.6, 3.0, -2.4, 1.8, -3.0, 2.6, -1.4, 3.4,
  -2.0, 1.6, -3.6, 2.2, -1.2, 2.8, -2.6, 1.4, -3.2, 2.0,
];

const VEGAN_ACCENT = {
  strip: "#4A8C5C",
  pillBg: "rgba(74,140,92,0.12)",
  pillColor: "#2D6B40",
  dotClass: "bg-[#4A8C5C]",
  hoverShadow: "0 28px 56px rgba(74,140,92,0.26), 0 8px 20px rgba(0,0,0,0.06)",
  idleShadow: "0 4px 18px rgba(74,140,92,0.10), 0 2px 6px rgba(0,0,0,0.04)",
};

/* Brand color accents — red / blue / gold cycling */
const ACCENTS = [
  {
    strip: "#AF5950",
    pillBg: "rgba(175,89,80,0.12)",
    pillColor: "#AF5950",
    dotClass: "bg-crunkie-red",
    hoverShadow: "0 28px 56px rgba(175,89,80,0.22), 0 8px 20px rgba(0,0,0,0.06)",
    idleShadow: "0 4px 18px rgba(175,89,80,0.10), 0 2px 6px rgba(0,0,0,0.04)",
  },
  {
    strip: "#4D7792",
    pillBg: "rgba(77,119,146,0.12)",
    pillColor: "#4D7792",
    dotClass: "bg-[#4D7792]",
    hoverShadow: "0 28px 56px rgba(77,119,146,0.24), 0 8px 20px rgba(0,0,0,0.06)",
    idleShadow: "0 4px 18px rgba(77,119,146,0.10), 0 2px 6px rgba(0,0,0,0.04)",
  },
  {
    strip: "#C79A5B",
    pillBg: "rgba(199,154,91,0.14)",
    pillColor: "#9A7138",
    dotClass: "bg-crunkie-gold",
    hoverShadow: "0 28px 56px rgba(199,154,91,0.28), 0 8px 20px rgba(0,0,0,0.06)",
    idleShadow: "0 4px 18px rgba(199,154,91,0.10), 0 2px 6px rgba(0,0,0,0.04)",
  },
];

interface CookieCardProps {
  cookie: Cookie;
  index?: number;
}

export function CookieCard({ cookie, index = 0 }: CookieCardProps) {
  const tilt = TILTS[index % TILTS.length];
  const acc = cookie.isVegan ? VEGAN_ACCENT : ACCENTS[index % ACCENTS.length];
  const num = String(index + 1).padStart(2, "0");

  /* Spring-based hover */
  const rotate = useSpring(tilt, { stiffness: 220, damping: 22 });
  const y = useSpring(0, { stiffness: 220, damping: 22 });
  const scale = useSpring(1, { stiffness: 220, damping: 22 });
  const shadow = useSpring(0, { stiffness: 220, damping: 22 });

  /* Inner 3D tilt from mouse */
  const mX = useMotionValue(0.5);
  const mY = useMotionValue(0.5);
  const imgRotX = useTransform(mX, [0, 1], ["-5deg", "5deg"]);
  const imgRotY = useTransform(mY, [0, 1], ["4deg", "-4deg"]);

  const boxShadow = useTransform(
    shadow,
    [0, 1],
    [acc.idleShadow, acc.hoverShadow]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-4% 0px" }}
      transition={{ delay: (index % 4) * 0.07, duration: 0.7, ease: EASE_PREMIUM }}
    >
      <motion.div
        style={{
          rotate,
          y,
          scale,
          boxShadow,
          backgroundColor: "#F7F0E7",
          borderRadius: "18px",
        }}
        onHoverStart={() => {
          rotate.set(0);
          y.set(-16);
          scale.set(1.04);
          shadow.set(1);
        }}
        onHoverEnd={() => {
          rotate.set(tilt);
          y.set(0);
          scale.set(1);
          shadow.set(0);
        }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mX.set((e.clientX - r.left) / r.width);
          mY.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => {
          mX.set(0.5);
          mY.set(0.5);
        }}
        className="relative overflow-hidden"
      >
        {/* ── Colour accent strip at top ── */}
        <div
          className="h-[5px] w-full"
          style={{ backgroundColor: acc.strip }}
        />

        <Link href={`/cookies/${cookie.slug}`} className="block">

          {/* ── Image area ── */}
          <div className="relative px-5 pt-5 pb-2" style={{ perspective: "700px" }}>

            {/* Faint background number */}
            <div
              aria-hidden
              className="pointer-events-none absolute right-3 top-1 select-none font-display font-black leading-none"
              style={{ fontSize: "clamp(4rem, 11vw, 6rem)", color: "rgba(31,23,20,0.05)" }}
            >
              {num}
            </div>

            {/* Cookie image with inner tilt */}
            <motion.div
              style={{ rotateX: imgRotX, rotateY: imgRotY, transformStyle: "preserve-3d" }}
              className="relative mx-auto aspect-square w-full max-w-[220px]"
            >
              <Image
                src={cookie.image}
                alt={cookie.name}
                fill
                className="object-contain drop-shadow-xl"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </motion.div>

            {/* Vegan badge */}
            {cookie.isVegan && (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: -8 }}
                transition={{ delay: 0.3 + (index % 4) * 0.07, type: "spring", bounce: 0.6 }}
                className="absolute top-3 right-3 z-10"
              >
                <VeganBadge size="sm" />
              </motion.div>
            )}
          </div>

          {/* ── Text area ── */}
          <div className="px-4 pt-1 pb-4">

            {/* Number label with accent dot */}
            <div className="mb-1.5 flex items-center gap-1.5">
              <div className={`h-[5px] w-[5px] rounded-full ${acc.dotClass}`} />
              <span
                className="font-sans text-[8px] font-bold uppercase tracking-[0.35em]"
                style={{ color: acc.pillColor }}
              >
                {num}
              </span>
            </div>

            {/* Cookie name */}
            <h3
              className="font-display font-black leading-[1.05] text-crunkie-dark"
              style={{ fontSize: "clamp(1rem, 2.4vw, 1.35rem)" }}
            >
              {cookie.name}
            </h3>

            {/* Flavor pills — brand colored */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cookie.flavorNotes.slice(0, 2).map((note) => (
                <span
                  key={note}
                  className="rounded-full px-2.5 py-0.5 font-sans text-[8px] font-semibold uppercase tracking-widest"
                  style={{ background: acc.pillBg, color: acc.pillColor }}
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
