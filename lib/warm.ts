/** Client helper: wake the server + database at most once every 4 minutes per tab. */
let last = 0;
export function warmUp(): void {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - last < 4 * 60_000) return;
  last = now;
  fetch("/api/warm", { cache: "no-store", keepalive: true }).catch(() => { /* ignore */ });
}
