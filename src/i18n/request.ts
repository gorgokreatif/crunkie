import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { kv } from "@vercel/kv";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "de" | "en")) {
    locale = routing.defaultLocale;
  }

  let messages: Record<string, unknown>;
  try {
    const kvMessages = await kv.get<Record<string, unknown>>(`messages:${locale}`);
    messages = kvMessages ?? (await import(`../../messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`../../messages/${locale}.json`)).default;
  }

  return { locale, messages };
});
