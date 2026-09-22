"use client";

import { SITE_CONFIG } from "@/lib/config";
import { buildWhatsAppUrl, buildEnquiryWhatsAppMessage } from "@/lib/utils";

const WA_SVG = (cls = "w-4 h-4") => (
  <svg className={`${cls} fill-current`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function ContactSection() {
  const waUrl = buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, buildEnquiryWhatsAppMessage());

  return (
    <section
      id="contact"
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{ background: "var(--bg-base)" }}
      aria-labelledby="contact-heading"
    >
      <div className="glow-bottom-left" />
      <div className="shimmer-line absolute top-0 inset-x-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-label">Get in Touch</span>
          <h2
            id="contact-heading"
            className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4"
          >
            Have Questions?
          </h2>
          <p className="max-w-md mx-auto text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Reach out on WhatsApp or email and our team gets back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* WhatsApp */}
          <div className="glass glass-hover p-6 flex flex-col">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 shrink-0"
              style={{
                background: "rgba(37,211,102,0.12)",
                border: "1px solid rgba(37,211,102,0.25)",
                boxShadow: "0 0 16px rgba(37,211,102,0.1)",
                color: "#25D366",
              }}
            >
              {WA_SVG("w-5 h-5")}
            </div>
            <h3 className="font-bold text-white text-[15px] mb-1.5">WhatsApp</h3>
            <p className="text-[13px] leading-relaxed mb-5 flex-1" style={{ color: "var(--text-secondary)" }}>
              Chat directly for the quickest response. We typically reply within minutes.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-[13px] px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90 w-fit text-white"
              style={{ background: "#25D366", boxShadow: "0 0 16px rgba(37,211,102,0.3)" }}
            >
              {WA_SVG("w-4 h-4")}
              Chat on WhatsApp
            </a>
          </div>

          {/* Email */}
          <div className="glass glass-hover p-6 flex flex-col">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 shrink-0"
              style={{
                background: "rgba(14,165,233,0.1)",
                border: "1px solid rgba(14,165,233,0.25)",
                boxShadow: "0 0 16px rgba(14,165,233,0.1)",
                color: "var(--blue-bright)",
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-[15px] mb-1.5">Email</h3>
            <p className="text-[13px] leading-relaxed mb-5 flex-1" style={{ color: "var(--text-secondary)" }}>
              Send a detailed enquiry and we&apos;ll respond within 24 hours.
            </p>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="inline-flex items-center gap-2 font-semibold text-[13px] px-5 py-2.5 rounded-xl transition-all hover:opacity-90 w-fit"
              style={{
                background: "rgba(14,165,233,0.12)",
                border: "1px solid rgba(14,165,233,0.3)",
                color: "var(--blue-bright)",
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Email
            </a>
          </div>

          {/* Enroll CTA */}
          <div
            className="relative p-6 flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(7,11,20,0.8) 100%)",
              border: "1px solid rgba(14,165,233,0.35)",
              boxShadow: "0 0 30px rgba(14,165,233,0.1)",
            }}
          >
            {/* Corner glow */}
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)" }}
            />
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 shrink-0 relative"
              style={{ background: "rgba(14,165,233,0.2)", border: "1px solid rgba(14,165,233,0.3)", color: "var(--cyan)" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-white text-[15px] mb-1.5 relative">Ready to start?</h3>
            <p className="text-[13px] leading-relaxed mb-5 flex-1 relative" style={{ color: "rgba(241,245,249,0.65)" }}>
              Join Kalulu Vision and build practical tech skills that open real career opportunities.
            </p>
            <a href="#enroll" className="btn-glow relative w-fit text-[13px] px-5 py-2.5">
              Enroll Now
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
