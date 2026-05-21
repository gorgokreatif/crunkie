import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const allowed = ["png", "jpg", "jpeg", "webp", "avif"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const name = form.get("filename") as string | null;
  const filename = name ? `${name}.${ext}` : file.name;
  const dest = join(process.cwd(), "public", "assets", "cookies", filename);

  const buf = Buffer.from(await file.arrayBuffer());
  writeFileSync(dest, buf);

  return NextResponse.json({ path: `/assets/cookies/${filename}` });
}
