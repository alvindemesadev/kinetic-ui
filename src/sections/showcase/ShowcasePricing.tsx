import { Check, CircleDollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type BillingCycle = "monthly" | "yearly";

type PricingPlan = {
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  detail: string;
  features: string[];
  featured?: boolean;
};

const plans: PricingPlan[] = [
  {
    name: "Starter",
    description: "For small teams shaping their first workspace.",
    monthly: 0,
    yearly: 0,
    detail: "For personal projects",
    features: ["Core tactile primitives", "Light and dark materials", "Community support"],
  },
  {
    name: "Workspace",
    description: "For teams building and shipping together.",
    monthly: 18,
    yearly: 14,
    detail: "Most popular",
    features: ["Everything in Starter", "Shared component references", "Priority team support"],
    featured: true,
  },
  {
    name: "Scale",
    description: "For product groups with multiple workspaces.",
    monthly: 42,
    yearly: 34,
    detail: "For growing organizations",
    features: ["Everything in Workspace", "Advanced access controls", "Dedicated design reviews"],
  },
];

export function ShowcasePricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <section className="kit-section pricing-section" id="pricing" aria-labelledby="pricing-title">
      <header className="section-heading">
        <span>Plans and access</span>
        <h2 id="pricing-title">Pricing that scales with your workspace</h2>
        <p>Start with the essentials, then add the collaboration and support your team needs.</p>
      </header>
      <div className="pricing-toolbar">
        <span className="pricing-toolbar-note">
          <CircleDollarSign size={16} aria-hidden="true" /> Simple plans, tactile value.
        </span>
        <div className="pricing-billing-toggle" role="group" aria-label="Billing cycle">
          <button
            className={billingCycle === "monthly" ? "active" : ""}
            type="button"
            aria-pressed={billingCycle === "monthly"}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </button>
          <button
            className={billingCycle === "yearly" ? "active" : ""}
            type="button"
            aria-pressed={billingCycle === "yearly"}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly <span>Save 20%</span>
          </button>
        </div>
      </div>
      <div className="pricing-card-grid">
        {plans.map((plan) => {
          const price = billingCycle === "yearly" ? plan.yearly : plan.monthly;
          return (
            <article className={`panel pricing-card ${plan.featured ? "is-featured" : ""}`} key={plan.name}>
              <div className="pricing-card-header">
                <div>
                  <span className="pricing-card-eyebrow">{plan.detail}</span>
                  <h3>{plan.name}</h3>
                </div>
                {plan.featured && <span className="pricing-recommended">Recommended</span>}
              </div>
              <p className="pricing-card-description">{plan.description}</p>
              <div className="pricing-price">
                <strong>{price === 0 ? "Free" : `$${price}`}</strong>
                {price !== 0 && <span>/ month</span>}
              </div>
              {billingCycle === "yearly" && price !== 0 && (
                <span className="pricing-billing-note">Billed annually</span>
              )}
              <button
                className={`button ${plan.featured ? "button-primary" : "button-secondary"} full-width`}
                type="button"
                onClick={() => toast.success(`${plan.name} plan selected`)}
              >
                Choose {plan.name}
              </button>
              <ul className="pricing-feature-list">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={15} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
