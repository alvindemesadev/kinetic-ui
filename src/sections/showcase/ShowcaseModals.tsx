import * as React from "react";
import {
  Sparkles,
  Component,
  Palette,
  Download,
  X,
  Search,
  Sun,
  Moon,
  Plus,
  ChevronRight,
  Command,
} from "lucide-react";
import { LoadingButton } from "@/components";
import { toast } from "sonner";
import { waitForDemo } from "../demoUtils";
import { navigation } from "../navigationData";

interface ShowcaseModalsProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  modalDialogRef: React.RefObject<HTMLElement | null>;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  commandDialogRef: React.RefObject<HTMLElement | null>;
  theme: "light" | "dark";
  chooseTheme: (theme: "light" | "dark") => void;
}

export function ShowcaseModals({
  modalOpen,
  setModalOpen,
  modalDialogRef,
  commandOpen,
  setCommandOpen,
  commandDialogRef,
  theme,
  chooseTheme,
}: ShowcaseModalsProps) {
  return (
    <>
      {modalOpen && (
        <div
          className="modal-layer"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setModalOpen(false)}
        >
          <section
            ref={modalDialogRef}
            className="dialog-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            tabIndex={-1}
          >
            <span className="drawer-handle" />
            <div className="dialog-icon">
              <Sparkles size={22} />
            </div>
            <div className="dialog-copy">
              <span className="eyebrow">New component set</span>
              <h2 id="dialog-title">Save this design system?</h2>
              <p>This will add the current tokens, components, and themes to your React workspace.</p>
            </div>
            <div className="dialog-summary">
              <span>
                <Component size={17} />
                <strong>64 components</strong>
                <small>Ready to install</small>
              </span>
              <span>
                <Palette size={17} />
                <strong>2 themes</strong>
                <small>Light and dark</small>
              </span>
            </div>
            <div className="dialog-actions">
              <button className="button button-secondary" onClick={() => setModalOpen(false)} type="button">
                Cancel
              </button>
              <LoadingButton
                className="button button-primary"
                loadingText="Saving"
                onAction={async () => {
                  await waitForDemo();
                  setModalOpen(false);
                  toast.success("Template saved");
                }}
              >
                <Download size={16} /> Save template
              </LoadingButton>
            </div>
            <button
              className="icon-button dialog-close"
              aria-label="Close dialog"
              onClick={() => setModalOpen(false)}
              type="button"
            >
              <X size={18} />
            </button>
          </section>
        </div>
      )}

      {commandOpen && (
        <div
          className="command-layer"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setCommandOpen(false)}
        >
          <section
            ref={commandDialogRef}
            className="command-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            tabIndex={-1}
          >
            <div className="command-search">
              <Search size={18} />
              <input placeholder="Type a command or search..." />
              <kbd>ESC</kbd>
            </div>
            <div className="command-results">
              <span className="command-label">Quick actions</span>
              <button onClick={() => chooseTheme(theme === "dark" ? "light" : "dark")} type="button">
                <span className="command-icon">
                  {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                </span>
                <span>
                  <strong>Switch to {theme === "dark" ? "light" : "dark"} mode</strong>
                  <small>Change the full component theme</small>
                </span>
                <kbd>T</kbd>
              </button>
              <button
                onClick={() => {
                  setCommandOpen(false);
                  setModalOpen(true);
                }}
                type="button"
              >
                <span className="command-icon">
                  <Plus size={17} />
                </span>
                <span>
                  <strong>Create component</strong>
                  <small>Open the responsive modal</small>
                </span>
                <kbd>N</kbd>
              </button>
              <LoadingButton
                loadingText="Exporting tokens"
                onAction={async () => {
                  await waitForDemo();
                  setCommandOpen(false);
                  toast.success("Design tokens exported");
                }}
              >
                <span className="command-icon">
                  <Download size={17} />
                </span>
                <span>
                  <strong>Export design tokens</strong>
                  <small>Copy colors and variables</small>
                </span>
                <kbd>E</kbd>
              </LoadingButton>
              <span className="command-label">Navigate</span>
              {navigation.slice(1, 5).map((item) => {
                const Icon = item.icon;
                return (
                  <a href={item.href} key={item.label} onClick={() => setCommandOpen(false)}>
                    <span className="command-icon">
                      <Icon size={17} />
                    </span>
                    <span>
                      <strong>{item.label}</strong>
                      <small>Go to section</small>
                    </span>
                    <ChevronRight size={16} />
                  </a>
                );
              })}
            </div>
            <footer>
              <span>
                <Command size={13} /> Kinetic command
              </span>
              <span>
                <kbd>↑↓</kbd> Navigate <kbd>↵</kbd> Select
              </span>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
