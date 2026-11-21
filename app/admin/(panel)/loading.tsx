/** Shown instantly while an admin page loads its data from the server. */
export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="max-w-5xl animate-pulse">
      <span className="sr-only">Loading…</span>
      <div className="h-7 w-48 rounded-lg bg-slate-200" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-slate-200" />
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-2xl border border-slate-200 bg-white" />)}
      </div>
      <div className="mt-6 grid gap-2">
        {[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-14 rounded-xl border border-slate-200 bg-white" />)}
      </div>
    </div>
  );
}
