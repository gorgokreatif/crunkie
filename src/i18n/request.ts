import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { list } from "@vercel/blob";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "de" | "en")) {
    locale = routing.defaultLocale;
  }

  let messages: Record<string, unknown>;
  try {
    const { blobs } = await list({ prefix: `crunkie-data/messages-${locale}.json` });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      messages = await res.json();
    } else {
      messages = (await import(`../../messages/${locale}.json`)).default;
    }
  } catch {
    messages = (await import(`../../messages/${locale}.json`)).default;
  }

  return { locale, messages };
});
