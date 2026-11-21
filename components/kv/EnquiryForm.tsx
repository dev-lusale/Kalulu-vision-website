"use client";

import { useRef, useState, type FormEvent } from "react";
import { Icon } from "./ui";

interface Props {
  kind: "contact" | "opportunity" | "partnership";
  services?: string[];
  partnerTypes?: string[];
  defaultPartnerType?: string;
  /** Visual container: "card" (default) or "plain" when the parent already provides one. */
  frame?: "card" | "plain";
  opportunities?: { slug: string; title: string }[];
  defaultService?: string;
  defaultOpportunity?: string;
  email: string;
  whatsapp: string;
}

type Errors = Partial<Record<string, string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const field = "min-h-12 w-full rounded-lg border border-line-strong bg-surface px-4 py-3 text-fg placeholder:text-subtle transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:border-white dark:focus:ring-white/20 aria-[invalid=true]:border-danger";

export function EnquiryForm({ kind, services = [], partnerTypes = [], defaultPartnerType = "", frame = "card", opportunities = [], defaultService = "", defaultOpportunity = "", email, whatsapp }: Props) {
  const box = frame === "card" ? "kv-card p-6 sm:p-9" : "";
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  function validate(fd: FormData): Errors {
    const e: Errors = {};
    if (String(fd.get("name") ?? "").trim().length < 2) e.name = "Enter your name.";
    const em = String(fd.get("email") ?? "").trim();
    if (!em) e.email = "Enter your email address.";
    else if (!EMAIL.test(em)) e.email = "Enter an email address like name@example.com.";
    if (kind === "contact" && String(fd.get("subject") ?? "").trim().length < 3) e.subject = "Add a short subject.";
    if (kind === "opportunity" && !String(fd.get("opportunity") ?? "")) e.opportunity = "Choose what you're interested in.";
    if (kind === "partnership") {
      if (String(fd.get("organisation") ?? "").trim().length < 2) e.organisation = "Enter your organisation's name.";
      if (!String(fd.get("service") ?? "")) e.service = "Choose the type of organisation.";
    }
    const msg = String(fd.get("message") ?? "").trim();
    if (!msg) e.message = "Write a message.";
    else if (msg.length < 20) e.message = "Add a little more detail (at least 20 characters).";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    setServerMsg("");
    if (Object.keys(e).length) {
      setState("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(fd.entries()), kind }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        throw new Error(data.error || "Something went wrong.");
      }
      form.reset();
      setState("sent");
    } catch (err) {
      setServerMsg((err as Error).message);
      setState("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const errList = Object.entries(errors).filter(([, v]) => v);
  const invalid = (k: string) => (errors[k] ? true : undefined);
  const describe = (k: string) => (errors[k] ? `${kind}-${k}-err` : undefined);
  const err = (k: string) => errors[k] ? <p id={`${kind}-${k}-err`} className="text-sm font-medium text-danger">{errors[k]}</p> : null;

  if (state === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className={`${box || "kv-card p-8"} text-center outline-none`}>
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/15 text-success"><Icon name="check" className="size-7" strokeWidth={2.4} /></span>
        <h3 className="mt-6 text-2xl font-bold">Thank you, your {kind === "partnership" ? "partnership enquiry" : "message"} has been received.</h3>
        <p className="mt-3 text-muted">We&apos;ll reply by email. For anything urgent, contact us on WhatsApp.</p>
        <button type="button" onClick={() => setState("idle")} className="mt-8 min-h-11 rounded-lg border border-line-strong px-5 text-sm font-semibold hover:border-primary">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`relative grid gap-5 ${box}`} aria-busy={state === "sending"}>
      {errList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} className="rounded-lg border border-danger/60 bg-danger/[0.06] p-4 outline-none" role="alert">
          <p className="font-semibold">Please fix {errList.length === 1 ? "1 problem" : `${errList.length} problems`}:</p>
          <ul className="mt-2 list-disc pl-5 text-sm">
            {errList.map(([k, v]) => <li key={k}><a href={`#${kind}-${k}`} className="text-danger underline">{v}</a></li>)}
          </ul>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor={`${kind}-name`} className="text-sm font-semibold">Name</label>
          <input id={`${kind}-name`} name="name" autoComplete="name" required maxLength={120} className={field} aria-invalid={invalid("name")} aria-describedby={describe("name")} />
          {err("name")}
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${kind}-email`} className="text-sm font-semibold">Email</label>
          <input id={`${kind}-email`} name="email" type="email" inputMode="email" autoComplete="email" required maxLength={160} className={field} aria-invalid={invalid("email")} aria-describedby={describe("email")} />
          {err("email")}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor={`${kind}-organisation`} className="text-sm font-semibold">Organisation {kind !== "partnership" && <span className="font-normal text-subtle">(optional)</span>}</label>
          <input id={`${kind}-organisation`} name="organisation" autoComplete="organization" maxLength={160} className={field} aria-invalid={invalid("organisation")} aria-describedby={describe("organisation")} />
          {err("organisation")}
        </div>
        {kind === "partnership" ? (
          <div className="grid gap-2">
            <label htmlFor="partnership-service" className="text-sm font-semibold">Type of organisation</label>
            <select id="partnership-service" name="service" defaultValue={defaultPartnerType} className={field} aria-invalid={invalid("service")} aria-describedby={describe("service")}>
              <option value="">Choose one</option>
              {partnerTypes.map((s) => <option key={s}>{s}</option>)}
            </select>
            {err("service")}
          </div>
        ) : kind === "contact" ? (
          <div className="grid gap-2">
            <label htmlFor="contact-service" className="text-sm font-semibold">Service of interest <span className="font-normal text-subtle">(optional)</span></label>
            <select id="contact-service" name="service" defaultValue={defaultService} className={field}>
              <option value="">Not sure yet</option>
              {services.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        ) : (
          <div className="grid gap-2">
            <label htmlFor="opportunity-opportunity" className="text-sm font-semibold">Interested in</label>
            <select id="opportunity-opportunity" name="opportunity" defaultValue={defaultOpportunity} className={field} aria-invalid={invalid("opportunity")} aria-describedby={describe("opportunity")}>
              <option value="">Choose one</option>
              {opportunities.map((o) => <option key={o.slug} value={o.title}>{o.title}</option>)}
            </select>
            {err("opportunity")}
          </div>
        )}
      </div>

      {kind === "partnership" ? null : kind === "contact" ? (
        <div className="grid gap-2">
          <label htmlFor="contact-subject" className="text-sm font-semibold">Subject</label>
          <input id="contact-subject" name="subject" required maxLength={160} className={field} aria-invalid={invalid("subject")} aria-describedby={describe("subject")} />
          {err("subject")}
        </div>
      ) : (
        <div className="grid gap-2">
          <label htmlFor="opportunity-linkUrl" className="text-sm font-semibold">Link to CV, portfolio or proposal <span className="font-normal text-subtle">(optional)</span></label>
          <input id="opportunity-linkUrl" name="linkUrl" type="url" inputMode="url" placeholder="https://" maxLength={300} className={field} />
        </div>
      )}

      <div className="grid gap-2">
        <label htmlFor={`${kind}-message`} className="text-sm font-semibold">{kind === "partnership" ? "What would you like to work on together?" : "Message"}</label>
        <textarea id={`${kind}-message`} name="message" rows={6} required maxLength={5000} className={`${field} min-h-36 resize-y`} aria-invalid={invalid("message")} aria-describedby={describe("message")} />
        {err("message")}
      </div>

      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${kind}-website`}>Leave empty</label>
        <input id={`${kind}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" disabled={state === "sending"}
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-primary px-6 py-3 font-display font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-progress disabled:opacity-70 sm:justify-self-start">
        {state === "sending" ? <><span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />Sending…</> : <>Send {kind === "contact" ? "message" : kind === "partnership" ? "partnership enquiry" : "expression of interest"}<Icon name="arrowRight" className="size-4" /></>}
      </button>

      {state === "error" && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="rounded-lg border border-danger/60 bg-danger/[0.06] p-4 text-sm outline-none">
          <p className="font-semibold">Your message could not be sent.</p>
          <p className="mt-1 text-muted">{serverMsg} Your details are still in the form. You can also reach us directly:</p>
          <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
            {email && <a className="font-semibold text-primary underline dark:text-fg" href={`mailto:${email}`}>{email}</a>}
            {whatsapp && <a className="font-semibold text-primary underline dark:text-fg" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
          </p>
        </div>
      )}
      <p className="text-xs text-subtle">We use your details only to respond to you.</p>
    </form>
  );
}
