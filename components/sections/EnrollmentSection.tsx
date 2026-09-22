"use client";

import {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import {
  COURSES,
  PLANS,
  LEARNING_MODES,
  SITE_CONFIG,
  PAYMENT_DETAILS,
} from "@/lib/config";
import type { CourseId, LearningMode, PlanId } from "@/lib/config";
import type { Enrollment } from "@/lib/types";
import {
  buildWhatsAppUrl,
  buildPaymentWhatsAppMessage,
  formatKwacha,
} from "@/lib/utils";

type Stage = "form" | "payment" | "submitted";
type PayTab = "momo" | "bank";

interface FormValues {
  fullName: string;
  whatsapp: string;
  email: string;
  course: CourseId | "";
  plan: PlanId | "";
  learningMode: LearningMode | "";
}
interface FormErrors {
  fullName?: string;
  whatsapp?: string;
  email?: string;
  course?: string;
  plan?: string;
  learningMode?: string;
  _general?: string;
}

interface EnrollmentSectionProps {
  selectedCourse?: CourseId | null;
  selectedPlan?: PlanId | null;
  selectedSubTopic?: string | null;
}

export function EnrollmentSection({
  selectedCourse, selectedPlan, selectedSubTopic,
}: EnrollmentSectionProps) {
  const [stage, setStage]           = useState<Stage>("form");
  const [loading, setLoading]       = useState(false);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [subTopicLabel, setSubTopicLabel] = useState<string | null>(null);
  const [subTopicId, setSubTopicId]       = useState<string | null>(selectedSubTopic ?? null);

  const [values, setValues] = useState<FormValues>({
    fullName: "", whatsapp: "", email: "",
    course: selectedCourse ?? "", plan: selectedPlan ?? "", learningMode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (selectedCourse) setValues((v) => ({ ...v, course: selectedCourse }));
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedPlan) setValues((v) => ({ ...v, plan: selectedPlan }));
  }, [selectedPlan]);

  useEffect(() => {
    if (selectedSubTopic) {
      setSubTopicId(selectedSubTopic);
      const course = COURSES.find((c) => c.id === selectedCourse);
      const sub    = course?.subTopics?.find((s) => s.id === selectedSubTopic);
      setSubTopicLabel(sub?.label ?? selectedSubTopic);
    }
  }, [selectedSubTopic, selectedCourse]);

  function validate(vals: FormValues): FormErrors {
    const e: FormErrors = {};
    if (!vals.fullName.trim()) e.fullName = "Full name is required.";
    if (!vals.whatsapp.trim()) e.whatsapp = "WhatsApp number is required.";
    else if (!/^[+\d\s\-()]{7,20}$/.test(vals.whatsapp.trim())) e.whatsapp = "Enter a valid phone number.";
    if (!vals.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email.trim())) e.email = "Enter a valid email.";
    if (!vals.course)       e.course       = "Please select a course.";
    if (!vals.plan)         e.plan         = "Please select a plan.";
    if (!vals.learningMode) e.learningMode = "Please choose a learning mode.";
    return e;
  }

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined, _general: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/enrollments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, subTopic: subTopicId ?? undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "Enrollment failed.");
      setEnrollment(json.data as Enrollment);
      setStage("payment");
      setTimeout(() => {
        document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      setErrors({ _general: err instanceof Error ? err.message : "Something went wrong." });
    } finally { setLoading(false); }
  }

  async function handlePaymentSubmit(method: string) {
    if (!enrollment) return;
    setLoading(true);
    try {
      const res  = await fetch("/api/payments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId: enrollment.enrollmentId, paymentMethod: method }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed.");
      setStage("submitted");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  const planObj   = PLANS.find((p) => p.id === (enrollment?.plan   ?? values.plan));
  const courseObj = COURSES.find((c) => c.id === (enrollment?.course ?? values.course));

  const waUrl = enrollment && courseObj && planObj
    ? buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, buildPaymentWhatsAppMessage({
        enrollmentId: enrollment.enrollmentId,
        fullName:     enrollment.fullName,
        whatsapp:     enrollment.whatsapp,
        email:        enrollment.email,
        course:       courseObj.title,
        plan:         planObj.label,
        amount:       planObj.price,
        language:     subTopicLabel ?? undefined,
      }))
    : "#";

  return (
    <section
      id="enroll"
      className="relative py-20 sm:py-28 dot-bg overflow-hidden"
      style={{ background: "var(--bg-base)" }}
      aria-labelledby="enroll-heading"
    >
      <div className="glow-top-right" />
      <div className="shimmer-line absolute top-0 inset-x-0" />

      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6">

        {/* ── FORM ─── */}
        {stage === "form" && (
          <>
            <div className="mb-10">
              <span className="section-label">Get Started</span>
              <h2 id="enroll-heading" className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                Enroll Today
              </h2>
              <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Fill in your details to receive your unique Enrollment ID,
                then complete payment via MoMo or bank.
              </p>
            </div>

            <div className="glass p-5 sm:p-8">
              {errors._general && (
                <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {errors._general}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">

                <DField label="Full Name" required error={errors.fullName}>
                  <input type="text" id="fullName" name="fullName" value={values.fullName}
                    onChange={handleChange} placeholder="Your full name" autoComplete="name"
                    className={`input-base ${errors.fullName ? "input-error" : ""}`} />
                </DField>

                <DField label="WhatsApp Number" required error={errors.whatsapp}>
                  <input type="tel" id="whatsapp" name="whatsapp" value={values.whatsapp}
                    onChange={handleChange} placeholder="+260 97X XXX XXX" autoComplete="tel"
                    className={`input-base ${errors.whatsapp ? "input-error" : ""}`} />
                </DField>

                <DField label="Email Address" required error={errors.email}>
                  <input type="email" id="email" name="email" value={values.email}
                    onChange={handleChange} placeholder="you@example.com" autoComplete="email"
                    className={`input-base ${errors.email ? "input-error" : ""}`} />
                </DField>

                <DField label="Course" required error={errors.course}>
                  <select id="course" name="course" value={values.course}
                    onChange={(e) => { handleChange(e); setSubTopicLabel(null); setSubTopicId(null); }}
                    className={`input-base ${errors.course ? "input-error" : ""}`}>
                    <option value="">Select a course…</option>
                    {COURSES.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </DField>

                {/* Language badge */}
                {subTopicLabel && values.course === "programming" && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)" }}>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--blue)" }}>
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[13px] flex-1" style={{ color: "var(--blue-bright)" }}>
                      Language: <strong>{subTopicLabel}</strong>
                    </span>
                    <button type="button" onClick={() => { setSubTopicLabel(null); setSubTopicId(null); }}
                      className="text-[12px] underline cursor-pointer" style={{ color: "var(--text-muted)" }}>
                      Change
                    </button>
                  </div>
                )}

                <DField label="Subscription Plan" required error={errors.plan}>
                  <select id="plan" name="plan" value={values.plan} onChange={handleChange}
                    className={`input-base ${errors.plan ? "input-error" : ""}`}>
                    <option value="">Select a plan…</option>
                    {PLANS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label} — {formatKwacha(p.price)} · {p.description}
                      </option>
                    ))}
                  </select>
                </DField>

                <DField label="Preferred Learning Mode" required error={errors.learningMode}>
                  <select id="learningMode" name="learningMode" value={values.learningMode}
                    onChange={handleChange}
                    className={`input-base ${errors.learningMode ? "input-error" : ""}`}>
                    <option value="">Select a mode…</option>
                    {LEARNING_MODES.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </DField>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-[15px] font-bold py-4 rounded-2xl transition-all disabled:opacity-50"
                  style={{
                    background:  "var(--blue)",
                    color:       "#fff",
                    boxShadow:   "0 0 24px var(--blue-glow)",
                    border:      "none",
                    touchAction: "manipulation",
                    cursor:      loading ? "wait" : "pointer",
                  }}
                >
                  {loading ? (
                    <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg> Processing…</>
                  ) : <>
                    Complete Enrollment
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ── PAYMENT ── */}
        {stage === "payment" && enrollment && planObj && courseObj && (
          <PaymentStage
            enrollment={enrollment}
            planObj={planObj}
            courseObj={courseObj}
            loading={loading}
            onSubmitPayment={handlePaymentSubmit}
          />
        )}

        {/* ── SUBMITTED ── */}
        {stage === "submitted" && enrollment && (
          <SubmittedStage enrollment={enrollment} waUrl={waUrl} />
        )}
      </div>
    </section>
  );
}

