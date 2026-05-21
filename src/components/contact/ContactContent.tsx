"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { Mail, MapPin, AtSign, Music2 } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/utils";

const SPRINKLES = [
  { color: "#AF5950", size: 9,  x: "8%",  y: "25%", dur: 3.4, delay: 0 },
  { color: "#C79A5B", size: 6,  x: "18%", y: "70%", dur: 4.2, delay: 0.6 },
  { color: "#4D7792", size: 11, x: "78%", y: "20%", dur: 3.8, delay: 1.1 },
  { color: "#AF5950", size: 7,  x: "86%", y: "62%", dur: 5.0, delay: 0.3 },
  { color: "#C79A5B", size: 8,  x: "48%", y: "8%",  dur: 3.2, delay: 0.9 },
  { color: "#4D7792", size: 6,  x: "92%", y: "40%", dur: 4.6, delay: 1.5 },
];

interface FormData {
  name: string; email: string; message: string; send: string;
  namePlaceholder: string; emailPlaceholder: string; messagePlaceholder: string;
}

interface Props {
  title: string;
  subtitle: string;
  formTitle: string;
  form: FormData;
  infoTitle: string;
  emailGeneral: string;
  emailB2B: string;
  addressTitle: string;
  address: string;
  comingSoon: string;
  directions: string;
  followUs: string;
  generalLabel: string;
  b2bLabel: string;
}

function WordReveal({ text, delay = 0, color = "white" }: { text: string; delay?: number; color?: "white" | "red" | "dark" }) {
  const colorClass = color === "red" ? "text-crunkie-red" : color === "dark" ? "text-crunkie-dark" : "text-crunkie-white";
  return (
    <span className="inline-flex flex-wrap gap-x-[0.22em]">
      {text.split(" ").map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: delay + i * 0.09, duration: 0.75, ease: EASE_PREMIUM }}
            className={`inline-block ${colorClass}`}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function LightFormField({
  label, name, type = "text", placeholder, required, rows,
}: {
  label: string; name: string; type?: "text" | "email" | "textarea";
  placeholder: string; required?: boolean; rows?: number;
}) {
  return (
    <div className="group relative">
      <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-crunkie-dark/40">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          name={name}
          rows={rows ?? 6}
          placeholder={placeholder}
          required={required}
          className="w-full resize-none border-b-2 border-crunkie-cream bg-transparent px-0 py-3 font-sans text-sm text-crunkie-dark placeholder:text-crunkie-dark/25 focus:border-crunkie-red focus:outline-none transition-colors duration-300"
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full border-b-2 border-crunkie-cream bg-transparent px-0 py-3 font-sans text-sm text-crunkie-dark placeholder:text-crunkie-dark/25 focus:border-crunkie-red focus:outline-none transition-colors duration-300"
        />
      )}
    </div>
  );
}

