"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { EnrollmentRecord } from "@/lib/types";
import { COURSES, PLANS } from "@/lib/config";

/* ═══════════════════════════════════════════════════════════
   SVG ICON LIBRARY
   ═══════════════════════════════════════════════════════════ */
function Icon({ d, size = 16, stroke = "currentColor", fill = "none", strokeWidth = 2, ...props }: {
  d: string | string[]; size?: number; stroke?: string; fill?: string; strokeWidth?: number;
  className?: string; style?: React.CSSProperties;
}) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...props}>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

// Icon path constants
const I = {
  users:      "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  clock:      "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 5v5l4 2",
  check_c:    ["M22 11.08V12a10 10 0 1 1-5.93-9.14","M22 4 12 14.01l-3-3"],
  unlock:     "M18 1 6 1a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zM6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M10 11v6M14 11v6",
  money:      ["M12 1v22","M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"],
  alert:      ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4","M12 17h.01"],
  refresh:    "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  download:   ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  search:     "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  x:          "M18 6 6 18M6 6l12 12",
  copy:       ["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M10 4h4v4h-4z","M8 12h8M8 16h5"],
  whatsapp:   "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
  mail:       ["M3 8l7.89 5.26a2 2 0 002.22 0L21 8","M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"],
  trash:      ["M3 6h18","M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6","M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2","M10 11v6","M14 11v6"],
  check:      "M5 13l4 4L19 7",
  reject:     "M18 6L6 18M6 6l12 12",
  lock:       ["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 0110 0v4"],
  unlock2:    ["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 019.9-1"],
  arrow_r:    "M5 12h14M12 5l7 7-7 7",
  book:       ["M4 19.5A2.5 2.5 0 016.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"],
  user:       ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"],
  sign_out:   ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"],
  globe:      ["M12 2a10 10 0 100 20A10 10 0 0012 2z","M2 12h20","M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"],
  settings:   ["M12 15a3 3 0 100-6 3 3 0 000 6z","M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"],
};

/* ── Helpers ──────────────────────────────────────────────── */
function courseLabel(id: string) { return COURSES.find((c) => c.id === id)?.title ?? id; }
function courseIcon(id: string)  { return COURSES.find((c) => c.id === id)?.icon  ?? "📚"; }
function planLabel(id: string)   { return PLANS.find((p) => p.id === id)?.label   ?? id; }

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
    green: "pill-verified", yellow: "pill-pending", red: "pill-rejected",
    blue: "pill-active", orange: "pill-pending", gray: "pill-disabled",
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
    if (d !== null && d <= 3) return <DPill style="orange">Expiring</DPill>;
    return <DPill style="green">Active</DPill>;
  }
  if (status === "PENDING")   return <DPill style="yellow">Pending</DPill>;
  if (status === "EXPIRED")   return <DPill style="gray">Expired</DPill>;
  if (status === "DISABLED")  return <DPill style="red">Disabled</DPill>;
  return <DPill style="gray">{status}</DPill>;
}

