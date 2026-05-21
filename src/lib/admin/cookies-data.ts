import { list, put } from "@vercel/blob";
import { readFileSync } from "fs";
import { join } from "path";
import type { Cookie } from "@/data/cookies";

const PATH = "crunkie-data/cookies.json";

function loadDefault(): Cookie[] {
  const raw = readFileSync(join(process.cwd(), "src", "data", "cookies.json"), "utf-8");
  return JSON.parse(raw) as Cookie[];
}

export async function readCookies(): Promise<Cookie[]> {
  try {
    const { blobs } = await list({ prefix: PATH });
    if (blobs.length === 0) {
      const seed = loadDefault();
      await writeCookies(seed);
      return seed;
    }
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.json();
  } catch {
    return loadDefault();
  }
}

export async function writeCookies(data: Cookie[]): Promise<void> {
  await put(PATH, JSON.stringify(data, null, 2), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}
