"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "light" | "dark";
}

export function LanguageSwitcher({
  className,
  variant = "dark",
}: LanguageSwitcherProps) {
  const locale = useLocale();

  function switchLocale(next: "de" | "en") {
    const seg = window.location.pathname.split("/").filter(Boolean);
    if (seg[0] === "de" || seg[0] === "en") {
      seg[0] = next;
    } else {
      seg.unshift(next);
    }
    window.location.href = "/" + seg.join("/") + window.location.search;
  }

  return (
    <div
      className={cn(
        "pointer-events-auto flex items-center rounded-full border p-0.5 font-sans text-[11px] font-bold",
        variant === "dark"
          ? "border-crunkie-cream/15 bg-crunkie-cream/5"
          : "border-crunkie-dark/15 bg-crunkie-dark/5",
        className
      )}
    >
      {(["de", "en"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchLocale(lang)}
          className={cn(
            "relative cursor-pointer rounded-full px-3 py-2 uppercase tracking-widest transition-colors duration-200",
            locale === lang
              ? "text-crunkie-white"
              : variant === "dark"
                ? "text-crunkie-cream/55 hover:text-crunkie-cream/80"
                : "text-crunkie-dark/60 hover:text-crunkie-dark/85"
          )}
        >
          {locale === lang && (
            <motion.span
              layoutId={`lang-pill-${variant}`}
              className="absolute inset-0 rounded-full bg-crunkie-red"
              transition={{ type: "spring", bounce: 0.2, duration: 0.32 }}
            />
          )}
          <span className="relative z-10">{lang.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
