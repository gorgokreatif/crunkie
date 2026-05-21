import { NextRequest, NextResponse } from "next/server";
import { readCookies, writeCookies } from "@/lib/admin/cookies-data";
import type { Cookie } from "@/data/cookies";

export async function GET() {
  return NextResponse.json(readCookies());
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Cookie;
  const all = readCookies();
  if (all.find((c) => c.slug === body.slug)) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }
  all.push(body);
  writeCookies(all);
  return NextResponse.json(body, { status: 201 });
}
