"use client";

import { PLANS } from "@/lib/config";
import type { PlanId } from "@/lib/config";

interface PlansSectionProps {
  onSelectPlan?: (planId: PlanId) => void;
}

export function PlansSection({ onSelectPlan }: PlansSectionProps) {
  return (
    <section
      id="plans"
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{ background: "var(--bg-deep)" }}
      aria-labelledby="plans-heading"
    >
      {/* Glow accents */}
      <div className="glow-bottom-left" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)" }}
      />
      {/* Shimmer top border */}
      <div className="shimmer-line absolute top-0 inset-x-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-label">Pricing</span>
          <h2
            id="plans-heading"
            className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4"
          >
            Subscription Plans
          </h2>
          <p className="max-w-md mx-auto text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Choose a plan that fits your schedule. All plans include course
            materials and WhatsApp support.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="relative flex flex-col p-6 rounded-2xl transition-all duration-300"
              style={
                plan.highlighted
                  ? {
                      background: "linear-gradient(135deg, rgba(14,165,233,0.2) 0%, rgba(7,11,20,0.8) 100%)",
                      border: "1px solid rgba(14,165,233,0.5)",
                      boxShadow: "0 0 40px rgba(14,165,233,0.2), 0 0 80px rgba(14,165,233,0.08)",
                      transform: "scale(1.03)",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full"
                    style={{
                      background: "var(--blue)",
                      color: "#fff",
                      boxShadow: "0 0 16px rgba(14,165,233,0.6)",
                    }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name */}
              <p
                className="text-[10.5px] font-black uppercase tracking-[0.18em] mb-4"
                style={{ color: plan.highlighted ? "var(--cyan)" : "var(--text-muted)" }}
              >
                {plan.label}
              </p>

              {/* Price */}
              <div className="mb-1">
                <span
                  className="text-5xl font-black tracking-tight"
                  style={{ color: plan.highlighted ? "var(--cyan)" : "#fff" }}
                >
                  K{plan.price}
                </span>
              </div>
              <p className="text-[13px] mb-7" style={{ color: "var(--text-secondary)" }}>
                {plan.description}
              </p>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                      style={{
                        background: plan.highlighted
                          ? "var(--blue)"
                          : "rgba(14,165,233,0.15)",
                        boxShadow: plan.highlighted ? "0 0 8px rgba(14,165,233,0.6)" : "none",
                      }}
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        style={{ color: plan.highlighted ? "#fff" : "var(--blue)" }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[13px] leading-snug" style={{ color: "rgba(241,245,249,0.75)" }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                type="button"
                onClick={() => onSelectPlan?.(plan.id)}
                className="w-full text-[13.5px] font-bold py-3 rounded-xl transition-all cursor-pointer"
                style={
                  plan.highlighted
                    ? {
                        background: "var(--blue)",
                        color: "#fff",
                        boxShadow: "0 0 20px rgba(14,165,233,0.4)",
                      }
                    : {
                        background: "rgba(14,165,233,0.1)",
                        border: "1px solid rgba(14,165,233,0.25)",
                        color: "var(--blue-bright)",
                      }
                }
                onMouseEnter={(e) => {
                  if (!plan.highlighted) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(14,165,233,0.2)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(14,165,233,0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.highlighted) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(14,165,233,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }
                }}
              >
                Get Started →
              </button>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs mt-8" style={{ color: "var(--text-muted)" }}>
          All prices in Zambian Kwacha (ZMW) · Payment verified manually via WhatsApp
        </p>
      </div>

      {/* Bottom shimmer line */}
      <div className="shimmer-line absolute bottom-0 inset-x-0" />
    </section>
  );
}
