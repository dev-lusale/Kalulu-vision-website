"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { emptyRecord, SCHEMAS, type FieldDef } from "@/lib/admin-schema";
import { ImageInput, ImageListInput } from "./media";
import { slugify } from "@/lib/content-types";
import { renderMarkdown } from "@/lib/markdown";

type Row = Record<string, unknown> & { id: string };

const input = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[15px] text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 aria-[invalid=true]:border-red-500";

export function ContentManager({ entity, rows: initial }: { entity: string; rows: Row[] }) {
  const schema = SCHEMAS[entity];
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initial);
  const [editing, setEditing] = useState<Row | Record<string, unknown> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [q, setQ] = useState("");
  const [preview, setPreview] = useState(false);
  const formTop = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const filtered = useMemo(() => rows.filter((r) => !q || String(r[schema.titleKey] ?? "").toLowerCase().includes(q.toLowerCase())), [rows, q, schema.titleKey]);
  const isNew = editing ? !("id" in editing) : false;

  function open(row: Row | null) {
    if (dirty && !confirm("Discard unsaved changes?")) return;
    setEditing(row ? { ...row } : emptyRecord(schema));
    setSlugTouched(!!row);
    setErrors({}); setMsg(null); setDirty(false); setPreview(false);
    requestAnimationFrame(() => formTop.current?.focus());
  }
  function close() {
    if (dirty && !confirm("Discard unsaved changes?")) return;
    setEditing(null); setDirty(false); setErrors({});
  }
  function set(key: string, value: unknown) {
    setEditing((e) => {
      if (!e) return e;
      const next = { ...e, [key]: value };
      const slugField = schema.fields.find((f) => f.kind === "slug");
      if (slugField && slugField.from === key && !slugTouched) next[slugField.key] = slugify(String(value));
      return next;
    });
    setDirty(true);
  }

  async function reload() {
    const res = await fetch(`/api/admin/content/${entity}`);
    const data = await res.json();
    if (data.success) setRows(data.data);
  }

  async function save() {
    if (!editing) return;
    setBusy(true); setMsg(null);
    const url = isNew ? `/api/admin/content/${entity}` : `/api/admin/content/${entity}/${(editing as Row).id}`;
    try {
      const res = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setErrors(data.fieldErrors ?? {});
        setMsg({ kind: "err", text: data.error ?? "Could not save." });
        return;
      }
      setErrors({}); setDirty(false);
      await reload();
      setEditing((e) => (e && isNew ? { ...e, id: data.id } : e));
      setSlugTouched(true);
      setMsg({ kind: "ok", text: "Saved. The website updates within a minute." });
      router.refresh();
    } catch {
      setMsg({ kind: "err", text: "Network error. Your changes have not been saved." });
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: Row) {
    if (!confirm(`Delete "${String(row[schema.titleKey])}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/content/${entity}/${row.id}`, { method: "DELETE" });
    if (res.ok) {
      setRows((r) => r.filter((x) => x.id !== row.id));
      if (editing && "id" in editing && editing.id === row.id) { setEditing(null); setDirty(false); }
      setMsg({ kind: "ok", text: "Deleted." });
      router.refresh();
    } else setMsg({ kind: "err", text: "Could not delete." });
  }

  function renderField(f: FieldDef) {
    const v = editing?.[f.key];
    const id = `f-${f.key}`;
    const err = errors[f.key];
    const common = { id, "aria-invalid": err ? true : undefined, "aria-describedby": err || f.help ? `${id}-d` : undefined };
    let control;
    switch (f.kind) {
      case "textarea":
        control = <textarea {...common} className={`${input} min-h-28`} rows={4} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} maxLength={f.max} />;
        break;
      case "markdown":
        control = (
          <div>
            <div className="mb-2 flex gap-2" role="group" aria-label="Editor mode">
              <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)} className={`min-h-9 rounded-md px-3 text-sm ${!preview ? "bg-slate-900 text-white" : "border border-slate-300"}`}>Write</button>
              <button type="button" aria-pressed={preview} onClick={() => setPreview(true)} className={`min-h-9 rounded-md px-3 text-sm ${preview ? "bg-slate-900 text-white" : "border border-slate-300"}`}>Preview</button>
            </div>
            {preview
              ? <div className="prose-admin min-h-64 rounded-lg border border-slate-300 bg-white p-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(String(v ?? "")) }} />
              : <textarea {...common} className={`${input} min-h-80 font-mono text-sm`} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />}
          </div>
        );
        break;
      case "list":
        control = <textarea {...common} className={`${input} min-h-28`} rows={4} value={(Array.isArray(v) ? v : []).join("\n")} onChange={(e) => set(f.key, e.target.value.split("\n"))} />;
        break;
      case "select":
        control = (
          <select {...common} className={input} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)}>
            {!f.required && <option value="">—</option>}
            {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        );
        break;
      case "multiselect": {
        const arr = Array.isArray(v) ? (v as string[]) : [];
        control = (
          <fieldset {...common} className="flex flex-wrap gap-2">
            <legend className="sr-only">{f.label}</legend>
            {f.options?.map((o) => (
              <label key={o.value} className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm ${arr.includes(o.value) ? "border-orange-500 bg-orange-50 text-orange-800" : "border-slate-300"}`}>
                <input type="checkbox" className="accent-orange-600" checked={arr.includes(o.value)} onChange={(e) => set(f.key, e.target.checked ? [...arr, o.value] : arr.filter((x) => x !== o.value))} />
                {o.label}
              </label>
            ))}
          </fieldset>
        );
        break;
      }
      case "bool":
        return (
          <div key={f.key} className="flex items-center gap-3">
            <input id={id} type="checkbox" className="size-5 accent-orange-600" checked={!!v} onChange={(e) => set(f.key, e.target.checked)} />
            <label htmlFor={id} className="text-sm font-medium">{f.label}</label>
          </div>
        );
      case "number":
        control = <input {...common} type="number" className={`${input} max-w-40`} value={Number(v ?? 0)} onChange={(e) => set(f.key, e.target.value)} />;
        break;
      case "date":
        control = <input {...common} type="date" className={`${input} max-w-56`} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />;
        break;
      case "datetime":
        control = <input {...common} type="datetime-local" className={`${input} max-w-64`} value={v ? new Date(String(v)).toISOString().slice(0, 16) : ""} onChange={(e) => set(f.key, e.target.value ? new Date(e.target.value).toISOString() : null)} />;
        break;
      case "image":
        control = <ImageInput id={id} value={String(v ?? "")} onChange={(x) => set(f.key, x)} describedBy={common["aria-describedby"]} invalid={!!err} />;
        break;
      case "images":
        control = <ImageListInput id={id} value={Array.isArray(v) ? (v as string[]) : []} onChange={(x) => set(f.key, x)} />;
        break;
      case "slug":
        control = <input {...common} className={`${input} font-mono text-sm`} value={String(v ?? "")} onChange={(e) => { setSlugTouched(true); set(f.key, e.target.value); }} />;
        break;
      default:
        control = <input {...common} type={f.kind === "url" ? "url" : "text"} className={input} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} maxLength={f.max} />;
    }
    return (
      <div key={f.key} className="grid gap-1.5">
        <label htmlFor={id} className="text-sm font-semibold">{f.label}{f.required && <span className="text-red-600"> *</span>}</label>
        {control}
        {(err || f.help) && <p id={`${id}-d`} className={`text-xs ${err ? "font-semibold text-red-700" : "text-slate-500"}`}>{err || f.help}</p>}
      </div>
    );
  }

  const publicHref = editing && "id" in editing ? schema.publicPath?.(editing) : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{schema.plural}</h1>
          <p className="mt-1 text-sm text-slate-500">{rows.length} {rows.length === 1 ? "item" : "items"}</p>
        </div>
        <button type="button" onClick={() => open(null)} className="min-h-11 rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700">+ New {schema.singular.toLowerCase()}</button>
      </div>

      {msg && <div role={msg.kind === "err" ? "alert" : "status"} className={`mt-4 rounded-lg border px-4 py-3 text-sm ${msg.kind === "ok" ? "border-green-300 bg-green-50 text-green-900" : "border-red-300 bg-red-50 text-red-900"}`}>{msg.text}</div>}

      <div className={`mt-6 grid gap-6 ${editing ? "xl:grid-cols-[minmax(280px,380px)_1fr]" : ""}`}>
        <div className={editing ? "hidden xl:block" : ""}>
          <label className="sr-only" htmlFor="cms-search">Search</label>
          <input id="cms-search" type="search" placeholder={`Search ${schema.plural.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} className={`${input} mb-3`} />
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {filtered.length === 0 && <li className="p-5 text-sm text-slate-500">Nothing here yet.</li>}
            {filtered.map((r) => {
              const live = schema.name === "opportunities" ? r.isOpen : r.published;
              const sel = editing && "id" in editing && editing.id === r.id;
              return (
                <li key={r.id} className={`flex items-center gap-3 p-3 ${sel ? "bg-orange-50" : ""}`}>
                  <button type="button" onClick={() => open(r)} className="min-h-10 min-w-0 flex-1 text-left">
                    <span className="block truncate font-medium">{String(r[schema.titleKey] ?? "(untitled)")}</span>
                    <span className="text-xs text-slate-500">{live ? (schema.name === "opportunities" ? "Open" : "Published") : (schema.name === "opportunities" ? "Closed" : "Draft")}{r.status ? ` · ${String(r.status)}` : ""}{r.kind ? ` · ${String(r.kind)}` : ""}</span>
                  </button>
                  <button type="button" onClick={() => remove(r)} className="min-h-10 rounded-md px-2 text-sm text-red-700 hover:bg-red-50" aria-label={`Delete ${String(r[schema.titleKey])}`}>Delete</button>
                </li>
              );
            })}
          </ul>
        </div>

        {editing && (
          <form className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7" onSubmit={(e) => { e.preventDefault(); save(); }} noValidate>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 ref={formTop} tabIndex={-1} className="text-xl font-semibold outline-none">{isNew ? `New ${schema.singular.toLowerCase()}` : `Edit ${schema.singular.toLowerCase()}`}</h2>
              <div className="flex gap-2">
                {publicHref && <a href={publicHref} target="_blank" rel="noopener" className="min-h-10 rounded-lg border border-slate-300 px-3 py-2 text-sm">View on site ↗</a>}
                <button type="button" onClick={close} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm">Close</button>
              </div>
            </div>
            <div className="grid gap-5">{schema.fields.map(renderField)}</div>
            <div className="sticky bottom-0 -mx-5 mt-8 flex items-center gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:-mx-7 sm:px-7">
              <button type="submit" disabled={busy} className="min-h-11 rounded-lg bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60">{busy ? "Saving…" : isNew ? "Create" : "Save changes"}</button>
              {dirty && <span className="text-sm text-slate-500">Unsaved changes</span>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
