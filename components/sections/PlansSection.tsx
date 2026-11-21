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
      className="py-20 sm:py-28"
      aria-labelledby="plans-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header — content frozen */}
        <div className="text-center mb-14">
          <span className="section-label">Pricing</span>
          <h2
            id="plans-heading"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
            style={{ color: "var(--kv-fg)" }}
          >
            Subscription Plans
          </h2>
          <p className="max-w-md mx-auto text-[15px] leading-relaxed" style={{ color: "var(--kv-muted)" }}>
            Choose a plan that fits your schedule. All plans include course
            materials and WhatsApp support.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={[
                "relative flex flex-col p-7 rounded-[20px] transition-all duration-220",
                plan.highlighted
                  ? "kv-card-featured"
                  : "kv-card",
              ].join(" ")}
              style={plan.highlighted ? { transform: "scale(1.03)" } : {}}
            >
              {/* Most Popular badge — label frozen */}
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className="text-[10px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full"
                    style={{ background: "var(--kv-primary)", color: "var(--kv-on-primary)" }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan label — frozen */}
              <p
                className="text-[11px] font-black uppercase tracking-[0.18em] mb-4"
                style={{ color: plan.highlighted ? "var(--kv-brand-ink)" : "var(--kv-muted)" }}
              >
                {plan.label}
              </p>

              {/* Price — frozen */}
              <div className="mb-1">
                <span
                  className="text-5xl font-extrabold tracking-tight"
                  style={{ color: plan.highlighted ? "var(--kv-brand-ink)" : "var(--kv-fg)" }}
                >
                  K{plan.price}
                </span>
              </div>
              <p className="text-[13px] mb-7" style={{ color: plan.highlighted ? "var(--kv-muted)" : "var(--kv-muted)" }}>
                {plan.description}
              </p>

              {/* Features — frozen */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center"
                      style={{
                        background: "var(--kv-accent)",
                        border: "none",
                      }}
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                        style={{ color: "var(--kv-on-primary)" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span
                      className="text-[13px] leading-snug"
                      style={{ color: plan.highlighted ? "var(--kv-muted)" : "var(--kv-muted)" }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA — label "Get Started →" frozen */}
              <button
                type="button"
                onClick={() => onSelectPlan?.(plan.id)}
                className="w-full text-[13.5px] font-bold py-3 rounded-xl transition-all cursor-pointer"
                style={{
                  background:  "var(--kv-primary)",
                  color:       "var(--kv-on-primary)",
                  border:      "none",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                } as React.CSSProperties}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--kv-primary-hover)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--kv-primary)";
                }}
              >
                Get Started →
              </button>
            </div>
          ))}
        </div>

        {/* Footer note — content frozen */}
        <p className="text-center text-xs mt-8" style={{ color: "var(--kv-muted)" }}>
          All prices in Zambian Kwacha (ZMW) · Payment verified manually via WhatsApp
        </p>
      </div>
    </section>
  );
}