/* ── CSV export ───────────────────────────────────────────── */
function exportCSV(records: EnrollmentRecord[]) {
  const headers = ["Enrollment ID","Full Name","WhatsApp","Email","Course","Plan","Mode","Amount","Payment Status","Sub Status","Enrolled","Expires"];
  const rows = records.map(r => [
    r.enrollment.enrollmentId, r.enrollment.fullName, r.enrollment.whatsapp,
    r.enrollment.email, courseLabel(r.enrollment.course), planLabel(r.enrollment.plan),
    r.enrollment.learningMode, r.payment ? `K${r.payment.amount}` : "",
    r.payment?.status ?? "No Payment", r.subscription?.status ?? "No Sub",
    fmtDate(r.enrollment.createdAt), fmtDate(r.subscription?.expiryDate),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = `kaluluvision-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

/* ═══════════════════════════════════════════════════════════
   MAIN DASHBOARD
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

  async function doDelete(enrollmentId: string) {
    setActionLoading(enrollmentId + "delete");
    try {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, { method: "DELETE" });
      if (res.ok) { await refresh(); setSelected(null); }
      else { const j = await res.json(); alert(j.error ?? "Delete failed."); }
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

  /* ── Stats ── */
  const stats = useMemo(() => {
    const totalRevenue = records.filter(r => r.payment?.status === "VERIFIED")
      .reduce((sum, r) => sum + (r.payment?.amount ?? 0), 0);
    const expiring = records.filter(r => {
      const d = daysLeft(r.subscription?.expiryDate);
      return r.subscription?.status === "ACTIVE" && d !== null && d >= 0 && d <= 3;
    }).length;
    return [
      { label: "Total",        value: records.length,                                                                  icon: I.users,   color: "#10182B" },
      { label: "Pending",      value: records.filter(r => !r.payment || r.payment.status === "PENDING_VERIFICATION").length, icon: I.clock, color: "#a16207" },
      { label: "Verified",     value: records.filter(r => r.payment?.status === "VERIFIED").length,                    icon: I.check_c, color: "#063F3A" },
      { label: "Active Subs",  value: records.filter(r => r.subscription?.status === "ACTIVE").length,                 icon: I.unlock,  color: "#0369a1" },
      { label: "Revenue",      value: `K${totalRevenue.toLocaleString()}`,                                             icon: I.money,   color: "#7c3aed" },
      { label: "Expiring Soon",value: expiring,                                                                        icon: I.alert,   color: "#b91c1c" },
    ];
  }, [records]);

  /* ── Course analytics ── */
  const courseStats = useMemo(() => COURSES.map(c => {
    const enrolled = records.filter(r => r.enrollment.course === c.id);
    return {
      course: c,
      total:   enrolled.length,
      active:  enrolled.filter(r => r.subscription?.status === "ACTIVE").length,
      pending: enrolled.filter(r => !r.payment || r.payment.status === "PENDING_VERIFICATION").length,
      revenue: enrolled.filter(r => r.payment?.status === "VERIFIED").reduce((s, r) => s + (r.payment?.amount ?? 0), 0),
    };
  }).sort((a, b) => b.total - a.total), [records]);

  /* ── Unique students ── */
  const studentMap = useMemo(() => {
    const map = new Map<string, { name: string; whatsapp: string; email: string; courses: string[]; totalPaid: number; lastEnrolled: string }>();
    records.forEach(r => {
      const key = r.enrollment.email.toLowerCase();
      const ex  = map.get(key);
      if (ex) {
        if (!ex.courses.includes(r.enrollment.course)) ex.courses.push(r.enrollment.course);
        ex.totalPaid += r.payment?.status === "VERIFIED" ? (r.payment?.amount ?? 0) : 0;
        if (r.enrollment.createdAt > ex.lastEnrolled) ex.lastEnrolled = r.enrollment.createdAt;
      } else {
        map.set(key, { name: r.enrollment.fullName, whatsapp: r.enrollment.whatsapp,
          email: r.enrollment.email, courses: [r.enrollment.course],
          totalPaid: r.payment?.status === "VERIFIED" ? (r.payment?.amount ?? 0) : 0,
          lastEnrolled: r.enrollment.createdAt });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalPaid - a.totalPaid);
  }, [records]);

  const TABS: { key: Tab; label: string; iconPath: string | string[] }[] = [
    { key: "enrollments", label: "Enrollments", iconPath: I.book },
    { key: "courses",     label: "Courses",     iconPath: I.globe },
    { key: "students",    label: "Students",    iconPath: I.user },
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
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md"
              style={{ background: "rgba(233,255,163,0.15)", color: "#E9FFA3", border: "1px solid rgba(233,255,163,0.25)" }}>
              <Icon d={I.settings} size={12} stroke="#E9FFA3" />
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button type="button" onClick={refresh} disabled={refreshing}
              title="Refresh"
              className="flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer disabled:opacity-50"
              style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", background: "transparent" }}>
              <Icon d={I.refresh} size={14} stroke="currentColor" className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{refreshing ? "…" : "Refresh"}</span>
            </button>
            {/* Export */}
            <button type="button" onClick={() => exportCSV(records)}
              title="Export CSV"
              className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer"
              style={{ color: "#E9FFA3", border: "1px solid rgba(233,255,163,0.25)", background: "transparent" }}>
              <Icon d={I.download} size={14} stroke="#E9FFA3" />
              Export
            </button>
            <a href="/" className="hidden sm:block text-[12px] font-medium px-2.5 py-1.5 rounded-lg"
              style={{ color: "rgba(255,255,255,0.4)" }}>← Site</a>
            <button type="button" onClick={handleLogout}
              className="flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer"
              style={{ color: "#E9FFA3", border: "1px solid rgba(233,255,163,0.25)", background: "transparent" }}>
              <Icon d={I.sign_out} size={14} stroke="#E9FFA3" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">

        {/* ── Heading ── */}
        <div className="mb-6 flex items-end justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#10182B" }}>Dashboard</h1>
            <p className="text-[13px] mt-0.5" style={{ color: "#7a8394" }}>
              {records.length} enrollments · {studentMap.length} students
            </p>
          </div>
          <span className="text-[11px] font-medium" style={{ color: "#7a8394" }}>
            {new Date().toLocaleString("en-GB", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}
          </span>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-7">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl p-4 transition-all"
              style={{ background: "#fff", border: "1.5px solid #E5E7DF" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#c8e86a"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#E5E7DF"}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: "#7a8394" }}>{s.label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${s.color}15` }}>
                  <Icon d={s.icon} size={14} stroke={s.color} />
                </div>
              </div>
              <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-0.5 mb-5 border-b" style={{ borderColor: "#E5E7DF" }}>
          {TABS.map(t => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold cursor-pointer rounded-t-lg transition-all"
              style={{
                color:        tab === t.key ? "#10182B" : "#7a8394",
                borderBottom: tab === t.key ? "2.5px solid #10182B" : "2.5px solid transparent",
                background:   tab === t.key ? "#fff" : "transparent",
                marginBottom: "-1px",
              }}>
              <Icon d={t.iconPath} size={15} stroke="currentColor" />
              {t.label}
              {t.key === "enrollments" && records.length > 0 && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                  style={{ background: "#10182B", color: "#E9FFA3" }}>{records.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ══════════ TAB: ENROLLMENTS ══════════ */}
        {tab === "enrollments" && (
          <>
            {/* Toolbar */}
            <div className="rounded-2xl p-4 mb-4 flex flex-col sm:flex-row gap-3"
              style={{ background: "#fff", border: "1.5px solid #E5E7DF" }}>
              <div className="relative flex-1">
                <Icon d={I.search} size={16} stroke="#7a8394"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input type="search" placeholder="Search name, ID, email, course…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="input-base"
                  style={{ paddingLeft: "2.25rem", background: "#F5F6F2", border: "1.5px solid #E5E7DF", color: "#10182B", fontSize: "14px" }} />
              </div>
              <div className="flex gap-1.5 flex-wrap shrink-0">
                {FILTERS.map(f => (
                  <button key={f.key} type="button" onClick={() => setFilter(f.key)}
                    className="px-3.5 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer"
                    style={filter === f.key
                      ? { background: "#10182B", color: "#E9FFA3", border: "1px solid #10182B" }
                      : { background: "#F5F6F2", color: "#4a5568", border: "1px solid #E5E7DF" }}>
                    {f.label}
                  </button>
                ))}
                <button type="button" onClick={() => exportCSV(filtered)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer"
                  style={{ background: "#E9FFA3", color: "#063F3A", border: "1px solid #c8e86a" }}>
                  <Icon d={I.download} size={13} stroke="#063F3A" />
                  CSV
                </button>
              </div>
            </div>
            <p className="text-[12px] mb-3" style={{ color: "#7a8394" }}>
              Showing {filtered.length} of {records.length}
            </p>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1.5px solid #E5E7DF" }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#F5F6F2", borderBottom: "1.5px solid #E5E7DF" }}>
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
                      const expiringSoon = subscription?.status === "ACTIVE" && d !== null && d >= 0 && d <= 3;
                      return (
                        <tr key={enrollment.id} style={{ borderBottom: "1px solid #F5F6F2" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FAFAF8"}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="font-mono text-[12px] font-bold" style={{ color: "#063F3A" }}>
                              {enrollment.enrollmentId}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 min-w-[160px]">
                            <p className="font-semibold text-[13px]" style={{ color: "#10182B" }}>{enrollment.fullName}</p>
                            <p className="text-[11px]" style={{ color: "#7a8394" }}>{enrollment.whatsapp}</p>
                            <p className="text-[11px]" style={{ color: "#7a8394" }}>{enrollment.email}</p>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="text-[12.5px] font-medium" style={{ color: "#10182B" }}>
                              {courseIcon(enrollment.course)} {courseLabel(enrollment.course)}
                            </span>
                            <p className="text-[10.5px] capitalize mt-0.5" style={{ color: "#7a8394" }}>{enrollment.learningMode}</p>
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
                              <span className="text-[12px] font-medium"
                                style={{ color: expiringSoon ? "#b91c1c" : "#7a8394" }}>
                                {expiringSoon ? `⚠ ${d}d` : fmtDate(subscription.expiryDate)}
                              </span>
                            ) : <span style={{ color: "#7a8394" }}>—</span>}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <button type="button" onClick={() => setSelected(record)}
                              className="flex items-center gap-1 text-[12px] font-bold cursor-pointer px-3 py-1.5 rounded-lg"
                              style={{ background: "#E9FFA3", color: "#063F3A", border: "1px solid #c8e86a" }}>
                              <Icon d={I.settings} size={13} stroke="#063F3A" />
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

        {/* ══════════ TAB: COURSES ══════════ */}
        {tab === "courses" && (
          <div className="space-y-4">
            <p className="text-[13px]" style={{ color: "#7a8394" }}>
              Enrollment breakdown across {COURSES.length} courses
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {courseStats.map(({ course, total, active, pending, revenue }) => (
                <div key={course.id} className="rounded-2xl p-5"
                  style={{ background: "#fff", border: "1.5px solid #E5E7DF" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: "#F5F6F2", border: "1.5px solid #E5E7DF" }}>
                      {course.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[14px] truncate" style={{ color: "#10182B" }}>{course.title}</p>
                      <p className="text-[11px] truncate" style={{ color: "#7a8394" }}>{course.subtitle}</p>
                    </div>
                    <span className="text-2xl font-extrabold shrink-0" style={{ color: "#10182B" }}>{total}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full mb-4" style={{ background: "#F5F6F2" }}>
                    <div className="h-2 rounded-full"
                      style={{ width: records.length ? `${(total / records.length) * 100}%` : "0%", background: "#E9FFA3", border: "1px solid #c8e86a" }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    {[
                      { label: "Active",  value: active,        color: "#063F3A" },
                      { label: "Pending", value: pending,       color: "#a16207" },
                      { label: "Revenue", value: `K${revenue}`, color: "#7c3aed" },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl p-2.5" style={{ background: "#F5F6F2" }}>
                        <p className="text-[15px] font-extrabold" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-[9.5px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "#7a8394" }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Recent */}
                  {total > 0 && (
                    <div className="pt-3" style={{ borderTop: "1px solid #F5F6F2" }}>
                      <p className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: "#7a8394" }}>Recent</p>
                      {records.filter(r => r.enrollment.course === course.id).slice(0, 3).map(r => (
                        <div key={r.enrollment.id} className="flex items-center justify-between py-1.5 gap-2">
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold truncate" style={{ color: "#10182B" }}>{r.enrollment.fullName}</p>
                            <p className="text-[10px]" style={{ color: "#7a8394" }}>{fmtDate(r.enrollment.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <PayPill status={r.payment?.status} />
                            <button type="button" onClick={() => { setSelected(r); setTab("enrollments"); }}
                              className="text-[11px] font-bold cursor-pointer px-2 py-0.5 rounded-lg"
                              style={{ background: "#E9FFA3", color: "#063F3A", border: "1px solid #c8e86a" }}>
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                      {total > 3 && (
                        <button type="button"
                          onClick={() => { setSearch(courseLabel(course.id)); setTab("enrollments"); }}
                          className="mt-1 flex items-center gap-1 text-[11.5px] font-bold cursor-pointer"
                          style={{ color: "#063F3A" }}>
                          View all {total} <Icon d={I.arrow_r} size={13} stroke="#063F3A" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ TAB: STUDENTS ══════════ */}
        {tab === "students" && (
          <div>
            <p className="text-[13px] mb-4" style={{ color: "#7a8394" }}>
              {studentMap.length} unique students · sorted by revenue
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1.5px solid #E5E7DF" }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#F5F6F2", borderBottom: "1.5px solid #E5E7DF" }}>
                      {["Student","Email","WhatsApp","Courses","Total Paid","Last Enrolled"].map(h => (
                        <th key={h} className="text-left text-[10.5px] font-black uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                          style={{ color: "#7a8394" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {studentMap.map(s => (
                      <tr key={s.email} style={{ borderBottom: "1px solid #F5F6F2" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FAFAF8"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: "#F0FDF4", border: "1px solid #86EFAC" }}>
                              <Icon d={I.user} size={13} stroke="#063F3A" />
                            </div>
                            <p className="font-semibold text-[13px]" style={{ color: "#10182B" }}>{s.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[12.5px]" style={{ color: "#4a5568" }}>{s.email}</td>
                        <td className="px-4 py-3.5">
                          <a href={`https://wa.me/${s.whatsapp.replace(/\D/g,"")}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[12.5px] font-medium hover:underline"
                            style={{ color: "#15803d" }}>
                            <Icon d={I.whatsapp} size={13} stroke="none" fill="#15803d" />
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
                          <p className="text-[10px] mt-1" style={{ color: "#7a8394" }}>{s.courses.length} course{s.courses.length !== 1 ? "s" : ""}</p>
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

      {/* ── Student panel ── */}
      {selected && (
        <StudentPanel
          record={selected}
          isLoading={actionLoading !== null}
          onVerify={() => doPayment(selected.enrollment.enrollmentId, "verify")}
          onReject={() => doPayment(selected.enrollment.enrollmentId, "reject")}
          onEnable={() => doSub(selected.enrollment.enrollmentId, "enable")}
          onDisable={() => doSub(selected.enrollment.enrollmentId, "disable")}
          onDelete={() => doDelete(selected.enrollment.enrollmentId)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STUDENT PANEL
   ═══════════════════════════════════════════════════════════ */
function StudentPanel({ record, isLoading, onVerify, onReject, onEnable, onDisable, onDelete, onClose }: {
  record: EnrollmentRecord; isLoading: boolean;
  onVerify: () => void; onReject: () => void;
  onEnable: () => void; onDisable: () => void;
  onDelete: () => void; onClose: () => void;
}) {
  const { enrollment, payment, subscription } = record;
  const plan    = PLANS.find(p => p.id === enrollment.plan);
  const course  = COURSES.find(c => c.id === enrollment.course);
  const payStatus = payment?.status;
  const subStatus = subscription?.status;
  const d = daysLeft(subscription?.expiryDate);
  const [copied, setCopied]           = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function copyId() {
    navigator.clipboard?.writeText(enrollment.enrollmentId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const waLink = `https://wa.me/${enrollment.whatsapp.replace(/\D/g,"")}?text=${encodeURIComponent(`Hello ${enrollment.fullName}, regarding your enrollment ${enrollment.enrollmentId} at Kalulu Vision.`)}`;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 cursor-pointer" style={{ background: "rgba(16,24,43,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="relative w-full max-w-md flex flex-col h-full overflow-hidden"
        style={{ background: "#fff", borderLeft: "2px solid #E5E7DF", boxShadow: "-20px 0 60px rgba(16,24,43,0.15)" }}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 shrink-0"
          style={{ background: "#10182B", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <h2 className="font-black text-white text-[16px]">{enrollment.fullName}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <code className="font-mono text-[12px]" style={{ color: "#E9FFA3" }}>{enrollment.enrollmentId}</code>
              <button type="button" onClick={copyId}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded cursor-pointer font-bold"
                style={{ background: "rgba(233,255,163,0.15)", color: "#E9FFA3", border: "1px solid rgba(233,255,163,0.3)" }}>
                <Icon d={I.copy} size={10} stroke="#E9FFA3" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <button type="button" onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer"
            style={{ color: "rgba(255,255,255,0.5)", background: "transparent", border: "none" }}>
            <Icon d={I.x} size={16} stroke="currentColor" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Quick contact */}
          <div className="grid grid-cols-2 gap-2">
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-bold text-white"
              style={{ background: "#25D366" }}>
              <Icon d={I.whatsapp} size={15} stroke="none" fill="white" />
              WhatsApp
            </a>
            <a href={`mailto:${enrollment.email}`}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12.5px] font-bold"
              style={{ background: "#F5F6F2", color: "#10182B", border: "1.5px solid #E5E7DF" }}>
              <Icon d={I.mail} size={15} stroke="#10182B" />
              Email
            </a>
          </div>

          {/* Student info */}
          <LightBlock title="Student Details">
            <LRow label="Name"     value={enrollment.fullName} />
            <LRow label="WhatsApp" value={enrollment.whatsapp} />
            <LRow label="Email"    value={enrollment.email} />
            <LRow label="Mode"     value={enrollment.learningMode} />
            <LRow label="Enrolled" value={fmtDateTime(enrollment.createdAt)} />
          </LightBlock>

          {/* Course */}
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
            ) : <p className="text-[13px]" style={{ color: "#7a8394" }}>No payment submitted yet.</p>}
          </LightBlock>

          {/* Subscription */}
          <LightBlock title="Subscription">
            {subscription ? (
              <>
                <LRow label="Status"  value={subscription.status} />
                <LRow label="Plan"    value={`${plan?.label} (${plan?.durationDays}d)`} />
                <LRow label="Start"   value={subscription.startDate  ? fmtDateTime(subscription.startDate)  : "—"} />
                <LRow label="Expires" value={subscription.expiryDate ? fmtDateTime(subscription.expiryDate) : "—"} />
                {d !== null && subscription.status === "ACTIVE" && (
                  <div className="mt-2 px-3 py-2 rounded-xl"
                    style={{ background: d <= 3 ? "#FEF2F2" : "#F0FDF4", border: `1px solid ${d <= 3 ? "#FCA5A5" : "#86EFAC"}` }}>
                    <p className="text-[12px] font-bold flex items-center gap-1.5"
                      style={{ color: d <= 3 ? "#b91c1c" : "#15803d" }}>
                      <Icon d={d <= 3 ? I.alert : I.check} size={13} stroke={d <= 3 ? "#b91c1c" : "#15803d"} />
                      {d <= 0 ? "Subscription expired" : d <= 3 ? `Expires in ${d} day${d !== 1 ? "s" : ""}` : `${d} days remaining`}
                    </p>
                  </div>
                )}
              </>
            ) : <p className="text-[13px]" style={{ color: "#7a8394" }}>No subscription yet.</p>}
          </LightBlock>
        </div>

        {/* Actions footer */}
        <div className="px-6 py-4 space-y-2 shrink-0" style={{ borderTop: "1.5px solid #E5E7DF", background: "#FAFAF8" }}>
          <p className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: "#7a8394" }}>Admin Actions</p>

          {/* Payment actions */}
          {payStatus === "PENDING_VERIFICATION" && (
            <div className="grid grid-cols-2 gap-2">
              <LightBtn onClick={onVerify} disabled={isLoading} color="green" icon={I.check}>
                Verify Payment
              </LightBtn>
              <LightBtn onClick={onReject} disabled={isLoading} color="red" icon={I.reject}>
                Reject
              </LightBtn>
            </div>
          )}
          {payStatus === "VERIFIED" && subStatus !== "ACTIVE" && (
            <LightBtn onClick={onEnable} disabled={isLoading} color="blue" icon={I.unlock2} full>
              Enable Subscription
            </LightBtn>
          )}
          {subStatus === "ACTIVE" && (
            <LightBtn onClick={onDisable} disabled={isLoading} color="orange" icon={I.lock} full>
              Disable Subscription
            </LightBtn>
          )}
          {(subStatus === "DISABLED" || subStatus === "EXPIRED" || subStatus === "PENDING") && (
            <LightBtn onClick={onEnable} disabled={isLoading} color="blue" icon={I.unlock2} full>
              Re-enable Subscription
            </LightBtn>
          )}
          {!payStatus && !subStatus && (
            <p className="text-center text-[13px] py-1" style={{ color: "#7a8394" }}>No actions available yet.</p>
          )}

          {/* ── DELETE SECTION ── */}
          <div className="pt-2" style={{ borderTop: "1px solid #E5E7DF" }}>
            {!confirmDelete ? (
              <button type="button" onClick={() => setConfirmDelete(true)}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer disabled:opacity-50 transition-all"
                style={{ background: "#FEF2F2", color: "#b91c1c", border: "1.5px solid #FCA5A5" }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#FEE2E2"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2"}
              >
                <Icon d={I.trash} size={15} stroke="#b91c1c" />
                Delete Enrollment
              </button>
            ) : (
              <div className="rounded-xl p-4" style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5" }}>
                <div className="flex items-start gap-2 mb-3">
                  <Icon d={I.alert} size={18} stroke="#b91c1c" className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: "#b91c1c" }}>
                      Delete this enrollment?
                    </p>
                    <p className="text-[11.5px] mt-0.5 leading-relaxed" style={{ color: "#7f1d1d" }}>
                      This will permanently delete <strong>{enrollment.enrollmentId}</strong> and all associated payment and subscription records. This cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setConfirmDelete(false)}
                    className="py-2 rounded-xl text-[12.5px] font-bold cursor-pointer"
                    style={{ background: "#fff", color: "#4a5568", border: "1.5px solid #E5E7DF" }}>
                    Cancel
                  </button>
                  <button type="button" onClick={() => { setConfirmDelete(false); onDelete(); }}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12.5px] font-bold cursor-pointer disabled:opacity-50"
                    style={{ background: "#b91c1c", color: "#fff", border: "none" }}>
                    <Icon d={I.trash} size={13} stroke="white" />
                    Yes, Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Info blocks / rows / buttons ─────────────────────────── */
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

type BtnColor = "green" | "red" | "blue" | "orange";
function LightBtn({ children, onClick, disabled, color, icon, full }: {
  children: React.ReactNode; onClick: () => void;
  disabled: boolean; color: BtnColor;
  icon?: string | string[]; full?: boolean;
}) {
  const cfg: Record<BtnColor, { bg: string; text: string; border: string; hover: string }> = {
    green:  { bg: "#F0FDF4", text: "#15803d", border: "#86EFAC", hover: "#DCFCE7" },
    red:    { bg: "#FEF2F2", text: "#b91c1c", border: "#FCA5A5", hover: "#FEE2E2" },
    blue:   { bg: "#EFF6FF", text: "#1d4ed8", border: "#93C5FD", hover: "#DBEAFE" },
    orange: { bg: "#FFFBEB", text: "#a16207", border: "#FDE68A", hover: "#FEF3C7" },
  };
  const c = cfg[color];
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer ${full ? "w-full" : ""}`}
      style={{ background: c.bg, border: `1.5px solid ${c.border}`, color: c.text }}
      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = c.hover}
      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = c.bg}
    >
      {icon && <Icon d={icon} size={14} stroke={c.text} />}
      {children}
    </button>
  );
}
