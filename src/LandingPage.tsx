import {
  ArrowRight,
  Check,
  ChevronRight,
  Component,
  Layers3,
  Menu,
  Moon,
  MoveUpRight,
  PanelTop,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { useTheme } from "./hooks/useTheme";

const landingNavItems = [
  { label: "Preview", section: "preview" },
  { label: "System", section: "features" },
  { label: "Workflow", section: "workflow" },
] as const;

type LandingSection = (typeof landingNavItems)[number]["section"];

const features = [
  {
    icon: Component,
    eyebrow: "01 · Foundation",
    title: "Material-led primitives",
    description: "Buttons, fields, menus, and feedback share one tactile surface language.",
  },
  {
    icon: PanelTop,
    eyebrow: "02 · Responsive",
    title: "Overlays that adapt",
    description: "The same focused action becomes a modal on desktop and a drawer on mobile.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "03 · Accessible",
    title: "Ready for real work",
    description: "Keyboard behavior, focus management, and readable states are part of the system.",
  },
];

export default function LandingPage() {
  const { theme, setPreference } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<LandingSection>(() => {
    const hash = window.location.hash.slice(1) as LandingSection;
    return landingNavItems.some((item) => item.section === hash) ? hash : "preview";
  });

  const closeMenu = () => setMenuOpen(false);

  const handleNavigationClick = (event: MouseEvent<HTMLAnchorElement>, section: LandingSection) => {
    closeMenu();
    if (section !== "preview") return;

    event.preventDefault();
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#preview`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const sections = landingNavItems
      .map(({ section }) => document.getElementById(section))
      .filter((section): section is HTMLElement => Boolean(section));
    let frame = 0;

    const syncNavigation = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 260);
        const current = sections.reduce<HTMLElement | null>((closest, section) => {
          const sectionTop = section.offsetTop;
          return sectionTop <= marker && (!closest || sectionTop > closest.offsetTop) ? section : closest;
        }, null);
        const nextSection = (current?.id as LandingSection | undefined) ?? "preview";
        setActiveSection(nextSection);

        const nextHash = `#${nextSection}`;
        if (window.location.hash !== nextHash) {
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}${nextHash}`,
          );
        }
      });
    };

    syncNavigation();
    window.addEventListener("scroll", syncNavigation, { passive: true });
    window.addEventListener("resize", syncNavigation);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", syncNavigation);
      window.removeEventListener("resize", syncNavigation);
    };
  }, []);

  return (
    <div className="landing-page">
      <header className="landing-navbar">
        <a className="landing-brand" href="/landing" aria-label="Kinetic UI home" onClick={closeMenu}>
          <span className="landing-brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>
            <strong>Kinetic UI</strong>
            <small>React interface system</small>
          </span>
        </a>

        <button
          className="landing-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="landing-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={`landing-navigation ${menuOpen ? "is-open" : ""}`} id="landing-navigation">
          {landingNavItems.map(({ label, section }) => (
            <a
              className={activeSection === section ? "is-active" : undefined}
              href={`#${section}`}
              key={section}
              aria-current={activeSection === section ? "location" : undefined}
              onClick={(event) => handleNavigationClick(event, section)}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="landing-navbar-actions">
          <button
            className="landing-theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            onClick={() => setPreference(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a className="landing-nav-cta" href="/">
            Open template <MoveUpRight size={15} />
          </a>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="preview">
          <div className="landing-hero-copy">
            <span className="landing-eyebrow">Skeuomorphic React template</span>
            <h1>
              Interfaces with
              <em>physical presence.</em>
            </h1>
            <p>
              A practical component system for Windows apps: tactile controls, restrained depth, responsive
              behavior, and a visual language your team can actually reuse.
            </p>
            <div className="landing-hero-actions">
              <a className="landing-button landing-button-primary" href="/">
                Explore the template <ArrowRight size={17} />
              </a>
              <a className="landing-button landing-button-secondary" href="#features">
                See what&apos;s inside
              </a>
            </div>
            <div className="landing-proof" aria-label="System highlights">
              <span>
                <Check size={14} aria-hidden="true" /> 64 reusable components
              </span>
              <span>
                <Check size={14} aria-hidden="true" /> Light and dark materials
              </span>
            </div>
          </div>

          <div className="landing-device" aria-label="Kinetic UI workspace preview">
            <div className="landing-device-topbar">
              <span className="landing-device-lights" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>Workspace pulse</span>
              <span className="landing-device-status">LIVE</span>
            </div>
            <div className="landing-device-screen">
              <div className="landing-device-heading">
                <div>
                  <small>ACTIVE SESSION</small>
                  <strong>00:22:22</strong>
                </div>
                <span className="landing-device-signal" />
              </div>
              <div className="landing-device-metrics">
                <div>
                  <small>Active projects</small>
                  <strong>24</strong>
                  <span>+12.4%</span>
                </div>
                <div>
                  <small>Components shipped</small>
                  <strong>64</strong>
                  <span>+8 this week</span>
                </div>
                <div>
                  <small>Team velocity</small>
                  <strong>86%</strong>
                  <span>On track</span>
                </div>
              </div>
              <div className="landing-device-progress">
                <span />
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section landing-features" id="features">
          <div className="landing-section-heading">
            <span className="landing-eyebrow">One system, many surfaces</span>
            <h2>
              <span className="landing-heading-line">Designed to feel consistent</span>{" "}
              <span className="landing-heading-line landing-heading-line-offset">in every state.</span>
            </h2>
            <p>
              From the first button press to the final confirmation, every interaction keeps its material
              logic.
            </p>
          </div>
          <div className="landing-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className="landing-feature-card" key={feature.title}>
                  <span className="landing-feature-icon">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="landing-feature-eyebrow">{feature.eyebrow}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <a href="/" aria-label={`Explore ${feature.title}`}>
                    Explore <ChevronRight size={15} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-section landing-workflow" id="workflow">
          <div className="landing-workflow-copy">
            <span className="landing-eyebrow">A calmer build loop</span>
            <h2>
              <span className="landing-heading-line">Move from idea to</span>{" "}
              <span className="landing-heading-line landing-heading-line-offset">interface without</span>{" "}
              <span className="landing-heading-line">changing languages.</span>
            </h2>
            <p>
              Start with a surface, compose a state, and keep the same spacing, type, and feedback rules all
              the way through production.
            </p>
            <a className="landing-inline-link" href="/">
              Browse the component sections <ArrowRight size={16} />
            </a>
          </div>
          <div className="landing-workflow-steps">
            <div className="landing-step is-complete">
              <span>01</span>
              <div>
                <strong>Compose</strong>
                <small>Pick a tactile primitive.</small>
              </div>
              <Check size={16} aria-hidden="true" />
            </div>
            <div className="landing-step is-active">
              <span>02</span>
              <div>
                <strong>Connect</strong>
                <small>Give the state a clear response.</small>
              </div>
              <Layers3 size={16} aria-hidden="true" />
            </div>
            <div className="landing-step">
              <span>03</span>
              <div>
                <strong>Ship</strong>
                <small>Keep the behavior accessible.</small>
              </div>
              <ArrowRight size={16} aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="landing-cta-card">
          <div>
            <span className="landing-eyebrow">Ready when you are</span>
            <h2>Give your next interface some weight.</h2>
            <p>Open the full template and start building with the same physical rules.</p>
          </div>
          <a className="landing-button landing-button-primary" href="/">
            Open Kinetic UI <ArrowRight size={17} />
          </a>
        </section>
      </main>

      <footer className="landing-footer">
        <span>© 2026 Kinetic UI</span>
        <span>Built for focused desktop interfaces.</span>
        <a href="/">Enter the template</a>
      </footer>
    </div>
  );
}
