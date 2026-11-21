"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { MediaItem } from "@/lib/content-types";

const btn = "min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50";
const input = "min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200";

export async function uploadImage(file: File, alt = ""): Promise<MediaItem> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("alt", alt);
  const res = await fetch("/api/admin/media", { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.error || "Upload failed.");
  return data.item as MediaItem;
}

function useMedia(enabled: boolean) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setError("");
    const res = await fetch("/api/admin/media");
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) { setError(data.error || "Could not load images."); setItems([]); return; }
    setItems(data.items);
  }, []);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/media");
      const data = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (!res.ok || !data.success) { setError(data.error || "Could not load images."); setItems([]); return; }
      setItems(data.items);
    })();
    return () => { cancelled = true; };
  }, [enabled]);
  return { items, error, reload: load, setItems };
}

/** Picker dialog listing uploaded images; calls onPick with the chosen URL. */
function LibraryPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const { items, error } = useMedia(true);
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return (
    <dialog ref={ref} onClose={onClose} className="kv-admin m-auto w-[min(860px,94vw)] rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 backdrop:bg-black/50">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="font-semibold">Choose an image</h2>
        <button type="button" className={btn} onClick={() => ref.current?.close()}>Close</button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto p-5">
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {items === null ? <p className="text-sm text-slate-500">Loading…</p> : items.length === 0 ? (
          <p className="text-sm text-slate-500">No images uploaded yet. Use “Upload” on the field, or the Media library page.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => { onPick(m.url); ref.current?.close(); }} className="group block w-full overflow-hidden rounded-lg border border-slate-200 text-left hover:border-orange-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.alt} className="aspect-[4/3] w-full bg-slate-100 object-cover" loading="lazy" />
                  <span className="block truncate px-2 py-1.5 text-xs text-slate-600">{m.filename}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </dialog>
  );
}

/** Single image: preview + URL + upload + choose from library. */
export function ImageInput({ id, value, onChange, describedBy, invalid }: { id: string; value: string; onChange: (v: string) => void; describedBy?: string; invalid?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [picking, setPicking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true); setErr("");
    try { onChange((await uploadImage(file)).url); } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  }
  return (
    <div className="grid gap-2 sm:grid-cols-[128px_1fr] sm:items-start">
      <div className="grid aspect-[4/3] w-32 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-xs text-slate-500">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : "No image"}
      </div>
      <div className="grid gap-2">
        <input id={id} type="text" inputMode="url" className={input} value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://… or /path/image.webp" aria-describedby={describedBy} aria-invalid={invalid} />
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" id={`${id}-file`} onChange={(e) => onFile(e.target.files?.[0])} />
          <label htmlFor={`${id}-file`} className={`${btn} inline-flex cursor-pointer items-center ${busy ? "pointer-events-none opacity-50" : ""}`}>{busy ? "Uploading…" : "Upload"}</label>
          <button type="button" className={btn} onClick={() => setPicking(true)}>Choose from library</button>
          {value && <button type="button" className={`${btn} text-red-700`} onClick={() => onChange("")}>Remove</button>}
        </div>
        {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
      </div>
      {picking && <LibraryPicker onPick={onChange} onClose={() => setPicking(false)} />}
    </div>
  );
}

