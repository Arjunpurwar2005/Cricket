"use client";

import { useState } from "react";
import type { Settings } from "@/lib/settings";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
  };

  return (
    <form onSubmit={submit} className="max-w-2xl flex flex-col gap-6">
      <Section title="WhatsApp Configuration">
        <Field label="WhatsApp Number (with country code, digits only)">
          <input
            value={form.whatsappNumber}
            onChange={(e) => set("whatsappNumber", e.target.value)}
            className="input"
          />
        </Field>
        <Field label="General Enquiry Message">
          <textarea value={form.generalMessage} onChange={(e) => set("generalMessage", e.target.value)} className="input min-h-[70px]" />
        </Field>
        <Field label="Product Enquiry Template">
          <textarea
            value={form.productEnquiryTemplate}
            onChange={(e) => set("productEnquiryTemplate", e.target.value)}
            className="input min-h-[120px] font-mono text-xs"
          />
          <p className="text-xs text-gray-500 mt-1">
            Available tokens: {"{name} {brand} {price} {mrp} {variant} {sku} {url}"}
          </p>
        </Field>
        <Field label="Ask a Question Template">
          <textarea
            value={form.questionTemplate}
            onChange={(e) => set("questionTemplate", e.target.value)}
            className="input min-h-[80px] font-mono text-xs"
          />
        </Field>
        <Field label="Card Enquiry Template">
          <textarea
            value={form.cardEnquiryTemplate}
            onChange={(e) => set("cardEnquiryTemplate", e.target.value)}
            className="input min-h-[80px] font-mono text-xs"
          />
        </Field>
        <div className="flex gap-6">
          <Checkbox label="Header WhatsApp Button" checked={form.headerWhatsappEnabled} onChange={(v) => set("headerWhatsappEnabled", v)} />
          <Checkbox label="Footer WhatsApp Button" checked={form.footerWhatsappEnabled} onChange={(v) => set("footerWhatsappEnabled", v)} />
          <Checkbox label="Floating WhatsApp Button" checked={form.floatingWhatsappEnabled} onChange={(v) => set("floatingWhatsappEnabled", v)} />
        </div>
      </Section>

      <Section title="Announcement Bar">
        <Field label="Announcement Text">
          <input value={form.announcementText} onChange={(e) => set("announcementText", e.target.value)} className="input" />
        </Field>
        <Field label="Background Color">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={(form as Record<string, any>).announcementColor || "#000000"}
              onChange={(e) => set("announcementColor" as keyof Settings, e.target.value as any)}
              className="w-10 h-10 border border-gray-300 rounded cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={(form as Record<string, any>).announcementColor || "#000000"}
              onChange={(e) => set("announcementColor" as keyof Settings, e.target.value as any)}
              placeholder="#000000"
              className="input max-w-[150px] font-mono text-xs uppercase"
            />
          </div>
        </Field>
      </Section>


      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="bg-gray-900 text-white px-6 py-2.5 text-sm uppercase tracking-wide disabled:opacity-50">
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved.</span>}
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          background: white;
        }
        .input:focus {
          outline: none;
          border-color: #111827;
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-4">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-gray-500">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
