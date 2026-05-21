import cookiesData from "./cookies.json";

export interface Cookie {
  slug: string;
  name: string;
  image: string;
  isVegan: boolean;
  featured: boolean;
  description: { en: string; de: string };
  flavorNotes: string[];
  tags: string[];
}

export const cookies: Cookie[] = cookiesData as Cookie[];

export const featuredCookies = cookies.filter((c) => c.featured);

export function getCookieBySlug(slug: string): Cookie | undefined {
  return cookies.find((c) => c.slug === slug);
}

export function getRelatedCookies(slug: string, count = 3): Cookie[] {
  const cookie = getCookieBySlug(slug);
  if (!cookie) return cookies.slice(0, count);
  return cookies
    .filter((c) => c.slug !== slug)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}
