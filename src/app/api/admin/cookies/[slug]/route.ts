import { NextRequest, NextResponse } from "next/server";
import { readCookies, writeCookies } from "@/lib/admin/cookies-data";
import type { Cookie } from "@/data/cookies";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookie = readCookies().find((c) => c.slug === slug);
  if (!cookie) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cookie);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const body = await req.json() as Partial<Cookie>;
  const all = readCookies();
  const idx = all.findIndex((c) => c.slug === slug);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  all[idx] = { ...all[idx], ...body, slug };
  writeCookies(all);
  return NextResponse.json(all[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = readCookies();
  const next = all.filter((c) => c.slug !== slug);
  if (next.length === all.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  writeCookies(next);
  return NextResponse.json({ ok: true });
}
