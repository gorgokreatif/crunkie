import { NextRequest, NextResponse } from "next/server";
import {
  readMessages,
  writeMessages,
  flattenKeys,
  unflattenKeys,
} from "@/lib/admin/texts-data";
import type { Namespace } from "@/lib/admin/texts-data";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ namespace: string }> }) {
  const { namespace } = await params;
  const en = await readMessages("en");
  const de = await readMessages("de");
  const ns = namespace as Namespace;
  const enNs = (en[ns] ?? {}) as Record<string, unknown>;
  const deNs = (de[ns] ?? {}) as Record<string, unknown>;
  return NextResponse.json({
    en: flattenKeys(enNs),
    de: flattenKeys(deNs),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ namespace: string }> }) {
  const { namespace } = await params;
  const { en: enFlat, de: deFlat } = await req.json() as {
    en: Record<string, string>;
    de: Record<string, string>;
  };
  const ns = namespace as Namespace;

  const enAll = await readMessages("en");
  const deAll = await readMessages("de");
  enAll[ns] = unflattenKeys(enFlat);
  deAll[ns] = unflattenKeys(deFlat);
  await writeMessages("en", enAll);
  await writeMessages("de", deAll);

  return NextResponse.json({ ok: true });
}
