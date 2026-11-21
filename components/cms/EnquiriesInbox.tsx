"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Enquiry } from "@/lib/content-types";

export function EnquiriesInbox({ initial }: { initial: Enquiry[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"new" | "read" | "archived" | "all">("new");
  const [kind, setKind] = useState<"all" | Enquiry["kind"]>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const shown = items.filter((e) => (filter === "all" || e.status === filter) && (kind === "all" || e.kind === kind));
  const KINDS: { id: "all" | Enquiry["kind"]; label: string }[] = [
    { id: "all", label: "All types" }, { id: "contact", label: "Contact" }, { id: "partnership", label: "Partnership" },
    { id: "opportunity", label: "Opportunities" }, { id: "newsletter", label: "Newsletter" },
  ];

  async function setStatus(e: Enquiry, status: Enquiry["status"]) {
    const res = await fetch(`/api/admin/enquiries/${e.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) { setItems((xs) => xs.map((x) => (x.id === e.id ? { ...x, status } : x))); router.refresh(); }
  }
  async function remove(e: Enquiry) {
    if (!confirm(`Delete the message from ${e.name}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/enquiries/${e.id}`, { method: "DELETE" });
    if (res.ok) { setItems((xs) => xs.filter((x) => x.id !== e.id)); router.refresh(); }
  }
  function toggle(e: Enquiry) {
    setOpenId((id) => (id === e.id ? null : e.id));
    if (e.status === "new") setStatus(e, "read");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Enquiries</h1>
      <p className="mt-1 text-sm text-slate-500">Messages from the contact, partnership and opportunities forms, and newsletter sign-ups.</p>
      <div role="group" aria-label="Filter enquiries" className="mt-6 flex flex-wrap gap-2">
        {(["new", "read", "archived", "all"] as const).map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)}
            className={`min-h-10 rounded-full px-4 text-sm font-medium capitalize ${filter === f ? "bg-slate-900 text-white" : "border border-slate-300 bg-white"}`}>
            {f} <span className="opacity-60">{f === "all" ? items.length : items.filter((x) => x.status === f).length}</span>
          </button>
        ))}
      </div>
      <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600">Type
        <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-slate-900">
          {KINDS.map((k) => <option key={k.id} value={k.id}>{k.label} ({k.id === "all" ? items.length : items.filter((x) => x.kind === k.id).length})</option>)}
        </select>
      </label>
      <ul className="mt-6 grid gap-3">
        {shown.length === 0 && <li className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">No {filter === "all" ? "" : filter} enquiries.</li>}
        {shown.map((e) => (
          <li key={e.id} className={`rounded-xl border bg-white ${e.status === "new" ? "border-orange-300" : "border-slate-200"}`}>
            <button type="button" onClick={() => toggle(e)} aria-expanded={openId === e.id} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-4 text-left">
              {e.status === "new" && <span className="size-2 rounded-full bg-orange-500" aria-label="New" />}
              <span className="font-semibold">{e.name}</span>
              <span className="text-sm text-slate-500">{e.email}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize text-slate-700">{e.kind}</span>
              <span className="text-sm text-slate-700">{e.kind === "opportunity" ? `Opportunity: ${e.opportunity}` : e.subject}</span>
              <span className="ml-auto text-xs text-slate-500">{new Date(e.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
            </button>
            {openId === e.id && (
              <div className="border-t border-slate-200 p-4 text-sm">
                <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[140px_1fr]">
                  {e.organisation && <><dt className="text-slate-500">Organisation</dt><dd>{e.organisation}</dd></>}
                  {e.service && <><dt className="text-slate-500">{e.kind === "partnership" ? "Organisation type" : "Service"}</dt><dd>{e.service}</dd></>}
                  {e.linkUrl && <><dt className="text-slate-500">Link</dt><dd><a className="text-orange-700 underline" href={e.linkUrl} target="_blank" rel="noopener noreferrer">{e.linkUrl}</a></dd></>}
                </dl>
                <p className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-slate-800">{e.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={`mailto:${e.email}?subject=${encodeURIComponent("Re: " + (e.subject || e.opportunity || "Your message to Kalulu Vision"))}`} className="min-h-10 rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white">Reply by email</a>
                  {e.status !== "archived" ? <button type="button" onClick={() => setStatus(e, "archived")} className="min-h-10 rounded-lg border border-slate-300 px-4">Archive</button>
                    : <button type="button" onClick={() => setStatus(e, "read")} className="min-h-10 rounded-lg border border-slate-300 px-4">Move to inbox</button>}
                  {e.status !== "new" && <button type="button" onClick={() => setStatus(e, "new")} className="min-h-10 rounded-lg border border-slate-300 px-4">Mark unread</button>}
                  <button type="button" onClick={() => remove(e)} className="min-h-10 rounded-lg px-4 text-red-700 hover:bg-red-50">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
