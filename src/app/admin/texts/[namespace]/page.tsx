import { readMessages, flattenKeys, NAMESPACES } from "@/lib/admin/texts-data";
import { notFound } from "next/navigation";
import { TextEditor } from "./TextEditor";
import type { Namespace } from "@/lib/admin/texts-data";

export default async function TextNamespacePage({ params }: { params: Promise<{ namespace: string }> }) {
  const { namespace } = await params;
  if (!NAMESPACES.includes(namespace as Namespace)) notFound();

  const ns = namespace as Namespace;
  const en = readMessages("en");
  const de = readMessages("de");

  const enFlat = flattenKeys((en[ns] ?? {}) as Record<string, unknown>);
  const deFlat = flattenKeys((de[ns] ?? {}) as Record<string, unknown>);

  return (
    <div className="p-8 lg:p-10">
      <div className="mb-8">
        <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C79A5B" }}>
          Texts
        </p>
        <h1 className="font-display text-3xl font-black capitalize" style={{ color: "#FFFDF8" }}>
          {ns}
        </h1>
        <p className="mt-2 font-sans text-sm" style={{ color: "rgba(232,225,215,0.35)" }}>
          {Object.keys(enFlat).length} keys · English & German
        </p>
      </div>
      <TextEditor namespace={ns} initialEn={enFlat} initialDe={deFlat} />
    </div>
  );
}
