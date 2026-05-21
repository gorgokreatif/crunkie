import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Cookie } from "@/data/cookies";

const DATA_PATH = join(process.cwd(), "src", "data", "cookies.json");

export function readCookies(): Cookie[] {
  const raw = readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Cookie[];
}

export function writeCookies(data: Cookie[]): void {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n", "utf-8");
}
