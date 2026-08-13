import { AlertTriangle, Check, LoaderCircle, Plus, Trash2 } from "lucide-react";

import { LoadingButton } from "./LoadingButton";

export type ButtonStateShowcaseProps = {
  onRunDemo?: () => unknown | Promise<unknown>;
};

export function ButtonStateShowcase({ onRunDemo }: ButtonStateShowcaseProps) {
  return (
    <article className="panel button-state-panel" aria-labelledby="button-state-title">
      <div className="panel-heading">
        <div>
          <h3 id="button-state-title">Button state system</h3>
          <p>Visual, interaction, async, validation, and availability states.</p>
        </div>
        <LoadingButton className="button button-primary compact" loadingText="Running" onAction={onRunDemo}>
          Run live state
        </LoadingButton>
      </div>

      <div className="button-state-grid">
        <div className="button-state-cell">
          <span>Default</span>
          <button className="button-state-sample" type="button">
            <Plus size={15} /> Create
          </button>
        </div>
        <div className="button-state-cell">
          <span>Hover</span>
          <button className="button-state-sample is-hover" type="button">
            <Plus size={15} /> Create
          </button>
        </div>
        <div className="button-state-cell">
          <span>Focus</span>
          <button className="button-state-sample is-focus" type="button">
            <Plus size={15} /> Create
          </button>
        </div>
        <div className="button-state-cell">
          <span>Pressed</span>
          <button className="button-state-sample is-pressed" type="button" aria-pressed="true">
            <Plus size={15} /> Create
          </button>
        </div>
        <div className="button-state-cell">
          <span>Loading</span>
          <button className="button-state-sample is-loading" type="button" disabled aria-busy="true">
            <LoaderCircle className="loading-button-spinner" size={15} /> Creating
          </button>
        </div>
        <div className="button-state-cell">
          <span>Success</span>
          <button className="button-state-sample is-success" type="button">
            <Check size={15} /> Created
          </button>
        </div>
        <div className="button-state-cell">
          <span>Error</span>
          <button className="button-state-sample is-error" type="button" aria-invalid="true">
            <AlertTriangle size={15} /> Try again
          </button>
        </div>
        <div className="button-state-cell">
          <span>Destructive</span>
          <button className="button-state-sample is-destructive" type="button">
            <Trash2 size={15} /> Delete
          </button>
        </div>
        <div className="button-state-cell">
          <span>Disabled</span>
          <button className="button-state-sample" type="button" disabled>
            <Plus size={15} /> Create
          </button>
        </div>
      </div>
    </article>
  );
}
