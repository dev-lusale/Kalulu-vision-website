"use client";

import { useEffect, useSyncExternalStore } from "react";

export type ThemePref = "light" | "dark" | "system";
const KEY = "kv-theme";
const EVT = "kv-theme-change";

function readPref(): ThemePref {
  try {
    const p = localStorage.getItem(KEY);
    return p === "dark" || p === "system" ? p : "light";
  } catch { return "light"; }
}

function apply(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  root.dataset.theme = dark ? "dark" : "light";
  root.dataset.themePref = pref;
}

export function setThemePref(pref: ThemePref) {
  try { localStorage.setItem(KEY, pref); } catch { /* storage unavailable: still apply for this visit */ }
  apply(pref);
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => { if (readPref() === "system") { apply("system"); cb(); } };
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { apply(readPref()); cb(); } };
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", onStorage);
  mq.addEventListener("change", onSystem);
  return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", onStorage); mq.removeEventListener("change", onSystem); };
}

export function useThemePref(): ThemePref {
  return useSyncExternalStore(subscribe, readPref, () => "light");
}

const OPTIONS: { id: ThemePref; label: string; icon: React.ReactNode }[] = [
  { id: "light", label: "Light", icon: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> },
  { id: "dark", label: "Dark", icon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /> },
  { id: "system", label: "System", icon: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></> },
];

/** Segmented Light / Dark / System control. The choice is remembered on this device. */
export function ThemeSwitcher({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const pref = useThemePref();
  // keep <html> in sync if the stored preference was changed elsewhere
  useEffect(() => { apply(pref); }, [pref]);
  return (
    <div role="radiogroup" aria-label="Colour theme" className={`inline-flex items-center gap-0.5 rounded-full border border-line bg-soft p-0.5 ${className}`}>
      {OPTIONS.map((o) => {
        const on = pref === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            title={`${o.label} theme`}
            onClick={() => setThemePref(o.id)}
            className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-colors ${compact ? "size-8 justify-center" : "min-h-9 px-3 text-sm"} ${on ? "bg-surface text-fg shadow-card" : "text-muted hover:text-fg"}`}
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{o.icon}</svg>
            <span className={compact ? "sr-only" : ""}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