export function ContactContent({
  title, subtitle, formTitle, form,
  infoTitle, emailGeneral, emailB2B,
  addressTitle, address, comingSoon, directions,
  followUs, generalLabel, b2bLabel,
}: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const sp = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgY = useTransform(sp, [0, 1], ["0%", "-20%"]);
  const cookieY = useTransform(sp, [0, 1], ["0%", "-28%"]);

  return (
    <div>
      {/* ────── HERO ────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ backgroundColor: "#1A0F0A", minHeight: "70vh" }}
      >
        {/* Parallax glows */}
        <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-[-15%]">
          <div className="absolute right-[5%] top-[15%] h-[50vw] max-h-[460px] w-[50vw] max-w-[460px] rounded-full bg-crunkie-red/8 blur-[130px]" />
          <div className="absolute left-[5%] bottom-[10%] h-[40vw] max-h-[360px] w-[40vw] max-w-[360px] rounded-full blur-[110px]" style={{ backgroundColor: "rgba(199,154,91,0.07)" }} />
        </motion.div>

        {/* Dot texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #FFFDF8 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }}
        />

        {/* Watermark */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-end overflow-hidden select-none pb-0">
          <span
            className="font-display font-black italic leading-none whitespace-nowrap"
            style={{ fontSize: "clamp(8rem, 22vw, 20rem)", color: "rgba(175,89,80,0.06)" }}
          >
            {title}
          </span>
        </div>

        {/* Sprinkle dots */}
        {mounted && SPRINKLES.map((s, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute rounded-full"
            style={{ width: s.size, height: s.size, left: s.x, top: s.y, backgroundColor: s.color }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.45, 0.25, 0.45, 0], scale: [0, 1, 0.9, 1, 0], y: [0, -14, 0, 14, 0] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}

        {/* Floating cookie */}
        {mounted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: 20 }}
            animate={{ opacity: 0.75, scale: 1, rotate: 12 }}
            transition={{ delay: 0.6, duration: 1.0, type: "spring", bounce: 0.3 }}
            className="pointer-events-none absolute hidden lg:block"
            style={{ right: "8%", top: "50%", transform: "translateY(-50%)" }}
          >
            <motion.div
              animate={{ y: [-14, 14, -14], rotate: [12, 8, 12] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ y: cookieY }}
            >
              <Image
                src="/assets/cookies/cookie-matcha-kiss.png"
                alt="cookie"
                width={300}
                height={300}
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Hero text */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-36 lg:px-8 lg:pt-44">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_PREMIUM }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-crunkie-red" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-crunkie-red">Contact</span>
          </motion.div>

          <h1
            className="mb-5 font-display font-black leading-[0.9] text-crunkie-white"
            style={{ fontSize: "clamp(4rem, 10vw, 10rem)" }}
          >
            <WordReveal text={title} delay={0.1} color="white" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.65, ease: EASE_PREMIUM }}
            className="font-sans text-base text-crunkie-cream/45 lg:text-lg"
          >
            {subtitle}
          </motion.p>
        </div>
      </section>

      {/* ────── CONTENT ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* ── FORM (cream) ── */}
        <div className="bg-crunkie-softcream px-6 py-20 lg:px-16 lg:py-28">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.75, ease: EASE_PREMIUM }}
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="h-px w-6 bg-crunkie-red" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-crunkie-red">Message</span>
            </div>
            <h2
              className="mb-10 font-display font-black text-crunkie-dark"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
            >
              {formTitle}
            </h2>

            <form
              action="mailto:hello@crunkiecookie.com"
              method="post"
              encType="text/plain"
              className="space-y-8"
            >
              {[
                { label: form.name, name: "name", type: "text" as const, placeholder: form.namePlaceholder, required: true },
                { label: form.email, name: "email", type: "email" as const, placeholder: form.emailPlaceholder, required: true },
              ].map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.55, ease: EASE_PREMIUM }}
                >
                  <LightFormField {...f} />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.55, ease: EASE_PREMIUM }}
              >
                <LightFormField label={form.message} name="message" type="textarea" placeholder={form.messagePlaceholder} required rows={6} />
              </motion.div>

              <motion.button
                type="submit"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.55, ease: EASE_PREMIUM }}
                whileHover={{ scale: 1.03, backgroundColor: "#1F1714" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 rounded-full bg-crunkie-red px-8 py-4 font-sans text-sm font-bold uppercase tracking-[0.2em] text-crunkie-white transition-colors duration-300"
              >
                {form.send}
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
                  →
                </motion.span>
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* ── INFO (dark) ── */}
        <div className="relative overflow-hidden bg-crunkie-dark px-6 py-20 lg:px-16 lg:py-28">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute right-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-crunkie-red/8 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-[-5%] left-[-5%] h-[40%] w-[40%] rounded-full blur-[80px]" style={{ backgroundColor: "rgba(199,154,91,0.06)" }} />

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.75, ease: EASE_PREMIUM }}
            className="relative z-10"
          >
            <div className="mb-2 flex items-center gap-3">
              <span className="h-px w-6 bg-crunkie-gold" />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-crunkie-gold">Info</span>
            </div>
            <h2
              className="mb-10 font-display font-black text-crunkie-white"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
            >
              {infoTitle}
            </h2>

            <div className="space-y-10">
              {/* Emails */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6, ease: EASE_PREMIUM }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <Mail size={14} strokeWidth={2} className="text-crunkie-red" />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-crunkie-cream/35">Email</span>
                </div>
                <div className="space-y-4 pl-5 border-l border-crunkie-red/20">
                  {[
                    { label: generalLabel, email: emailGeneral },
                    { label: b2bLabel,     email: emailB2B },
                  ].map(({ label, email }, i) => (
                    <motion.div
                      key={email}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: EASE_PREMIUM }}
                    >
                      <p className="mb-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-crunkie-cream/30">
                        {label}
                      </p>
                      <motion.a
                        href={`mailto:${email}`}
                        whileHover={{ x: 4, color: "#AF5950" }}
                        transition={{ duration: 0.2 }}
                        className="font-sans text-sm font-medium text-crunkie-cream/70 transition-colors duration-200"
                      >
                        {email}
                      </motion.a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6, ease: EASE_PREMIUM }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <MapPin size={14} strokeWidth={2} className="text-crunkie-red" />
                  </motion.div>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-crunkie-cream/35">
                    {addressTitle}
                  </span>
                </div>
                <div className="pl-5 border-l border-crunkie-gold/20 space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5, ease: EASE_PREMIUM }}
                  >
                    <p className="mb-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-crunkie-gold/60">
                      Bonn
                    </p>
                    <p className="font-sans text-sm text-crunkie-cream/65 whitespace-pre-line">{address}</p>
                    <motion.a
                      href="https://maps.google.com/?q=Am+Neutor+6,+53113+Bonn"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1 inline-block font-sans text-xs text-crunkie-red/70 hover:text-crunkie-red transition-colors duration-200"
                    >
                      {directions} →
                    </motion.a>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.38, duration: 0.5, ease: EASE_PREMIUM }}
                  >
                    <p className="font-sans text-sm" style={{ color: "rgba(199,154,91,0.55)" }}>{comingSoon}</p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Social */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6, ease: EASE_PREMIUM }}
              >
                <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-crunkie-cream/35">
                  {followUs}
                </p>
                <div className="flex gap-3">
                  {[
                    { href: "https://www.instagram.com/crunkiecookie", Icon: AtSign, label: "Instagram", color: "#AF5950" },
                    { href: "https://www.tiktok.com/@crunkiecookie",   Icon: Music2,  label: "TikTok",    color: "#C79A5B" },
                  ].map(({ href, Icon, label, color }, i) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.5, type: "spring", bounce: 0.5 }}
                      whileHover={{ y: -3, scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 rounded-full border px-5 py-2.5 font-sans text-sm font-medium text-crunkie-cream/65 transition-all duration-300"
                      style={{ borderColor: `${color}25` }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${color}60`; (e.currentTarget as HTMLElement).style.color = color; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${color}25`; (e.currentTarget as HTMLElement).style.color = "rgba(232,225,215,0.65)"; }}
                    >
                      <Icon size={14} />
                      {label}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
