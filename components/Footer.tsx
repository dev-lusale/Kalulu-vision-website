"use client";

import Image from "next/image";
import { SITE_CONFIG } from "@/lib/config";
import { buildWhatsAppUrl, buildEnquiryWhatsAppMessage } from "@/lib/utils";

const LINKS = [
  { label: "Courses",  href: "#courses" },
  { label: "Plans",    href: "#plans" },
  { label: "Enroll",   href: "#enroll" },
  { label: "Contact",  href: "#contact" },
];

const WA_SVG = (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function Footer() {
  const waUrl = buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, buildEnquiryWhatsAppMessage());

  return (
    <footer
      className="relative"
      style={{
        background: "var(--bg-deep)",
        borderTop: "1px solid rgba(14,165,233,0.12)",
      }}
    >
      <div className="shimmer-line absolute top-0 inset-x-0" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <div className="rounded-xl overflow-hidden w-fit">
                <Image
                  src="/logo.png"
                  alt="Kalulu Vision"
                  width={140}
                  height={46}
                  className="h-11 w-auto object-contain"
                  style={{ mixBlendMode: "screen" }}
                />
              </div>
            </div>
            <p className="text-[13px] leading-relaxed mb-2" style={{ color: "var(--text-muted)" }}>
              AI &amp; Software Solutions · Technology Education · Innovation
            </p>
            <p className="text-[11.5px] italic" style={{ color: "rgba(71,85,105,0.8)" }}>
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-4" style={{ color: "var(--text-muted)" }}>
              Navigation
            </p>
            <ul className="space-y-2.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[13px] transition-colors duration-150 hover:text-[#38bdf8]"
                    style={{ color: "rgba(148,163,184,0.7)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-4" style={{ color: "var(--text-muted)" }}>
              Contact
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-[13px] transition-colors duration-150 hover:text-[#38bdf8] break-all"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] transition-colors duration-150 hover:text-[#25D366]"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="text-[13px] transition-colors duration-150 hover:text-white"
                  style={{ color: "rgba(148,163,184,0.7)" }}
                >
                  Admin Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-4" style={{ color: "var(--text-muted)" }}>
              Connect
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-[12.5px] px-4 py-2.5 rounded-xl transition-opacity hover:opacity-90 text-white"
              style={{ background: "#25D366", boxShadow: "0 0 14px rgba(37,211,102,0.25)" }}
            >
              {WA_SVG}
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "var(--text-muted)" }}
        >
          <p>© {SITE_CONFIG.year} Kalulu Vision. All rights reserved.</p>
          <p>AI &amp; Software Solutions · Technology Education · Zambia</p>
        </div>
      </div>
    </footer>
  );
}
