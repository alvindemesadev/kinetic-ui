import { ChevronLeft, Component, Eye } from "lucide-react";

export type HeroProps = {
  setModalOpen: (open: boolean) => void;
};

export function Hero({ setModalOpen }: HeroProps) {
  return (
    <section className="hero" id="overview">
      <div className="hero-copy">
        <span className="eyebrow">
          <Component size={14} /> Skeuomorphic React template
        </span>
        <h1>
          <span className="hero-title-lead">Interfaces</span> with
          <br />
          <em>physical presence.</em>
        </h1>
        <p>
          A practical component system for your Windows apps: tactile controls, restrained depth, responsive
          behavior, and matching dark and light materials.
        </p>
        <div className="hero-actions">
          <button
            className="button button-primary"
            onClick={() => document.querySelector("#foundation")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Component size={17} /> Explore components
          </button>
          <button className="button button-secondary" onClick={() => setModalOpen(true)}>
            <Eye size={17} /> Open modal
          </button>
        </div>
      </div>
      <div className="hero-device" aria-label="Skeuomorphic control preview">
        <span className="hero-device-shine" />
        <button className="device-button" aria-label="Previous">
          <ChevronLeft size={24} />
        </button>
        <div className="device-display">
          <span className="display-pulse" />
          <div>
            <small>ACTIVE SESSION</small>
            <strong>00:22:22</strong>
          </div>
          <span className="orange-line" />
        </div>
      </div>
    </section>
  );
}
