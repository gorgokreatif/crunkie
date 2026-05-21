"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "home", href: "/" },
  { key: "cookies", href: "/cookies" },
  { key: "about", href: "/about" },
  { key: "b2b", href: "/b2b" },
  { key: "contact", href: "/contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 180);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* Pill mode: when scrolled on home, or always on non-home pages */
  const pill = scrolled || !isHome;

  return (
    /* pointer-events-none on header so users can click through empty space around pill */
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">

      {/* ── Nav bar ── */}
      <div
        className={cn(
          "pointer-events-auto transition-all duration-500",
          pill ? "px-4 pt-4" : "px-0 pt-0"
        )}
      >
        <nav
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between transition-all duration-400",
            pill
              ? "rounded-full bg-crunkie-white/95 px-5 py-2.5 shadow-[0_4px_28px_rgba(31,23,20,0.13),0_1px_6px_rgba(31,23,20,0.06)] backdrop-blur-lg"
              : "px-6 py-5 lg:px-8"
          )}
        >
          {/* Logo — bounces on hover */}
          <Link href="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -7 }}
              whileTap={{ scale: 0.9, rotate: 4 }}
              transition={{ type: "spring", stiffness: 550, damping: 16 }}
            >
              <Image
                src={pill ? "/assets/logos/logo-crunkie.png" : "/assets/logos/logo-crunkie-light.png"}
                alt="Crunkie"
                width={120}
                height={28}
                className="h-7 w-auto"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop nav — sliding red pill indicator */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ key, href }) => (
              <li key={key}>
                <Link href={href} className="relative block px-4 py-2">
                  {/* Active pill — animated with layoutId */}
                  {pathname === href && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-crunkie-red"
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 font-sans text-xs font-bold uppercase tracking-[0.22em] transition-colors duration-200",
                      pathname === href
                        ? "text-crunkie-white"
                        : pill
                          ? "text-crunkie-dark/50 hover:text-crunkie-dark"
                          : "text-crunkie-white/65 hover:text-crunkie-white"
                    )}
                  >
                    {t(key)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher variant={pill ? "light" : "dark"} className="hidden md:flex" />

            {/* Hamburger — morphs on click with spring */}
            <motion.button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.88 }}
              className={cn(
                "flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-full md:hidden",
                pill ? "bg-crunkie-softcream" : "bg-crunkie-white/10"
              )}
            >
              <motion.span
                animate={menuOpen ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 550, damping: 26 }}
                className={cn("block h-[2px] w-[15px] origin-center", pill ? "bg-crunkie-dark" : "bg-crunkie-white")}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.14 }}
                className={cn("block h-[2px] w-[10px]", pill ? "bg-crunkie-dark" : "bg-crunkie-white")}
              />
              <motion.span
                animate={menuOpen ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 550, damping: 26 }}
                className={cn("block h-[2px] w-[15px] origin-center", pill ? "bg-crunkie-dark" : "bg-crunkie-white")}
              />
            </motion.button>
          </div>
        </nav>
      </div>

      {/* ── Mobile menu — spring-bounce card ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="pointer-events-auto mx-4 mt-2 overflow-hidden rounded-2xl bg-crunkie-white shadow-2xl shadow-crunkie-dark/15 md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map(({ key, href }, i) => (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Link
                    href={href}
                    className={cn(
                      "block rounded-xl px-4 py-3 font-sans text-sm font-bold uppercase tracking-[0.2em] transition-colors",
                      pathname === href
                        ? "bg-crunkie-red text-crunkie-white"
                        : "text-crunkie-dark/55 hover:bg-crunkie-softcream hover:text-crunkie-dark"
                    )}
                  >
                    {t(key)}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22 }}
                className="mt-2 border-t border-crunkie-cream/50 pt-3"
              >
                <LanguageSwitcher variant="light" />
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
