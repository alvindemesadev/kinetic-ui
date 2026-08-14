import { ArrowRight, CheckCircle2, Layers3, Palette, PanelTop, SlidersHorizontal } from "lucide-react";

type FeatureCard = {
  title: string;
  description: string;
  detail: string;
  tone: "orange" | "blue" | "green" | "amber";
  icon: typeof SlidersHorizontal;
  href: string;
};

const featureCards: FeatureCard[] = [
  {
    title: "Tactile controls",
    description: "Buttons, fields, menus, and selections share the same raised and recessed language.",
    detail: "64 primitives",
    tone: "orange",
    icon: SlidersHorizontal,
    href: "#controls",
  },
  {
    title: "Responsive overlays",
    description: "Focused actions stay contextual as modals on desktop and drawers on smaller screens.",
    detail: "Desktop + mobile",
    tone: "blue",
    icon: PanelTop,
    href: "#overlays",
  },
  {
    title: "Theme-ready materials",
    description: "Light and dark surfaces use the same semantic tokens, depth, and contrast rules.",
    detail: "2 material modes",
    tone: "amber",
    icon: Palette,
    href: "#foundation",
  },
  {
    title: "Accessible by default",
    description: "Keyboard behavior, focus management, and meaningful states are part of every composition.",
    detail: "Keyboard first",
    tone: "green",
    icon: Layers3,
    href: "#reference",
  },
];

export function ShowcaseFeatures() {
  return (
    <section className="kit-section features-card-section" id="features" aria-labelledby="features-title">
      <header className="section-heading">
        <span>System capabilities</span>
        <h2 id="features-title">Features cards</h2>
        <p>Reusable building blocks that keep the product experience tactile, clear, and connected.</p>
      </header>
      <div className="features-card-grid">
        {featureCards.map((feature) => {
          const Icon = feature.icon;
          return (
            <article className={`panel feature-card ${feature.tone}`} key={feature.title}>
              <div className="feature-card-topline">
                <span className={`feature-card-icon ${feature.tone}`} aria-hidden="true">
                  <Icon size={19} />
                </span>
                <span className="feature-card-detail">{feature.detail}</span>
              </div>
              <div className="feature-card-copy">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <div className="feature-card-footer">
                <span className="feature-card-ready">
                  <CheckCircle2 size={14} aria-hidden="true" /> Ready to use
                </span>
                <a href={feature.href} aria-label={`Explore ${feature.title}`}>
                  Explore <ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
