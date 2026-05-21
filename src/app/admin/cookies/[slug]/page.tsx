import { readCookies } from "@/lib/admin/cookies-data";
import { notFound } from "next/navigation";
import { CookieForm } from "../CookieForm";

export default async function EditCookiePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookie = readCookies().find((c) => c.slug === slug);
  if (!cookie) notFound();

  return (
    <div className="p-8 lg:p-10">
      <div className="mb-8">
        <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C79A5B" }}>
          Cookies
        </p>
        <h1 className="font-display text-3xl font-black" style={{ color: "#FFFDF8" }}>
          {cookie.name}
        </h1>
      </div>
      <div className="max-w-3xl">
        <CookieForm mode="edit" initial={cookie} />
      </div>
    </div>
  );
}