/** Ordered list of images (screenshot galleries). */
export function ImageListInput({ id, value, onChange }: { id: string; value: string[]; onChange: (v: string[]) => void }) {
  const list = value.length ? value : [];
  return (
    <div id={id} className="grid gap-3">
      {list.map((url, i) => (
        <div key={i} className="grid gap-2 rounded-lg border border-slate-200 p-3">
          <ImageInput id={`${id}-${i}`} value={url} onChange={(v) => onChange(list.map((x, j) => (j === i ? v : x)))} />
          <div className="flex gap-2">
            <button type="button" className={btn} disabled={i === 0} onClick={() => { const n = [...list]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}>Move up</button>
            <button type="button" className={`${btn} text-red-700`} onClick={() => onChange(list.filter((_, j) => j !== i))}>Remove screenshot</button>
          </div>
        </div>
      ))}
      <button type="button" className={`${btn} justify-self-start`} disabled={list.length >= 12} onClick={() => onChange([...list, ""])}>+ Add screenshot</button>
    </div>
  );
}

/** Full media library page: upload with description, browse, copy address, edit description, delete. */
export function MediaLibrary() {
  const { items, error, reload, setItems } = useMedia(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const altId = useId();
  const formRef = useRef<HTMLFormElement>(null);

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file");
    if (!(file instanceof File) || !file.size) { setMsg({ ok: false, text: "Choose an image first." }); return; }
    setBusy(true); setMsg(null);
    try { await uploadImage(file, String(fd.get("alt") ?? "")); form.reset(); setMsg({ ok: true, text: "Image uploaded." }); await reload(); }
    catch (err) { setMsg({ ok: false, text: (err as Error).message }); }
    finally { setBusy(false); }
  }
  async function saveAlt(m: MediaItem, alt: string) {
    const res = await fetch(`/api/admin/media/${m.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ alt }) });
    setMsg(res.ok ? { ok: true, text: "Description saved." } : { ok: false, text: "Could not save the description." });
  }
  async function remove(m: MediaItem) {
    if (!window.confirm(`Delete ${m.filename}? Pages using this image will show an empty frame.`)) return;
    const res = await fetch(`/api/admin/media/${m.id}`, { method: "DELETE" });
    if (res.ok) { setItems((xs) => xs?.filter((x) => x.id !== m.id) ?? null); setMsg({ ok: true, text: "Image deleted." }); }
    else setMsg({ ok: false, text: "Could not delete." });
  }
  async function copy(url: string) {
    try { await navigator.clipboard.writeText(url); setMsg({ ok: true, text: `Copied ${url}` }); } catch { setMsg({ ok: false, text: url }); }
  }

  return (
    <div className="grid gap-6">
      <form ref={formRef} onSubmit={onUpload} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
        <div className="grid gap-1.5">
          <label htmlFor={`${altId}-f`} className="text-sm font-semibold">Image file</label>
          <input id={`${altId}-f`} name="file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="text-sm" />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor={altId} className="text-sm font-semibold">Description <span className="font-normal text-slate-500">(for screen readers)</span></label>
          <input id={altId} name="alt" className={input} maxLength={300} placeholder="e.g. Tech Lessons course page on a laptop" />
        </div>
        <button disabled={busy} className="min-h-10 rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">{busy ? "Uploading…" : "Upload image"}</button>
        <p className="text-xs text-slate-500 sm:col-span-3">PNG, JPEG, WebP or GIF up to 4 MB. Use real photos and screenshots you have the right to publish.</p>
      </form>

      {msg && <p role={msg.ok ? "status" : "alert"} className={`rounded-lg border px-4 py-3 text-sm ${msg.ok ? "border-green-300 bg-green-50 text-green-800" : "border-red-300 bg-red-50 text-red-700"}`}>{msg.text}</p>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      {items === null ? <p className="text-sm text-slate-500">Loading…</p> : items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">No images yet. Upload project screenshots, product images and article covers here.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.alt} className="aspect-[4/3] w-full bg-slate-100 object-cover" loading="lazy" />
              <div className="grid gap-2 p-3">
                <p className="truncate text-sm font-medium" title={m.filename}>{m.filename}</p>
                <p className="text-xs text-slate-500">{m.width && m.height ? `${m.width}×${m.height} · ` : ""}{Math.round(m.size / 1024)} KB</p>
                <label className="sr-only" htmlFor={`alt-${m.id}`}>Description for {m.filename}</label>
                <input id={`alt-${m.id}`} defaultValue={m.alt} className={input} placeholder="Description" onBlur={(e) => { if (e.target.value !== m.alt) saveAlt(m, e.target.value); }} />
                <div className="flex gap-2">
                  <button type="button" className={btn} onClick={() => copy(m.url)}>Copy address</button>
                  <button type="button" className={`${btn} text-red-700`} onClick={() => remove(m)}>Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
