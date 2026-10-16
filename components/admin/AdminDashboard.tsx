"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { EnrollmentRecord } from "@/lib/types";
import { COURSES, PLANS } from "@/lib/config";

/* ── Helpers ──────────────────────────────────────────────── */
function courseLabel(id: string) { return COURSES.find((c) => c.id === id)?.title ?? id; }
function courseIcon(id: string)  { return COURSES.find((c) => c.id === id)?.icon  ?? "📚"; }
function planLabel(id: string)   { return PLANS.find((p) => p.id === id)?.label   ?? id; }
function planPrice(id: string)   { return PLANS.find((p) => p.id === id)?.price   ?? 0; }

function fmtDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtDateTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function daysLeft(iso?: string): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

type Tab    = "enrollments" | "courses" | "students";
type Filter = "all" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",                  label: "All"      },
  { key: "PENDING_VERIFICATION", label: "Pending"  },
  { key: "VERIFIED",             label: "Verified" },
  { key: "REJECTED",             label: "Rejected" },
];

/* ── Status pills ─────────────────────────────────────────── */
type PillStyle = "green" | "yellow" | "red" | "blue" | "orange" | "gray";

function DPill({ style, children }: { style: PillStyle; children: React.ReactNode }) {
  const map: Record<PillStyle, string> = {
    green:  "pill-verified", yellow: "pill-pending",
    red:    "pill-rejected", blue:   "pill-active",
    orange: "pill-pending",  gray:   "pill-disabled",
  };
  return <span className={`pill-base ${map[style]}`}>{children}</span>;
}

function PayPill({ status }: { status?: string }) {
  if (!status)                           return <DPill style="gray">No Submission</DPill>;
  if (status === "PENDING_VERIFICATION") return <DPill style="yellow">Pending</DPill>;
  if (status === "VERIFIED")             return <DPill style="green">Verified</DPill>;
  if (status === "REJECTED")             return <DPill style="red">Rejected</DPill>;
  return <DPill style="gray">{status}</DPill>;
}

function SubPill({ status, expiryDate }: { status?: string; expiryDate?: string }) {
  if (!status)                 return <DPill style="gray">None</DPill>;
  if (status === "ACTIVE") {
    const d = daysLeft(expiryDate);
    if (d !== null && d <= 3) return <DPill style="orange">Expires soon</DPill>;
    return <DPill style="green">Active</DPill>;
  }
  if (status === "PENDING")   return <DPill style="yellow">Pending</DPill>;
  if (status === "EXPIRED")   return <DPill style="gray">Expired</DPill>;
  if (status === "DISABLED")  return <DPill style="red">Disabled</DPill>;
  return <DPill style="gray">{status}</DPill>;
}

