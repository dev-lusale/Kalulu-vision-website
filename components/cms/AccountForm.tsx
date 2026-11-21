"use client";

import { useState } from "react";

const input = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200";

export function AccountForm({ email }: { email: string }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("next") !== fd.get("confirm")) { setMsg({ ok: false, text: "The new passwords do not match." }); return; }
    setBusy(true);
    const res = await fetch("/api/admin/account", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current: fd.get("current"), next: fd.get("next") }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    setMsg(res.ok ? { ok: true, text: "Password changed." } : { ok: false, text: data.error ?? "Could not change password." });
    if (res.ok) form.reset();
  }
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold">Account</h1>
      <p className="mt-1 text-sm text-slate-500">Signed in as {email}</p>
      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Change password</h2>
        <div className="grid gap-1.5"><label htmlFor="cur" className="text-sm font-semibold">Current password</label><input id="cur" name="current" type="password" autoComplete="current-password" required className={input} /></div>
        <div className="grid gap-1.5"><label htmlFor="nw" className="text-sm font-semibold">New password</label><input id="nw" name="next" type="password" autoComplete="new-password" minLength={10} required className={input} /><p className="text-xs text-slate-500">At least 10 characters.</p></div>
        <div className="grid gap-1.5"><label htmlFor="cf" className="text-sm font-semibold">Confirm new password</label><input id="cf" name="confirm" type="password" autoComplete="new-password" required className={input} /></div>
        <button disabled={busy} className="min-h-11 w-fit rounded-lg bg-orange-600 px-5 text-sm font-semibold text-white disabled:opacity-60">{busy ? "Saving…" : "Change password"}</button>
        {msg && <p role="status" className={`text-sm ${msg.ok ? "text-green-800" : "font-semibold text-red-700"}`}>{msg.text}</p>}
      </form>
    </div>
  );
}
