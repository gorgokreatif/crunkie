import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type Obj = Record<string, unknown>;

export type Locale = "en" | "de";

export function readMessages(locale: Locale): Obj {
  const path = join(process.cwd(), "messages", `${locale}.json`);
  return JSON.parse(readFileSync(path, "utf-8")) as Obj;
}

export function writeMessages(locale: Locale, data: Obj): void {
  const path = join(process.cwd(), "messages", `${locale}.json`);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf-8");
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
