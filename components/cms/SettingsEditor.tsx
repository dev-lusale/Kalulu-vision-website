"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { About, Company, ResearchInfo, TitledText } from "@/lib/content-types";

const input = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[15px] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 aria-[invalid=true]:border-red-500";

function Field({ id, label, value, onChange, area, help, error, type = "text" }: { id: string; label: string; value: string; onChange: (v: string) => void; area?: boolean; help?: string; error?: string; type?: string }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      {area
        ? <textarea id={id} className={`${input} min-h-28`} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={error ? true : undefined} />
        : <input id={id} type={type} className={input} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={error ? true : undefined} />}
      {(error || help) && <p className={`text-xs ${error ? "font-semibold text-red-700" : "text-slate-500"}`}>{error || help}</p>}
    </div>
  );
}

function PairList({ id, label, items, onChange }: { id: string; label: string; items: TitledText[]; onChange: (v: TitledText[]) => void }) {
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-1 text-sm font-semibold">{label}</legend>
      {items.map((it, i) => (
        <div key={i} className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-[200px_1fr_auto]">
          <input aria-label={`${label} ${i + 1} title`} id={`${id}-${i}-t`} className={input} value={it.title} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
          <input aria-label={`${label} ${i + 1} text`} className={input} value={it.text} onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} />
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="min-h-11 rounded-lg px-3 text-sm text-red-700 hover:bg-red-50">Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { title: "", text: "" }])} className="min-h-10 w-fit rounded-lg border border-slate-300 px-3 text-sm">+ Add</button>
    </fieldset>
  );
}

export function SettingsEditor({ company: c0, about: a0, research: r0 }: { company: Company; about: About; research: ResearchInfo }) {
  const router = useRouter();
  const [company, setCompany] = useState(c0);
  const [about, setAbout] = useState(a0);
  const [research, setResearch] = useState(r0);
  const [status, setStatus] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function save(key: "company" | "about" | "research", value: unknown) {
    setStatus((s) => ({ ...s, [key]: { ok: true, text: "Saving…" } }));
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, value }) });
    const data = await res.json().catch(() => ({}));
    setErrors(data.fieldErrors ?? {});
    setStatus((s) => ({ ...s, [key]: res.ok ? { ok: true, text: "Saved. The website updates within a minute." } : { ok: false, text: data.error ?? "Could not save." } }));
    if (res.ok) router.refresh();
  }
  const msg = (k: string) => status[k] ? <p role="status" className={`text-sm ${status[k].ok ? "text-green-800" : "font-semibold text-red-700"}`}>{status[k].text}</p> : null;
  const C = (k: keyof Company) => (v: string) => setCompany({ ...company, [k]: v });
  const A = (k: keyof About) => (v: string) => setAbout({ ...about, [k]: v });

  return (
    <div className="grid max-w-4xl gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Company info</h1>
        <p className="mt-1 text-sm text-slate-500">Contact details, brand statements and research areas shown across the website.</p>
      </div>

      <form className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6" onSubmit={(e) => { e.preventDefault(); save("company", company); }}>
        <h2 className="text-lg font-semibold">Contact &amp; identity</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="c-name" label="Company name" value={company.name} onChange={C("name")} error={errors.name} />
          <Field id="c-slogan" label="Slogan" value={company.slogan} onChange={C("slogan")} />
        </div>
        <Field id="c-desc" label="Short description" value={company.shortDescription} onChange={C("shortDescription")} area />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="c-email" label="Email" type="email" value={company.email} onChange={C("email")} error={errors.email} />
          <Field id="c-phone" label="Telephone" value={company.phone} onChange={C("phone")} help="Shown as written, e.g. +260 972 079 994" />
          <Field id="c-wa" label="WhatsApp number" value={company.whatsapp} onChange={C("whatsapp")} help="International format, digits only, e.g. 260972079994" />
          <Field id="c-loc" label="Location" value={company.location} onChange={C("location")} />
        </div>
        <h3 className="pt-2 font-semibold">Social media <span className="text-sm font-normal text-slate-500">(leave empty to hide)</span></h3>
        <div className="grid gap-5 sm:grid-cols-2">
          {["linkedin", "youtube", "github", "x", "facebook", "tiktok"].map((k) => (
            <Field key={k} id={`c-s-${k}`} label={k === "x" ? "X (Twitter)" : k[0].toUpperCase() + k.slice(1)} value={company.socials?.[k] ?? ""}
              onChange={(v) => setCompany({ ...company, socials: { ...company.socials, [k]: v } })} error={errors[`socials.${k}`]} help="https://…" />
          ))}
        </div>
        <div className="flex items-center gap-4"><button className="min-h-11 rounded-lg bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700">Save contact details</button>{msg("company")}</div>
      </form>

      <form className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6" onSubmit={(e) => { e.preventDefault(); save("about", about); }}>
        <h2 className="text-lg font-semibold">About page</h2>
        <Field id="a-ov" label="Company overview" value={about.overview} onChange={A("overview")} area />
        <Field id="a-story" label="Our story" value={about.story} onChange={A("story")} area />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="a-mission" label="Mission" value={about.mission} onChange={A("mission")} area />
          <Field id="a-vision" label="Vision" value={about.vision} onChange={A("vision")} area />
        </div>
        <PairList id="a-values" label="Core values" items={about.values} onChange={(v) => setAbout({ ...about, values: v })} />
        <Field id="a-phil" label="Philosophy" value={about.philosophy} onChange={A("philosophy")} area />
        <PairList id="a-appr" label="Approach to innovation (also shown as 'Why Kalulu Vision')" items={about.approach} onChange={(v) => setAbout({ ...about, approach: v })} />
        <Field id="a-africa" label="Commitment to African technological advancement" value={about.africa} onChange={A("africa")} area />
        <div className="flex items-center gap-4"><button className="min-h-11 rounded-lg bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700">Save about page</button>{msg("about")}</div>
      </form>

      <form className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6" onSubmit={(e) => { e.preventDefault(); save("research", research); }}>
        <h2 className="text-lg font-semibold">Research areas</h2>
        <Field id="r-intro" label="Introduction" value={research.intro} onChange={(v) => setResearch({ ...research, intro: v })} area />
        <PairList id="r-areas" label="Areas" items={research.areas} onChange={(v) => setResearch({ ...research, areas: v })} />
        <div className="flex items-center gap-4"><button className="min-h-11 rounded-lg bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700">Save research areas</button>{msg("research")}</div>
      </form>
    </div>
  );
}
