import { list, put } from "@vercel/blob";
import { readFileSync } from "fs";
import { join } from "path";

type Obj = Record<string, unknown>;

export type Locale = "en" | "de";

function loadDefault(locale: Locale): Obj {
  const raw = readFileSync(join(process.cwd(), "messages", `${locale}.json`), "utf-8");
  return JSON.parse(raw) as Obj;
}

export async function readMessages(locale: Locale): Promise<Obj> {
  try {
    const path = `crunkie-data/messages-${locale}.json`;
    const { blobs } = await list({ prefix: path });
    if (blobs.length === 0) return loadDefault(locale);
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    return res.json();
  } catch {
    return loadDefault(locale);
  }
}

export async function writeMessages(locale: Locale, data: Obj): Promise<void> {
  await put(`crunkie-data/messages-${locale}.json`, JSON.stringify(data, null, 2), {
    access: "public",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

export function flattenKeys(obj: Obj, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(result, flattenKeys(val as Obj, fullKey));
    } else {
      result[fullKey] = String(val ?? "");
    }
  }
  return result;
}

export function unflattenKeys(flat: Record<string, string>): Obj {
  const result: Obj = {};
  for (const [dotKey, val] of Object.entries(flat)) {
    const parts = dotKey.split(".");
    let cur: Obj = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in cur) || typeof cur[parts[i]] !== "object") {
        cur[parts[i]] = {};
      }
      cur = cur[parts[i]] as Obj;
    }
    cur[parts[parts.length - 1]] = val;
  }
  return result;
}

export const NAMESPACES = [
  "nav", "home", "cookies", "about", "b2b", "contact", "footer", "common",
] as const;
export type Namespace = (typeof NAMESPACES)[number];
