import * as React from "react";
import { AlertTriangle, Copy, Palette, Type } from "lucide-react";
import { toast } from "sonner";
import { palette } from "./ShowcaseData";

interface ShowcaseFoundationProps {
  onCopyColor?: (value: string) => void | Promise<void>;
}

export function ShowcaseFoundation({ onCopyColor }: ShowcaseFoundationProps) {
  const handleCopyColor = async (value: string) => {
    try {
      if (onCopyColor) {
        await onCopyColor(value);
      } else {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(value);
      }
      toast.success("Color copied", { description: `${value} is ready to paste.` });
    } catch {
      toast.error("Unable to copy color", { description: "Copy the value manually instead." });
    }
  };

  return (
    <>
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
                  onClick={() => void handleCopyColor(color.value)}
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
            <div className="palette-summary">
              <span>Semantic token set</span>
              <p>Click any swatch to copy its value. The same roles drive both light and dark materials.</p>
              <div>
                <strong>{palette.length} tokens</strong>
                <small>Ready to copy</small>
              </div>
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