/* ── Field wrapper ───────────────────────────────────────── */
function DField({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[13px] font-semibold" style={{ color: "rgba(241,245,249,0.8)" }}>
        {label}
        {required && <span className="ml-1" style={{ color: "var(--blue)" }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-[12px] text-red-400" role="alert">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Payment stage with method tabs ─────────────────────── */
function PaymentStage({ enrollment, planObj, courseObj, loading, onSubmitPayment }: {
  enrollment: Enrollment;
  planObj: (typeof PLANS)[0];
  courseObj: (typeof COURSES)[0];
  loading: boolean;
  onSubmitPayment: (method: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<PayTab>("momo");

  return (
    <div className="space-y-4">

      {/* Enrollment confirmation card */}
      <div className="glass p-5 text-center">
        <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
          <svg className="w-5 h-5" style={{ color: "#22c55e" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-[16px] font-bold text-white mb-1">Enrollment Confirmed!</h2>
        <p className="text-[12.5px] mb-3" style={{ color: "var(--text-secondary)" }}>
          Save your Enrollment ID — you&apos;ll need it for payment.
        </p>
        <div className="inline-block px-5 py-2.5 rounded-xl mb-4"
          style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.3)" }}>
          <p className="text-[9px] uppercase tracking-[0.18em] font-bold mb-0.5" style={{ color: "var(--text-muted)" }}>
            Enrollment ID
          </p>
          <p className="text-lg font-black font-mono tracking-widest" style={{ color: "var(--cyan)" }}>
            {enrollment.enrollmentId}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-left">
          {[
            { label: "Course",      value: courseObj.title },
            { label: "Plan",        value: `${planObj.label} · K${planObj.price}` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[10px] mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
              <p className="text-[12px] font-semibold text-white truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment method card */}
      <div className="glass p-5">
        <h3 className="font-bold text-white text-[15px] mb-1">Complete Your Payment</h3>
        <p className="text-[12.5px] mb-4" style={{ color: "var(--text-secondary)" }}>
          Send{" "}
          <span className="font-bold" style={{ color: "var(--cyan)" }}>K{planObj.price}</span>
          {" "}using your preferred method, then tap &ldquo;I&apos;ve Paid&rdquo;.
        </p>

        {/* ── Method tabs ── */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("momo")}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer"
            style={{
              background:  activeTab === "momo" ? "rgba(251,191,36,0.2)"  : "rgba(255,255,255,0.04)",
              border:      activeTab === "momo" ? "1.5px solid rgba(251,191,36,0.5)" : "1.5px solid rgba(255,255,255,0.08)",
              color:       activeTab === "momo" ? "#fcd34d" : "rgba(148,163,184,0.8)",
              boxShadow:   activeTab === "momo" ? "0 0 16px rgba(251,191,36,0.15)" : "none",
              touchAction: "manipulation",
            }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <path d="M12 18h.01" />
            </svg>
            MTN MoMo
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bank")}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer"
            style={{
              background:  activeTab === "bank" ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)",
              border:      activeTab === "bank" ? "1.5px solid rgba(14,165,233,0.4)" : "1.5px solid rgba(255,255,255,0.08)",
              color:       activeTab === "bank" ? "var(--blue-bright)" : "rgba(148,163,184,0.8)",
              boxShadow:   activeTab === "bank" ? "0 0 16px rgba(14,165,233,0.15)" : "none",
              touchAction: "manipulation",
            }}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Zanaco Bank
          </button>
        </div>

        {/* ── MTN MoMo details ── */}
        {activeTab === "momo" && (
          <div className="rounded-xl p-4 mb-4"
            style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.3)" }}>
                <svg className="w-4 h-4" style={{ color: "#fcd34d" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <path d="M12 18h.01" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-bold text-white text-[13.5px]">MTN Mobile Money</span>
            </div>
            <dl className="space-y-2">
              <DetailRow label="Send To"    value={PAYMENT_DETAILS.momo.number} highlight />
              <DetailRow label="Name"       value={PAYMENT_DETAILS.momo.name} />
              <DetailRow label="Reference"  value={`Kalulu Vision — Enroll`} />
            </dl>
            <p className="mt-3 text-[11.5px]" style={{ color: "rgba(251,191,36,0.7)" }}>
              Dial *303# → Send Money → Enter number above → Amount: K{planObj.price}
            </p>
          </div>
        )}

        {/* ── Bank Transfer details ── */}
        {activeTab === "bank" && (
          <div className="rounded-xl p-4 mb-4"
            style={{ background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.2)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)" }}>
                <svg className="w-4 h-4" style={{ color: "var(--blue-bright)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span className="font-bold text-white text-[13.5px]">Zanaco Bank Transfer</span>
            </div>
            <dl className="space-y-2">
              <DetailRow label="Bank"         value={PAYMENT_DETAILS.bank.bankName} />
              <DetailRow label="Account Name" value={PAYMENT_DETAILS.bank.accountName} />
              <DetailRow label="Account No."  value={PAYMENT_DETAILS.bank.accountNumber} highlight />
              <DetailRow label="Branch"       value={PAYMENT_DETAILS.bank.branch} />
              <DetailRow label="Amount"       value={`K${planObj.price}`} highlight />
              <DetailRow label="Reference"    value={enrollment.enrollmentId} />
            </dl>
          </div>
        )}

        {/* Warning */}
        <div className="flex gap-2.5 p-3 rounded-xl mb-4"
          style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.18)" }}>
          <span className="text-sm shrink-0">⚠️</span>
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(251,191,36,0.85)" }}>
            After paying, <strong>take a screenshot</strong> of your confirmation and send it to us on WhatsApp for verification.
          </p>
        </div>

        {/* Submit button */}
        <button
          type="button"
          onClick={() => onSubmitPayment(activeTab === "momo" ? "MTN MoMo" : "Zanaco Bank")}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-[15px] font-bold py-4 rounded-2xl transition-all disabled:opacity-50"
          style={{
            background:  "var(--blue)",
            color:       "#fff",
            boxShadow:   "0 0 24px var(--blue-glow)",
            border:      "none",
            touchAction: "manipulation",
            cursor:      loading ? "wait" : "pointer",
          }}
        >
          {loading ? (
            <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg> Processing…</>
          ) : <>
            ✓ I&apos;ve Made Payment
          </>}
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex gap-2 text-[12.5px]">
      <dt className="w-28 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</dt>
      <dd
        className="font-bold font-mono break-all"
        style={{ color: highlight ? "#fff" : "rgba(241,245,249,0.75)" }}
      >
        {value}
      </dd>
    </div>
  );
}

/* ── Submitted stage ─────────────────────────────────────── */
function SubmittedStage({ enrollment, waUrl }: { enrollment: Enrollment; waUrl: string }) {
  return (
    <div className="space-y-4">
      <div className="glass p-8 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)" }}>
          <svg className="w-7 h-7" style={{ color: "#fbbf24" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-[17px] font-bold text-white mb-1">⏳ Awaiting Verification</h2>
        <p className="text-[13px] leading-relaxed max-w-sm mx-auto mb-5" style={{ color: "var(--text-secondary)" }}>
          Payment submitted. Send your screenshot on WhatsApp so we can verify and activate your subscription.
        </p>
        <div className="inline-block px-5 py-2.5 rounded-xl"
          style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.25)" }}>
          <p className="text-[9px] uppercase tracking-[0.18em] font-bold mb-0.5" style={{ color: "var(--text-muted)" }}>
            Enrollment ID
          </p>
          <p className="text-[17px] font-black font-mono tracking-widest" style={{ color: "var(--cyan)" }}>
            {enrollment.enrollmentId}
          </p>
        </div>
      </div>

      <div className="glass p-5">
        <h3 className="font-bold text-white text-[15px] mb-1">Send Screenshot on WhatsApp</h3>
        <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
          Tap the button below to open a pre-filled WhatsApp message, then attach your payment screenshot.
        </p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full font-bold text-[15px] py-4 rounded-2xl transition-all text-white"
          style={{ background: "#25D366", boxShadow: "0 0 20px rgba(37,211,102,0.3)", touchAction: "manipulation" }}
        >
          <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Send Screenshot on WhatsApp
        </a>

        <div className="mt-4 rounded-xl p-4 space-y-2.5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="text-[12px] font-semibold text-white">What happens next?</p>
          {[
            "Send your payment screenshot in the WhatsApp chat.",
            "Our team reviews and verifies your payment.",
            "Subscription activated — we'll confirm via WhatsApp.",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "var(--blue)", color: "#fff" }}>
                {i + 1}
              </span>
              <p className="text-[12.5px]" style={{ color: "var(--text-secondary)" }}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


