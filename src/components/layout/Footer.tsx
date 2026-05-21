import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AtSign, Music2 } from "lucide-react";

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");

  return (
    <footer className="bg-crunkie-dark text-crunkie-cream/80">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image
                src="/assets/logos/logo-crunkie-light.png"
                alt="Crunkie"
                width={140}
                height={32}
                className="mb-5 h-8 w-auto object-contain opacity-90"
              />
            </Link>
            <p className="font-sans text-sm leading-relaxed text-crunkie-cream/60 max-w-xs">
              {t("tagline")}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.instagram.com/crunkiecookie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-crunkie-cream/20 text-crunkie-cream/60 transition-all duration-200 hover:border-crunkie-red hover:text-crunkie-red"
              >
                <AtSign size={16} />
              </a>
              <a
                href="https://www.tiktok.com/@crunkiecookie"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-crunkie-cream/20 text-crunkie-cream/60 transition-all duration-200 hover:border-crunkie-red hover:text-crunkie-red"
              >
                <Music2 size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-crunkie-gold">
              {t("navTitle")}
            </p>
            <ul className="space-y-3">
              {(["cookies", "about", "b2b", "contact"] as const).map((key) => (
                <li key={key}>
                  <Link
                    href={`/${key}`}
                    className="font-sans text-sm text-crunkie-cream/60 transition-colors duration-200 hover:text-crunkie-white"
                  >
                    {tn(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-widest text-crunkie-gold">
              {t("contactTitle")}
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@crunkiecookie.com"
                  className="font-sans text-sm text-crunkie-cream/60 transition-colors duration-200 hover:text-crunkie-white break-all"
                >
                  hello@crunkiecookie.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:b2b@crunkiecookie.com"
                  className="font-sans text-sm text-crunkie-cream/60 transition-colors duration-200 hover:text-crunkie-white break-all"
                >
                  b2b@crunkiecookie.com
                </a>
              </li>
              <li className="pt-2">
                <p className="font-sans text-sm text-crunkie-cream/60">
                  {t("address")}
                </p>
                <p className="font-sans text-xs text-crunkie-gold/70 mt-1">
                  {t("aachen")}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-crunkie-chocolate/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 md:flex-row lg:px-8">
          <p className="font-sans text-xs text-crunkie-cream/30">
            © {new Date().getFullYear()} Crunkie. {t("rights")}
          </p>
          <p className="font-sans text-xs text-crunkie-cream/30">
            crunkiecookie.com
          </p>
        </div>
      </div>
    </footer>
  );
}
