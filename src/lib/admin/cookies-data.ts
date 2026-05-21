import { kv } from "@vercel/kv";
import { readFileSync } from "fs";
import { join } from "path";
import type { Cookie } from "@/data/cookies";

const KEY = "cookies:all";

function loadDefault(): Cookie[] {
  const raw = readFileSync(join(process.cwd(), "src", "data", "cookies.json"), "utf-8");
  return JSON.parse(raw) as Cookie[];
}

export async function readCookies(): Promise<Cookie[]> {
  try {
    const data = await kv.get<Cookie[]>(KEY);
    if (!data) {
      const seed = loadDefault();
      await kv.set(KEY, seed);
      return seed;
    }
    return data;
  } catch {
    return loadDefault();
  }
}

export async function writeCookies(data: Cookie[]): Promise<void> {
  await kv.set(KEY, data);
}