/* ── CSV Export ───────────────────────────────────────────── */
function exportCSV(records: EnrollmentRecord[]) {
  const headers = ["Enrollment ID","Full Name","WhatsApp","Email","Course","Plan","Mode","Amount","Payment Status","Sub Status","Enrolled","Expires"];
  const rows = records.map(r => [
    r.enrollment.enrollmentId,
    r.enrollment.fullName,
    r.enrollment.whatsapp,
    r.enrollment.email,
    courseLabel(r.enrollment.course),
    planLabel(r.enrollment.plan),
    r.enrollment.learningMode,
    r.payment ? `K${r.payment.amount}` : "",
    r.payment?.status ?? "No Payment",
    r.subscription?.status ?? "No Sub",
    fmtDate(r.enrollment.createdAt),
    fmtDate(r.subscription?.expiryDate),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = `kaluluvision-enrollments-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function AdminDashboard({ initialRecords }: { initialRecords: EnrollmentRecord[] }) {
  const router = useRouter();
  const [, startTransition]               = useTransition();
  const [records, setRecords]             = useState(initialRecords);
  const [tab, setTab]                     = useState<Tab>("enrollments");
  const [filter, setFilter]               = useState<Filter>("all");
  const [search, setSearch]               = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selected, setSelected]           = useState<EnrollmentRecord | null>(null);
  const [refreshing, setRefreshing]       = useState(false);

  async function refresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/enrollments");
      if (res.ok) { const j = await res.json(); if (j.success) setRecords(j.data); }
    } finally { setRefreshing(false); }
  }

  async function doPayment(enrollmentId: string, action: "verify" | "reject") {
    setActionLoading(enrollmentId + action);
    try {
      const res = await fetch(`/api/admin/payments/${action}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId }),
      });
      if (res.ok) { await refresh(); setSelected(null); }
      else { const j = await res.json(); alert(j.error ?? "Failed."); }
    } finally { setActionLoading(null); }
  }

  async function doSub(enrollmentId: string, action: "enable" | "disable") {
    setActionLoading(enrollmentId + action);
    try {
      const res = await fetch(`/api/admin/subscriptions/${action}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId }),
      });
      if (res.ok) { await refresh(); setSelected(null); }
      else { const j = await res.json(); alert(j.error ?? "Failed."); }
    } finally { setActionLoading(null); }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    startTransition(() => router.push("/admin/login"));
  }

  /* ── Filtered records ── */
  const filtered = useMemo(() => records.filter((r) => {
    const matchFilter = filter === "all" || r.payment?.status === filter ||
      (filter === "PENDING_VERIFICATION" && !r.payment);
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.enrollment.fullName.toLowerCase().includes(q) ||
      r.enrollment.enrollmentId.toLowerCase().includes(q) ||
      r.enrollment.email.toLowerCase().includes(q) ||
      r.enrollment.whatsapp.includes(q) ||
      courseLabel(r.enrollment.course).toLowerCase().includes(q);
    return matchFilter && matchSearch;
  }), [records, filter, search]);

  /* ── Computed stats ── */
  const stats = useMemo(() => {
    const totalRevenue = records
      .filter(r => r.payment?.status === "VERIFIED")
      .reduce((sum, r) => sum + (r.payment?.amount ?? 0), 0);
    const expiringIn3Days = records.filter(r => {
      const d = daysLeft(r.subscription?.expiryDate);
      return r.subscription?.status === "ACTIVE" && d !== null && d >= 0 && d <= 3;
    }).length;
    return [
      { label: "Enrollments",  value: records.length,                                                                         icon: "👥", color: "#10182B" },
      { label: "Pending",      value: records.filter(r => !r.payment || r.payment.status === "PENDING_VERIFICATION").length,  icon: "⏳", color: "#a16207" },
      { label: "Verified",     value: records.filter(r => r.payment?.status === "VERIFIED").length,                           icon: "✅", color: "#063F3A" },
      { label: "Active Subs",  value: records.filter(r => r.subscription?.status === "ACTIVE").length,                        icon: "🔓", color: "#0369a1" },
      { label: "Revenue (K)",  value: `K${totalRevenue.toLocaleString()}`,                                                     icon: "💰", color: "#7c3aed" },
      { label: "Expiring Soon",value: expiringIn3Days,                                                                        icon: "⚠️", color: "#b91c1c" },
    ];
  }, [records]);

  /* ── Course analytics ── */
  const courseStats = useMemo(() => {
    return COURSES.map(c => {
      const enrolled   = records.filter(r => r.enrollment.course === c.id);
      const active     = enrolled.filter(r => r.subscription?.status === "ACTIVE").length;
      const pending    = enrolled.filter(r => !r.payment || r.payment.status === "PENDING_VERIFICATION").length;
      const revenue    = enrolled.filter(r => r.payment?.status === "VERIFIED").reduce((s, r) => s + (r.payment?.amount ?? 0), 0);
      return { course: c, total: enrolled.length, active, pending, revenue };
    }).sort((a, b) => b.total - a.total);
  }, [records]);

  /* ── Unique students (by email) ── */
  const studentMap = useMemo(() => {
    const map = new Map<string, { name: string; whatsapp: string; email: string; courses: string[]; totalPaid: number; lastEnrolled: string }>();
    records.forEach(r => {
      const email = r.enrollment.email.toLowerCase();
      const existing = map.get(email);
      if (existing) {
        if (!existing.courses.includes(r.enrollment.course)) existing.courses.push(r.enrollment.course);
        existing.totalPaid += r.payment?.status === "VERIFIED" ? (r.payment?.amount ?? 0) : 0;
        if (r.enrollment.createdAt > existing.lastEnrolled) existing.lastEnrolled = r.enrollment.createdAt;
      } else {
        map.set(email, {
          name: r.enrollment.fullName,
          whatsapp: r.enrollment.whatsapp,
          email: r.enrollment.email,
          courses: [r.enrollment.course],
          totalPaid: r.payment?.status === "VERIFIED" ? (r.payment?.amount ?? 0) : 0,
          lastEnrolled: r.enrollment.createdAt,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalPaid - a.totalPaid);
  }, [records]);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "enrollments", label: "Enrollments", icon: "📋" },
    { key: "courses",     label: "Courses",     icon: "📚" },
    { key: "students",    label: "Students",    icon: "👤" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F5F6F2" }}>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30" style={{ background: "#10182B", borderBottom: "1px solid rgba(233,255,163,0.15)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl overflow-hidden" style={{ background: "#1a2540", padding: "4px 8px" }}>
              <Image src="/logo.png" alt="Kalulu Vision" width={100} height={34} className="h-9 w-auto object-contain" />
            </div>
            <span className="hidden sm:block text-[11px] font-semibold px-2 py-0.5 rounded-md"
              style={{ background: "rgba(233,255,163,0.15)", color: "#E9FFA3", border: "1px solid rgba(233,255,163,0.25)" }}>
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Refresh */}
            <button type="button" onClick={refresh} disabled={refreshing}
              className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-all disabled:opacity-50"
              style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", background: "transparent" }}
              title="Refresh data"
            >
              <svg className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {refreshing ? "..." : "Refresh"}
            </button>
            {/* Export CSV */}
            <button type="button" onClick={() => exportCSV(records)}
              className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
              style={{ color: "#E9FFA3", border: "1px solid rgba(233,255,163,0.25)", background: "transparent" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <a href="/" className="hidden sm:block text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>← Website</a>
            <button type="button" onClick={handleLogout}
              className="text-[13px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
              style={{ color: "#E9FFA3", border: "1px solid rgba(233,255,163,0.25)", background: "transparent" }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">

        {/* ── Heading ── */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight mb-0.5" style={{ color: "#10182B" }}>Dashboard</h1>
            <p className="text-[13px]" style={{ color: "#7a8394" }}>{records.length} total enrollments · {studentMap.length} unique students</p>
          </div>
          <span className="text-[12px]" style={{ color: "#7a8394" }}>
            Last updated: {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="glass p-4 transition-all duration-200"
              style={{ background: "#fff", border: "1.5px solid #E5E7DF" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#c8e86a"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#E5E7DF"}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#7a8394" }}>{s.label}</p>
                <span className="text-base leading-none">{s.icon}</span>
              </div>
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1.5 mb-5 border-b" style={{ borderColor: "#E5E7DF" }}>
          {tabs.map(t => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold transition-all cursor-pointer rounded-t-lg"
              style={{
                color:        tab === t.key ? "#10182B" : "#7a8394",
                borderBottom: tab === t.key ? "2.5px solid #10182B" : "2.5px solid transparent",
                background:   tab === t.key ? "#fff" : "transparent",
                marginBottom: "-1px",
              }}
            >
              <span>{t.icon}</span>{t.label}
              {t.key === "enrollments" && (
                <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "#10182B", color: "#E9FFA3" }}>
                  {records.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            TAB: ENROLLMENTS
           ══════════════════════════════════════════ */}
        {tab === "enrollments" && (
          <>
            {/* Toolbar */}
            <div className="glass p-4 mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
              style={{ background: "#fff", border: "1.5px solid #E5E7DF" }}>
              <div className="relative flex-1 w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#7a8394" }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="search" placeholder="Search name, ID, email, course…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="input-base" style={{ paddingLeft: "2.25rem", background: "#F5F6F2", border: "1.5px solid #E5E7DF", color: "#10182B", fontSize: "14px" }} />
              </div>
              <div className="flex gap-1.5 flex-wrap shrink-0">
                {FILTERS.map(f => (
                  <button key={f.key} type="button" onClick={() => setFilter(f.key)}
                    className="px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer"
                    style={filter === f.key
                      ? { background: "#10182B", color: "#E9FFA3", border: "1px solid #10182B" }
                      : { background: "#F5F6F2", color: "#4a5568", border: "1px solid #E5E7DF" }}>
                    {f.label}
                  </button>
                ))}
                <button type="button" onClick={() => exportCSV(filtered)}
                  className="sm:hidden px-3.5 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer"
                  style={{ background: "#E9FFA3", color: "#063F3A", border: "1px solid #c8e86a" }}>
                  CSV
                </button>
              </div>
            </div>

            {/* Showing count */}
            <p className="text-[12px] mb-3" style={{ color: "#7a8394" }}>
              Showing {filtered.length} of {records.length} enrollments
            </p>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1.5px solid #E5E7DF" }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1.5px solid #E5E7DF", background: "#F5F6F2" }}>
                      {["Enrollment ID","Student","Course","Plan","Amount","Payment","Subscription","Enrolled","Expires",""].map(h => (
                        <th key={h} className="text-left text-[10.5px] font-black uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                          style={{ color: "#7a8394" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={10} className="text-center py-16 text-[13px]" style={{ color: "#7a8394" }}>
                        No enrollments found.
                      </td></tr>
                    ) : filtered.map(record => {
                      const { enrollment, payment, subscription } = record;
                      const plan = PLANS.find(p => p.id === enrollment.plan);
                      const d    = daysLeft(subscription?.expiryDate);
                      const expiringSoon = subscription?.status === "ACTIVE" && d !== null && d <= 3 && d >= 0;
                      return (
                        <tr key={enrollment.id}
                          style={{ borderBottom: "1px solid #F5F6F2" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FAFAF8"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                        >
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="font-mono text-[12px] font-bold" style={{ color: "#063F3A" }}>
                              {enrollment.enrollmentId}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 min-w-[160px]">
                            <p className="font-semibold text-[13px]" style={{ color: "#10182B" }}>{enrollment.fullName}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: "#7a8394" }}>{enrollment.whatsapp}</p>
                            <p className="text-[11px]" style={{ color: "#7a8394" }}>{enrollment.email}</p>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="text-[12.5px] font-medium" style={{ color: "#10182B" }}>
                              {courseIcon(enrollment.course)} {courseLabel(enrollment.course)}
                            </span>
                            <p className="text-[10.5px] mt-0.5 capitalize" style={{ color: "#7a8394" }}>{enrollment.learningMode}</p>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-[13px]" style={{ color: "#4a5568" }}>
                            {planLabel(enrollment.plan)}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-[13px] font-bold" style={{ color: "#10182B" }}>
                            K{payment?.amount ?? plan?.price ?? 0}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap"><PayPill status={payment?.status} /></td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <SubPill status={subscription?.status} expiryDate={subscription?.expiryDate} />
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-[12px]" style={{ color: "#7a8394" }}>
                            {fmtDate(enrollment.createdAt)}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {subscription?.expiryDate ? (
                              <span className="text-[12px] font-medium" style={{ color: expiringSoon ? "#b91c1c" : "#7a8394" }}>
                                {expiringSoon ? `⚠ ${d}d left` : fmtDate(subscription.expiryDate)}
                              </span>
                            ) : <span style={{ color: "#7a8394" }}>—</span>}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <button type="button" onClick={() => setSelected(record)}
                              className="text-[12.5px] font-bold cursor-pointer px-3 py-1.5 rounded-lg transition-all"
                              style={{ background: "#E9FFA3", color: "#063F3A", border: "1px solid #c8e86a" }}>
                              Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════
            TAB: COURSES
           ══════════════════════════════════════════ */}
        {tab === "courses" && (
          <div className="space-y-4">
            <p className="text-[13px]" style={{ color: "#7a8394" }}>
              Enrollment breakdown by course — all {records.length} enrollments
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {courseStats.map(({ course, total, active, pending, revenue }) => (
                <div key={course.id} className="rounded-2xl p-5"
                  style={{ background: "#fff", border: "1.5px solid #E5E7DF" }}>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: "#F5F6F2", border: "1.5px solid #E5E7DF" }}>
                      {course.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[14px] truncate" style={{ color: "#10182B" }}>{course.title}</p>
                      <p className="text-[11px] truncate" style={{ color: "#7a8394" }}>{course.subtitle}</p>
                    </div>
                    <span className="ml-auto text-2xl font-extrabold shrink-0" style={{ color: "#10182B" }}>{total}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full mb-4" style={{ background: "#F5F6F2" }}>
                    <div className="h-2 rounded-full transition-all"
                      style={{ width: records.length ? `${(total / records.length) * 100}%` : "0%", background: "#E9FFA3", border: "1px solid #c8e86a" }} />
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "Active",   value: active,  color: "#063F3A" },
                      { label: "Pending",  value: pending, color: "#a16207" },
                      { label: "Revenue",  value: `K${revenue}`, color: "#7c3aed" },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl p-2.5" style={{ background: "#F5F6F2" }}>
                        <p className="text-[15px] font-extrabold" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "#7a8394" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent enrollments in this course */}
                  {total > 0 && (
                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid #F5F6F2" }}>
                      <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "#7a8394" }}>Recent Enrollments</p>
                      {records
                        .filter(r => r.enrollment.course === course.id)
                        .slice(0, 3)
                        .map(r => (
                          <div key={r.enrollment.id} className="flex items-center justify-between py-1.5">
                            <div>
                              <p className="text-[12px] font-semibold" style={{ color: "#10182B" }}>{r.enrollment.fullName}</p>
                              <p className="text-[10px]" style={{ color: "#7a8394" }}>{fmtDate(r.enrollment.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <PayPill status={r.payment?.status} />
                              <button type="button" onClick={() => { setSelected(r); setTab("enrollments"); }}
                                className="text-[11px] font-bold cursor-pointer px-2 py-1 rounded-lg"
                                style={{ background: "#E9FFA3", color: "#063F3A" }}>
                                View
                              </button>
                            </div>
                          </div>
                        ))}
                      {total > 3 && (
                        <button type="button"
                          onClick={() => { setSearch(courseLabel(course.id)); setTab("enrollments"); }}
                          className="mt-1 text-[11.5px] font-bold cursor-pointer"
                          style={{ color: "#063F3A" }}>
                          View all {total} enrollments →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: STUDENTS
           ══════════════════════════════════════════ */}
        {tab === "students" && (
          <div>
            <p className="text-[13px] mb-4" style={{ color: "#7a8394" }}>
              {studentMap.length} unique students · Sorted by total revenue
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1.5px solid #E5E7DF" }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#F5F6F2", borderBottom: "1.5px solid #E5E7DF" }}>
                      {["Student","Email","WhatsApp","Courses Enrolled","Total Paid","Last Enrolled"].map(h => (
                        <th key={h} className="text-left text-[10.5px] font-black uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                          style={{ color: "#7a8394" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentMap.map(s => (
                      <tr key={s.email}
                        style={{ borderBottom: "1px solid #F5F6F2" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FAFAF8"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                      >
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-[13px]" style={{ color: "#10182B" }}>{s.name}</p>
                        </td>
                        <td className="px-4 py-3.5 text-[12.5px]" style={{ color: "#4a5568" }}>{s.email}</td>
                        <td className="px-4 py-3.5">
                          <a href={`https://wa.me/${s.whatsapp.replace(/\D/g,"")}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-[12.5px] font-medium hover:underline"
                            style={{ color: "#25D366" }}>
                            {s.whatsapp}
                          </a>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {s.courses.map(c => (
                              <span key={c} className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                                style={{ background: "#F0FDF4", color: "#063F3A", border: "1px solid #86EFAC" }}>
                                {courseIcon(c)} {courseLabel(c)}
                              </span>
                            ))}
                          </div>
                          <p className="text-[10.5px] mt-1" style={{ color: "#7a8394" }}>{s.courses.length} course{s.courses.length !== 1 ? "s" : ""}</p>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <p className="text-[14px] font-extrabold" style={{ color: s.totalPaid > 0 ? "#063F3A" : "#7a8394" }}>
                            K{s.totalPaid.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-[12px]" style={{ color: "#7a8394" }}>
                          {fmtDate(s.lastEnrolled)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Student slide-over panel ── */}
      {selected && (
        <StudentPanel
          record={selected}
          isLoading={actionLoading !== null}
          onVerify={() => doPayment(selected.enrollment.enrollmentId, "verify")}
          onReject={() => doPayment(selected.enrollment.enrollmentId, "reject")}
          onEnable={() => doSub(selected.enrollment.enrollmentId, "enable")}
          onDisable={() => doSub(selected.enrollment.enrollmentId, "disable")}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STUDENT PANEL (slide-over)
   ═══════════════════════════════════════════════════════════ */
function StudentPanel({ record, isLoading, onVerify, onReject, onEnable, onDisable, onClose }: {
  record: EnrollmentRecord; isLoading: boolean;
  onVerify: () => void; onReject: () => void;
  onEnable: () => void; onDisable: () => void;
  onClose: () => void;
}) {
  const { enrollment, payment, subscription } = record;
  const plan     = PLANS.find(p => p.id === enrollment.plan);
  const course   = COURSES.find(c => c.id === enrollment.course);
  const payStatus = payment?.status;
  const subStatus = subscription?.status;
  const d = daysLeft(subscription?.expiryDate);
  const [copied, setCopied] = useState(false);

  function copyId() {
    navigator.clipboard?.writeText(enrollment.enrollmentId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const waLink = `https://wa.me/${enrollment.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${enrollment.fullName}, regarding your enrollment ${enrollment.enrollmentId} at Kalulu Vision.`)}`;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 cursor-pointer" style={{ background: "rgba(16,24,43,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="relative w-full max-w-md flex flex-col h-full overflow-hidden"
        style={{ background: "#fff", borderLeft: "2px solid #E5E7DF", boxShadow: "-20px 0 60px rgba(16,24,43,0.15)" }}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 shrink-0"
          style={{ borderBottom: "1.5px solid #E5E7DF", background: "#10182B" }}>
          <div>
            <h2 className="font-black text-white text-[16px]">{enrollment.fullName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <code className="font-mono text-[12px]" style={{ color: "#E9FFA3" }}>{enrollment.enrollmentId}</code>
              <button type="button" onClick={copyId}
                className="text-[10px] px-2 py-0.5 rounded cursor-pointer font-bold"
                style={{ background: "rgba(233,255,163,0.15)", color: "#E9FFA3", border: "1px solid rgba(233,255,163,0.3)" }}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer"
            style={{ color: "rgba(255,255,255,0.5)", background: "transparent", border: "none" }}
            aria-label="Close">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Quick contact */}
          <div className="grid grid-cols-2 gap-2">
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "#25D366" }}>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <a href={`mailto:${enrollment.email}`}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-bold transition-all"
              style={{ background: "#F5F6F2", color: "#10182B", border: "1.5px solid #E5E7DF" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          </div>

          {/* Student details */}
          <LightBlock title="Student Details">
            <LRow label="Full Name"  value={enrollment.fullName} />
            <LRow label="WhatsApp"   value={enrollment.whatsapp} />
            <LRow label="Email"      value={enrollment.email} />
            <LRow label="Mode"       value={enrollment.learningMode} />
            <LRow label="Enrolled"   value={fmtDateTime(enrollment.createdAt)} />
          </LightBlock>

          {/* Course & plan */}
          <LightBlock title="Course & Plan">
            <LRow label="Course" value={`${course?.icon ?? ""} ${course?.title ?? enrollment.course}`} />
            <LRow label="Plan"   value={`${plan?.label} — K${plan?.price} (${plan?.durationDays} days)`} />
            {course?.subtitle && <LRow label="Topics" value={course.subtitle} />}
          </LightBlock>

          {/* Payment */}
          <LightBlock title="Payment">
            {payment ? (
              <>
                <LRow label="Amount"    value={`K${payment.amount}`} bold />
                <LRow label="Method"    value={payment.paymentMethod} />
                <LRow label="Status"    value={payment.status} />
                <LRow label="Submitted" value={fmtDateTime(payment.submittedAt)} />
                {payment.verifiedAt && <LRow label="Verified" value={fmtDateTime(payment.verifiedAt)} />}
              </>
            ) : (
              <p className="text-[13px]" style={{ color: "#7a8394" }}>No payment submitted yet.</p>
            )}
          </LightBlock>

          {/* Subscription */}
          <LightBlock title="Subscription">
            {subscription ? (
              <>
                <LRow label="Status"  value={subscription.status} />
                <LRow label="Plan"    value={`${plan?.label} (${plan?.durationDays} days)`} />
                <LRow label="Start"   value={subscription.startDate  ? fmtDateTime(subscription.startDate)  : "—"} />
                <LRow label="Expires" value={subscription.expiryDate ? fmtDateTime(subscription.expiryDate) : "—"} />
                {d !== null && subscription.status === "ACTIVE" && (
                  <div className="mt-2 px-3 py-2 rounded-xl"
                    style={{ background: d <= 3 ? "#FEF2F2" : "#F0FDF4", border: `1px solid ${d <= 3 ? "#FCA5A5" : "#86EFAC"}` }}>
                    <p className="text-[12px] font-bold" style={{ color: d <= 3 ? "#b91c1c" : "#15803d" }}>
                      {d <= 0 ? "⚠ Subscription expired" : d <= 3 ? `⚠ Expires in ${d} day${d !== 1 ? "s" : ""}` : `✓ ${d} days remaining`}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-[13px]" style={{ color: "#7a8394" }}>No subscription yet.</p>
            )}
          </LightBlock>
        </div>

        {/* Actions footer */}
        <div className="px-6 py-5 space-y-2.5 shrink-0" style={{ borderTop: "1.5px solid #E5E7DF", background: "#FAFAF8" }}>
          <p className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: "#7a8394" }}>Admin Actions</p>

          {payStatus === "PENDING_VERIFICATION" && (
            <div className="grid grid-cols-2 gap-2.5">
              <LightBtn onClick={onVerify} disabled={isLoading} color="green">✓ Verify Payment</LightBtn>
              <LightBtn onClick={onReject} disabled={isLoading} color="red">✗ Reject</LightBtn>
            </div>
          )}
          {payStatus === "VERIFIED" && subStatus !== "ACTIVE" && (
            <LightBtn onClick={onEnable} disabled={isLoading} color="green" full>🔓 Enable Subscription</LightBtn>
          )}
          {subStatus === "ACTIVE" && (
            <LightBtn onClick={onDisable} disabled={isLoading} color="red" full>🔒 Disable Subscription</LightBtn>
          )}
          {(subStatus === "DISABLED" || subStatus === "EXPIRED" || subStatus === "PENDING") && (
            <LightBtn onClick={onEnable} disabled={isLoading} color="green" full>🔓 Re-enable Subscription</LightBtn>
          )}
          {!payStatus && !subStatus && (
            <p className="text-center text-[13px] py-2" style={{ color: "#7a8394" }}>No actions available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Light info block ─────────────────────────────────────── */
function LightBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10.5px] font-black uppercase tracking-wider mb-2" style={{ color: "#7a8394" }}>{title}</p>
      <div className="rounded-xl p-4 space-y-2" style={{ background: "#F5F6F2", border: "1.5px solid #E5E7DF" }}>
        {children}
      </div>
    </div>
  );
}
function LRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex gap-3 text-[12.5px]">
      <dt className="w-20 shrink-0 font-medium" style={{ color: "#7a8394" }}>{label}</dt>
      <dd className={`break-all ${bold ? "font-extrabold" : "font-medium"}`} style={{ color: "#10182B" }}>{value}</dd>
    </div>
  );
}

/* ── Light action button ──────────────────────────────────── */
function LightBtn({ children, onClick, disabled, color, full }: {
  children: React.ReactNode; onClick: () => void;
  disabled: boolean; color: "green" | "red" | "blue"; full?: boolean;
}) {
  const cfg = {
    green: { bg: "#F0FDF4", text: "#15803d", border: "#86EFAC", hover: "#DCFCE7" },
    red:   { bg: "#FEF2F2", text: "#b91c1c", border: "#FCA5A5", hover: "#FEE2E2" },
    blue:  { bg: "#EFF6FF", text: "#1d4ed8", border: "#93C5FD", hover: "#DBEAFE" },
  }[color];
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer ${full ? "w-full" : ""}`}
      style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}`, color: cfg.text }}
      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = cfg.hover}
      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = cfg.bg}
    >
      {children}
    </button>
  );
}
