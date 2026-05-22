import { list, put } from "@vercel/blob";
import { readFileSync } from "fs";
import { join } from "path";
import { unstable_cache, revalidateTag } from "next/cache";
import type { Cookie } from "@/data/cookies";

const PATH = "crunkie-data/cookies.json";

function loadDefault(): Cookie[] {
  const raw = readFileSync(join(process.cwd(), "src", "data", "cookies.json"), "utf-8");
  return JSON.parse(raw) as Cookie[];
}

async function fetchCookies(): Promise<Cookie[]> {
  try {
    const { blobs } = await list({ prefix: PATH });
    if (blobs.length === 0) return loadDefault();
    const res = await fetch(blobs[0].url);
    return res.json();
  } catch {
    return loadDefault();
  }
}

export const readCookies = unstable_cache(fetchCookies, ["cookies"], {
  tags: ["cookies"],
  revalidate: 3600,
});

export async function writeCookies(data: Cookie[]): Promise<void> {
  await put(PATH, JSON.stringify(data, null, 2), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
  revalidateTag("cookies", "max");
}
