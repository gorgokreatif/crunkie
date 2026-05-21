"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Namespace } from "@/lib/admin/texts-data";

const INPUT_CLS = "w-full rounded-lg border px-3 py-2 font-sans text-sm outline-none transition-all duration-200";
const INPUT_STYLE = { backgroundColor: "rgba(232,225,215,0.05)", borderColor: "rgba(232,225,215,0.1)", color: "#FFFDF8" };

interface Props {
  namespace: Namespace;
  initialEn: Record<string, string>;
  initialDe: Record<string, string>;
}

export function TextEditor({ namespace, initialEn, initialDe }: Props) {
  const router = useRouter();
  const [en, setEn] = useState(initialEn);
  const [de, setDe] = useState(initialDe);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const keys = Object.keys(en);

  function isMultiLine(val: string) {
    return val.includes("\\n") || val.length > 100;
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/texts/${namespace}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ en, de }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-5">
      {/* Column header */}
      <div className="grid grid-cols-[200px_1fr_1fr] gap-4 pb-2 border-b" style={{ borderColor: "rgba(232,225,215,0.06)" }}>
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "rgba(232,225,215,0.25)" }}>Key</span>
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "rgba(232,225,215,0.25)" }}>English</span>
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "rgba(232,225,215,0.25)" }}>Deutsch</span>
      </div>

      {keys.map((key) => {
        const multi = isMultiLine(en[key] ?? "") || isMultiLine(de[key] ?? "");
        return (
          <div key={key} className="grid grid-cols-[200px_1fr_1fr] gap-4 items-start">
            {/* Key label */}
            <div className="pt-2">
              <code className="block break-all font-mono text-[10px] leading-relaxed" style={{ color: "rgba(232,225,215,0.35)" }}>
                {key}
              </code>
            </div>

            {/* EN */}
            {multi ? (
              <textarea
                className={`${INPUT_CLS} resize-none`}
                style={INPUT_STYLE}
                rows={3}
                value={en[key] ?? ""}
                onChange={(e) => setEn({ ...en, [key]: e.target.value })}
              />
            ) : (
              <input
                className={INPUT_CLS}
                style={INPUT_STYLE}
                value={en[key] ?? ""}
                onChange={(e) => setEn({ ...en, [key]: e.target.value })}
              />
            )}

            {/* DE */}
            {multi ? (
              <textarea
                className={`${INPUT_CLS} resize-none`}
                style={INPUT_STYLE}
                rows={3}
                value={de[key] ?? ""}
                onChange={(e) => setDe({ ...de, [key]: e.target.value })}
              />
            ) : (
              <input
                className={INPUT_CLS}
                style={INPUT_STYLE}
                value={de[key] ?? ""}
                onChange={(e) => setDe({ ...de, [key]: e.target.value })}
              />
            )}
          </div>
        );
      })}

      {/* Save bar */}
      <div className="sticky bottom-0 flex items-center gap-4 rounded-xl border p-4" style={{ backgroundColor: "#1C1108", borderColor: "rgba(232,225,215,0.07)" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg px-6 py-2.5 font-sans text-sm font-bold uppercase tracking-[0.15em] transition-all duration-200 disabled:opacity-50"
          style={{ backgroundColor: saving ? "#3A241D" : "#AF5950", color: "#FFFDF8" }}
        >
          {saving ? "Saving…" : "Save All"}
        </button>
        {saved && (
          <span className="font-sans text-sm" style={{ color: "#4A8C5C" }}>
            ✓ Saved
          </span>
        )}
        <span className="ml-auto font-sans text-xs" style={{ color: "rgba(232,225,215,0.25)" }}>
          {keys.length} keys
        </span>
      </div>
    </div>
  );
}
