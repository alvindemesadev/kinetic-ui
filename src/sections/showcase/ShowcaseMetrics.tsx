import * as React from "react";
import { AlertTriangle, CheckCircle2, Component, Copy, Palette, Type, Zap } from "lucide-react";
import { palette } from "./ShowcaseData";

interface ShowcaseMetricsProps {
  onCopyColor?: (value: string) => void;
}

export function ShowcaseMetrics({ onCopyColor }: ShowcaseMetricsProps) {
  const handleCopyColor = (value: string) => {
    if (onCopyColor) {
      onCopyColor(value);
      return;
    }
    navigator.clipboard?.writeText(value);
  };

  return (
    <>
      <div className="metrics-row">
        <article className="metric-card">
          <span className="metric-icon orange">
            <Component size={18} />
          </span>
          <div>
            <small>Components</small>
            <strong>32</strong>
          </div>
          <span className="trend positive">+8 new</span>
        </article>
        <article className="metric-card">
          <span className="metric-icon blue">
            <Zap size={18} />
          </span>
          <div>
            <small>Interactions</small>
            <strong>18</strong>
          </div>
          <span className="trend">Keyboard ready</span>
        </article>
        <article className="metric-card">
          <span className="metric-icon green">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <small>Theme coverage</small>
            <strong>100%</strong>
          </div>
          <span className="trend positive">Light + dark</span>
        </article>
      </div>

      <section className="kit-section" id="foundation">
        <header className="section-heading">
          <span>01 · Foundation</span>
          <h2>Tokens that define the material</h2>
          <p>
            A warm neutral palette, orange signal color, and dual-font hierarchy designed for compact desktop
            interfaces.
          </p>
        </header>
        <div className="foundation-grid">
          <article className="panel palette-panel">
            <div className="panel-heading">
              <div>
                <h3>Color palette</h3>
                <p>Semantic tokens shared by both themes.</p>
              </div>
              <Palette size={19} />
            </div>
            <div className="swatch-grid">
              {palette.map((color) => (
                <button
                  className="swatch"
                  key={color.name}
                  onClick={() => handleCopyColor(color.value)}
                  aria-label={`Copy ${color.value}`}
                  type="button"
                >
                  <span style={{ background: color.value }} />
                  <strong>{color.name}</strong>
                  <small>{color.value}</small>
                  <Copy size={13} />
                </button>
              ))}
            </div>
          </article>
          <article className="panel type-panel">
            <div className="panel-heading">
              <div>
                <h3>Typography</h3>
                <p>Display character plus readable utility text.</p>
              </div>
              <Type size={19} />
            </div>
            <div className="font-sample display-font">
              <span>DISPLAY · DotGothic16</span>
              <strong>Human Interface</strong>
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789</p>
            </div>
            <div className="font-sample body-font">
              <span>BODY · Geist Sans</span>
              <strong>Clear at every size</strong>
              <p>Interface copy, metadata, tables, and form labels.</p>
            </div>
            <div className="font-note">
              <AlertTriangle size={15} />
              <p>
                <strong>Font used in the first logo recreation:</strong> Arial/Helvetica for normal UI text.
                The LED timer was a custom CSS dot-matrix, not an installed font.
              </p>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
