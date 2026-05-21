"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Cookie } from "@/data/cookies";
import { CookieCard } from "@/components/cookies/CookieCard";
import { EASE_PREMIUM } from "@/lib/utils";

export function FeaturedCookies({ cookies }: { cookies: Cookie[] }) {
  const t = useTranslations("home.featured");

  return (
    <section className="relative overflow-hidden bg-crunkie-softcream py-24 lg:py-36">

      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 left-0 select-none overflow-hidden leading-none font-display font-black italic text-crunkie-dark/[0.035]"
        style={{ fontSize: "clamp(8rem, 22vw, 18rem)" }}
      >
        faves
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_PREMIUM }}
              className="mb-3 flex items-center gap-2.5"
            >
              <div className="h-2 w-2 rounded-full bg-crunkie-red" />
              <span className="font-sans text-xs font-bold uppercase tracking-[0.32em] text-crunkie-dark/35">
                Featured
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, ease: EASE_PREMIUM }}
                className="font-display font-black leading-[0.92] text-crunkie-dark"
                style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)" }}
              >
                {t("title")}
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6, ease: EASE_PREMIUM }}
              className="mt-3 font-sans text-base text-crunkie-dark/40"
            >
              {t("subtitle")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.6, ease: EASE_PREMIUM }}
          >
            <Link
              href="/cookies"
              className="group inline-flex items-center gap-3 rounded-full border-2 border-crunkie-dark/15 px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.22em] text-crunkie-dark/60 transition-all duration-300 hover:border-crunkie-red hover:text-crunkie-red"
            >
              {t("cta")}
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {cookies.map((cookie, i) => (
            <CookieCard key={cookie.slug} cookie={cookie} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
