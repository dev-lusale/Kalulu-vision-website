"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { EnrollmentRecord } from "@/lib/types";
import { COURSES, PLANS } from "@/lib/config";

/* ── Helpers ──────────────────────────────────────────────── */
function courseLabel(id: string) { return COURSES.find((c) => c.id === id)?.title ?? id; }
function planLabel(id: string)   { return PLANS.find((p) => p.id === id)?.label ?? id; }
function fmtDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

type Filter = "all" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",                  label: "All" },
  { key: "PENDING_VERIFICATION", label: "Pending" },
  { key: "VERIFIED",             label: "Verified" },
  { key: "REJECTED",             label: "Rejected" },
];

/* ── Status pills ─────────────────────────────────────────── */
function PayPill({ status }: { status?: string }) {
  if (!status)                              return <DPill style="gray">No Submission</DPill>;
  if (status === "PENDING_VERIFICATION")    return <DPill style="yellow">Pending</DPill>;
  if (status === "VERIFIED")                return <DPill style="green">Verified</DPill>;
  if (status === "REJECTED")                return <DPill style="red">Rejected</DPill>;
  return <DPill style="gray">{status}</DPill>;
}

function SubPill({ status }: { status?: string }) {
  if (!status)                return <DPill style="gray">None</DPill>;
  if (status === "ACTIVE")    return <DPill style="blue">Active</DPill>;
  if (status === "PENDING")   return <DPill style="yellow">Pending</DPill>;
  if (status === "EXPIRED")   return <DPill style="gray">Expired</DPill>;
  if (status === "DISABLED")  return <DPill style="red">Disabled</DPill>;
  return <DPill style="gray">{status}</DPill>;
}

function DPill({
  style, children,
}: {
  style: "green" | "yellow" | "red" | "blue" | "gray";
  children: React.ReactNode;
}) {
  const map: Record<string, string> = {
    green:  "pill-verified",
    yellow: "pill-pending",
    red:    "pill-rejected",
    blue:   "pill-active",
    gray:   "pill-disabled",
  };
  return <span className={`pill-base ${map[style]}`}>{children}</span>;
}

