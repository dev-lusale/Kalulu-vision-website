"use client";

import { useId, useState } from "react";
import { warmUp } from "@/lib/warm";

/** Email-only "stay updated" sign-up. Stored as a newsletter enquiry in the admin inbox. */
export function Subscribe({ invert = false }: { invert?: boolean }) {
  const id = useId();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setState("error"); setMsg("Enter a valid email address."); return; }
    setState("sending"); setMsg("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "newsletter", email, website: fd.get("website") }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Subscription failed.");
      form.reset(); setState("done"); setMsg("Thank you — you're on the list for updates.");
    } catch (err) {
      setState("error"); setMsg((err as Error).message || "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} onFocus={warmUp} noValidate className="w-full max-w-md">
      <label htmlFor={id} className="sr-only">Email address</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input id={id} name="email" type="email" autoComplete="email" required placeholder="Your email address"
          aria-describedby={`${id}-msg`} aria-invalid={state === "error"}
          className={`min-h-12 flex-1 rounded-lg border px-4 text-[0.95rem] outline-none transition-colors focus:ring-2 ${invert ? "border-white/25 bg-white/10 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30" : "border-line-strong bg-surface text-fg placeholder:text-subtle focus:border-primary focus:ring-primary/20"}`} />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <button type="submit" disabled={state === "sending"}
          className="min-h-12 rounded-lg bg-brand px-5 font-display text-sm font-semibold text-[#171717] transition hover:brightness-105 disabled:opacity-60">
          {state === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      <p id={`${id}-msg`} role="status" className={`mt-2 min-h-5 text-sm ${state === "error" ? (invert ? "text-[#FFB4AB]" : "text-danger") : invert ? "text-band-muted" : "text-muted"}`}>{msg}</p>
    </form>
  );
}
