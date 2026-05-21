"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, X, Upload } from "lucide-react";
import type { Cookie } from "@/data/cookies";

interface Props {
  initial?: Cookie;
  mode: "new" | "edit";
}

const INPUT_CLS = "w-full rounded-lg border px-4 py-2.5 font-sans text-sm outline-none transition-all duration-200";
const INPUT_STYLE = { backgroundColor: "rgba(232,225,215,0.05)", borderColor: "rgba(232,225,215,0.1)", color: "#FFFDF8" };
const LABEL_STYLE = { color: "rgba(232,225,215,0.35)" };

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function CookieForm({ initial, mode }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [isVegan, setIsVegan] = useState(initial?.isVegan ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [descEn, setDescEn] = useState(initial?.description.en ?? "");
  const [descDe, setDescDe] = useState(initial?.description.de ?? "");
  const [flavorNotes, setFlavorNotes] = useState<string[]>(initial?.flavorNotes ?? [""]);
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [""]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(v: string) {
    setName(v);
    if (mode === "new") setSlug(toSlug(v));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("filename", `cookie-${slug || toSlug(name)}`);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json() as { path?: string; error?: string };
    setUploading(false);
    if (data.path) setImage(data.path);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload: Cookie = {
      slug, name, image, isVegan, featured,
      description: { en: descEn, de: descDe },
      flavorNotes: flavorNotes.filter(Boolean),
      tags: tags.filter(Boolean),
    };
    const url = mode === "new" ? "/api/admin/cookies" : `/api/admin/cookies/${initial!.slug}`;
    const method = mode === "new" ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/cookies");
      router.refresh();
    } else {
      const d = await res.json() as { error?: string };
      setError(d.error ?? "Save failed.");
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-7">
      {error && (
        <div className="rounded-lg border px-4 py-3 font-sans text-sm" style={{ borderColor: "rgba(175,89,80,0.4)", backgroundColor: "rgba(175,89,80,0.08)", color: "#AF5950" }}>
          {error}
        </div>
      )}

      {/* Name + Slug */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Name">
          <input className={INPUT_CLS} style={INPUT_STYLE} value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Cookie Name" required />
        </Field>
        <Field label="Slug">
          <input className={INPUT_CLS} style={INPUT_STYLE} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="cookie-slug" required readOnly={mode === "edit"} />
        </Field>
      </div>

      {/* Image upload */}
      <Field label="Image">
        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 transition-all duration-200"
          style={{ borderColor: "rgba(232,225,215,0.12)" }}
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {image ? (
            <div className="flex flex-col items-center gap-3">
              <Image src={image} alt="preview" width={100} height={100} className="object-contain drop-shadow-lg" />
              <span className="font-sans text-xs" style={{ color: "rgba(232,225,215,0.4)" }}>{image}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} style={{ color: "rgba(232,225,215,0.25)" }} />
              <span className="font-sans text-sm" style={{ color: "rgba(232,225,215,0.35)" }}>
                {uploading ? "Uploading…" : "Drop image or click to upload"}
              </span>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
      </Field>

      {/* Toggles */}
      <div className="flex gap-6">
        <Toggle label="Vegan" value={isVegan} onChange={setIsVegan} color="#4A8C5C" />
        <Toggle label="Featured" value={featured} onChange={setFeatured} color="#C79A5B" />
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Field label="Description (EN)">
          <textarea className={`${INPUT_CLS} resize-none`} style={INPUT_STYLE} rows={4} value={descEn} onChange={(e) => setDescEn(e.target.value)} placeholder="English description…" required />
        </Field>
        <Field label="Description (DE)">
          <textarea className={`${INPUT_CLS} resize-none`} style={INPUT_STYLE} rows={4} value={descDe} onChange={(e) => setDescDe(e.target.value)} placeholder="German description…" />
        </Field>
      </div>

      {/* Flavor notes */}
      <Field label="Flavor Notes">
        <PillList items={flavorNotes} onChange={setFlavorNotes} max={4} placeholder="e.g. Dark Chocolate" />
      </Field>

      {/* Tags */}
      <Field label="Tags">
        <PillList items={tags} onChange={setTags} max={3} placeholder="e.g. chocolate" />
      </Field>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg px-6 py-2.5 font-sans text-sm font-bold uppercase tracking-[0.15em] transition-all duration-200 disabled:opacity-50"
          style={{ backgroundColor: "#AF5950", color: "#FFFDF8" }}
        >
          {saving ? "Saving…" : mode === "new" ? "Create Cookie" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/cookies")}
          className="font-sans text-sm transition-colors duration-200"
          style={{ color: "rgba(232,225,215,0.35)" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.28em]" style={LABEL_STYLE}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange, color }: { label: string; value: boolean; onChange: (v: boolean) => void; color: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center gap-3 rounded-lg border px-4 py-2.5 font-sans text-sm font-medium transition-all duration-200"
      style={{
        backgroundColor: value ? `${color}18` : "rgba(232,225,215,0.04)",
        borderColor: value ? `${color}40` : "rgba(232,225,215,0.1)",
        color: value ? color : "rgba(232,225,215,0.4)",
      }}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full border" style={{ borderColor: value ? color : "rgba(232,225,215,0.2)", backgroundColor: value ? color : "transparent" }}>
        {value && <span className="block h-2 w-2 rounded-full bg-white" />}
      </span>
      {label}
    </button>
  );
}

function PillList({ items, onChange, max, placeholder }: { items: string[]; onChange: (v: string[]) => void; max: number; placeholder: string }) {
  function update(i: number, val: string) {
    const next = [...items];
    next[i] = val;
    onChange(next);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    if (items.length < max) onChange([...items, ""]);
  }
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className={`${INPUT_CLS} flex-1`}
            style={INPUT_STYLE}
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
          />
          <button type="button" onClick={() => remove(i)} className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150" style={{ color: "rgba(175,89,80,0.5)" }}>
            <X size={14} />
          </button>
        </div>
      ))}
      {items.length < max && (
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-2 rounded-lg px-3 py-2 font-sans text-xs font-semibold transition-colors duration-150"
          style={{ color: "rgba(232,225,215,0.35)" }}
        >
          <Plus size={12} />
          Add
        </button>
      )}
    </div>
  );
}