/* ── Main component ───────────────────────────────────────── */
export function AdminDashboard({ initialRecords }: { initialRecords: EnrollmentRecord[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [records, setRecords]             = useState(initialRecords);
  const [filter, setFilter]               = useState<Filter>("all");
  const [search, setSearch]               = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selected, setSelected]           = useState<EnrollmentRecord | null>(null);

  async function refresh() {
    const res = await fetch("/api/admin/enrollments");
    if (res.ok) { const j = await res.json(); if (j.success) setRecords(j.data); }
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

  const filtered = records.filter((r) => {
    const matchFilter =
      filter === "all" ||
      r.payment?.status === filter ||
      (filter === "PENDING_VERIFICATION" && !r.payment);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.enrollment.fullName.toLowerCase().includes(q) ||
      r.enrollment.enrollmentId.toLowerCase().includes(q) ||
      r.enrollment.email.toLowerCase().includes(q) ||
      r.enrollment.whatsapp.includes(q);
    return matchFilter && matchSearch;
  });

  const stats = [
    { label: "Enrollments", value: records.length,                                                                icon: "👥" },
    { label: "Pending",     value: records.filter(r => !r.payment || r.payment.status === "PENDING_VERIFICATION").length, icon: "⏳" },
    { label: "Verified",    value: records.filter(r => r.payment?.status === "VERIFIED").length,                  icon: "✅" },
    { label: "Active Subs", value: records.filter(r => r.subscription?.status === "ACTIVE").length,               icon: "🔓" },
  ];

  return (
    <div
      className="min-h-screen dot-bg"
      style={{ background: "var(--bg-base)" }}
    >
      {/* ── Top navbar ──────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30"
        style={{
          background: "rgba(7,11,20,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(14,165,233,0.12)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo + breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl overflow-hidden">
              <Image
                src="/logo.png"
                alt="Kalulu Vision"
                width={110}
                height={36}
                className="h-9 w-auto object-contain"
                style={{ mixBlendMode: "screen" }}
              />
            </div>
            <span className="hidden sm:block text-[11px] font-semibold px-2 py-0.5 rounded-md"
              style={{ background: "rgba(14,165,233,0.1)", color: "var(--blue-bright)", border: "1px solid rgba(14,165,233,0.2)" }}>
              Admin
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden sm:block text-[13px] transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              ← Website
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              style={{
                color: "rgba(241,245,249,0.7)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#f87171";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(248,113,113,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(241,245,249,0.7)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">

        {/* ── Page heading ───────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white mb-0.5 tracking-tight">Dashboard</h1>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            {records.length} total enrollments
          </p>
        </div>

        {/* ── Stats ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass p-5 transition-all duration-200"
              style={{ transition: "border-color .2s, box-shadow .2s" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(14,165,233,0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(14,165,233,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </p>
                <span className="text-lg">{s.icon}</span>
              </div>
              <p className="text-3xl font-black text-white tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Toolbar ────────────────────────────────────────── */}
        <div
          className="glass p-4 mb-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
        >
          {/* Search */}
          <div className="relative flex-1 w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--text-muted)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search by name, ID, email or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-9"
              style={{ paddingLeft: "2.25rem" }}
            />
          </div>
          {/* Filter pills */}
          <div className="flex gap-1.5 flex-wrap shrink-0">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className="px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer"
                style={
                  filter === f.key
                    ? {
                        background: "var(--blue)",
                        color: "#fff",
                        boxShadow: "0 0 14px rgba(14,165,233,0.4)",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        color: "var(--text-secondary)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────── */}
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["ID", "Student", "Course", "Plan", "Amount", "Payment", "Subscription", "Enrolled", "Expiry", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10.5px] font-black uppercase tracking-[0.14em] px-4 py-3.5 whitespace-nowrap"
                      style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.02)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-16 text-[13px]" style={{ color: "var(--text-muted)" }}>
                      No enrollments found.
                    </td>
                  </tr>
                ) : filtered.map((record) => {
                  const { enrollment, payment, subscription } = record;
                  const plan = PLANS.find((p) => p.id === enrollment.plan);
                  return (
                    <tr
                      key={enrollment.id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(14,165,233,0.03)"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                    >
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-[12px] font-bold" style={{ color: "var(--cyan)" }}>
                          {enrollment.enrollmentId}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap min-w-[160px]">
                        <p className="font-semibold text-white text-[13px]">{enrollment.fullName}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{enrollment.whatsapp}</p>
                        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{enrollment.email}</p>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-[13px]" style={{ color: "var(--text-secondary)" }}>
                        {courseLabel(enrollment.course)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-[13px]" style={{ color: "var(--text-secondary)" }}>
                        {planLabel(enrollment.plan)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-[13px] font-semibold text-white">
                        K{payment?.amount ?? plan?.price ?? 0}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap"><PayPill status={payment?.status} /></td>
                      <td className="px-4 py-3.5 whitespace-nowrap"><SubPill status={subscription?.status} /></td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-[12px]" style={{ color: "var(--text-muted)" }}>
                        {fmtDate(enrollment.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-[12px]" style={{ color: "var(--text-muted)" }}>
                        {fmtDate(subscription?.expiryDate)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelected(record)}
                          className="text-[12.5px] font-bold transition-colors cursor-pointer"
                          style={{ color: "var(--blue-bright)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cyan)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--blue-bright)")}
                        >
                          Manage →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Student panel ──────────────────────────────────── */}
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

/* ── Student slide-over panel ─────────────────────────────── */
function StudentPanel({
  record, isLoading, onVerify, onReject, onEnable, onDisable, onClose,
}: {
  record: EnrollmentRecord;
  isLoading: boolean;
  onVerify: () => void;
  onReject: () => void;
  onEnable: () => void;
  onDisable: () => void;
  onClose: () => void;
}) {
  const { enrollment, payment, subscription } = record;
  const plan   = PLANS.find((p) => p.id === enrollment.plan);
  const course = COURSES.find((c) => c.id === enrollment.course);
  const payStatus = payment?.status;
  const subStatus = subscription?.status;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 cursor-pointer"
        style={{ background: "rgba(4,7,14,0.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        className="relative w-full max-w-md flex flex-col h-full overflow-hidden"
        style={{
          background: "rgba(8,13,24,0.98)",
          borderLeft: "1px solid rgba(14,165,233,0.2)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5), 0 0 40px rgba(14,165,233,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-6 py-5 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h2 className="font-black text-white text-[16px]">{enrollment.fullName}</h2>
            <p className="font-mono text-[12px] mt-0.5" style={{ color: "var(--cyan)" }}>
              {enrollment.enrollmentId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors cursor-pointer shrink-0"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
            }}
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <InfoBlock title="Student">
            <InfoRow label="Name"    value={enrollment.fullName} />
            <InfoRow label="WhatsApp" value={enrollment.whatsapp} />
            <InfoRow label="Email"   value={enrollment.email} />
            <InfoRow label="Course"  value={`${course?.icon ?? ""} ${course?.title ?? enrollment.course}`} />
            <InfoRow label="Plan"    value={`${plan?.label} — K${plan?.price}`} />
            <InfoRow label="Mode"    value={enrollment.learningMode} />
            <InfoRow label="Enrolled" value={new Date(enrollment.createdAt).toLocaleString()} />
          </InfoBlock>

          <InfoBlock title="Payment">
            {payment ? (
              <>
                <InfoRow label="Amount"    value={`K${payment.amount}`} />
                <InfoRow label="Status"    value={payment.status} />
                <InfoRow label="Submitted" value={new Date(payment.submittedAt).toLocaleString()} />
                {payment.verifiedAt && (
                  <InfoRow label="Verified" value={new Date(payment.verifiedAt).toLocaleString()} />
                )}
              </>
            ) : (
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>No payment submitted yet.</p>
            )}
          </InfoBlock>

          <InfoBlock title="Subscription">
            {subscription ? (
              <>
                <InfoRow label="Status"  value={subscription.status} />
                <InfoRow label="Plan"    value={`${plan?.label} (${plan?.durationDays}d)`} />
                <InfoRow label="Start"   value={subscription.startDate ? new Date(subscription.startDate).toLocaleString() : "—"} />
                <InfoRow label="Expires" value={subscription.expiryDate ? new Date(subscription.expiryDate).toLocaleString() : "—"} />
              </>
            ) : (
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>No subscription yet.</p>
            )}
          </InfoBlock>
        </div>

        {/* Actions footer */}
        <div
          className="px-6 py-5 space-y-3 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-4" style={{ color: "var(--text-muted)" }}>
            Admin Actions
          </p>

          {/* Payment actions */}
          {payStatus === "PENDING_VERIFICATION" && (
            <div className="grid grid-cols-2 gap-2.5">
              <PanelBtn onClick={onVerify} disabled={isLoading} color="green">
                ✓ Verify Payment
              </PanelBtn>
              <PanelBtn onClick={onReject} disabled={isLoading} color="red">
                ✗ Reject
              </PanelBtn>
            </div>
          )}

          {subStatus === "ACTIVE" && (
            <PanelBtn onClick={onDisable} disabled={isLoading} color="red" full>
              🔒 Disable Subscription
            </PanelBtn>
          )}

          {(subStatus === "DISABLED" || subStatus === "EXPIRED" || subStatus === "PENDING") && (
            <PanelBtn onClick={onEnable} disabled={isLoading} color="green" full>
              🔓 Enable Subscription
            </PanelBtn>
          )}

          {!payStatus && !subStatus && (
            <p className="text-center text-[13px] py-2" style={{ color: "var(--text-muted)" }}>
              No actions available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Info block ───────────────────────────────────────────── */
function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-2.5" style={{ color: "var(--text-muted)" }}>
        {title}
      </p>
      <div
        className="rounded-xl p-4 space-y-2"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 text-[12.5px]">
      <dt className="w-20 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</dt>
      <dd className="font-medium text-white break-all">{value}</dd>
    </div>
  );
}

/* ── Panel action button ──────────────────────────────────── */
function PanelBtn({
  children, onClick, disabled, color, full,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  color: "green" | "red" | "blue";
  full?: boolean;
}) {
  const styles: Record<string, { bg: string; shadow: string }> = {
    green: {
      bg:     "rgba(34,197,94,0.15)",
      shadow: "0 0 14px rgba(34,197,94,0.2)",
    },
    red: {
      bg:     "rgba(239,68,68,0.15)",
      shadow: "0 0 14px rgba(239,68,68,0.2)",
    },
    blue: {
      bg:     "rgba(14,165,233,0.15)",
      shadow: "0 0 14px rgba(14,165,233,0.2)",
    },
  };

  const textColor: Record<string, string> = {
    green: "#22c55e",
    red:   "#f87171",
    blue:  "#38bdf8",
  };

  const borderColor: Record<string, string> = {
    green: "rgba(34,197,94,0.3)",
    red:   "rgba(239,68,68,0.3)",
    blue:  "rgba(14,165,233,0.3)",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex items-center justify-center gap-1.5 text-[13px] font-bold py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer",
        full ? "w-full" : "",
      ].join(" ")}
      style={{
        background:   styles[color].bg,
        border:       `1px solid ${borderColor[color]}`,
        color:        textColor[color],
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.boxShadow = styles[color].shadow;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {children}
    </button>
  );
}
