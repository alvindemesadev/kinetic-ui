import { useRef, useState } from "react";
import {
  Check,
  CircleAlert,
  Eye,
  KeyRound,
  Mail,
  Pencil,
  Plus,
  Settings2,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LoadingButton, InitialsAvatar } from "@/components";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { toast } from "sonner";
import { waitForDemo } from "../demoUtils";

type OverlayKind = "view" | "edit" | "add" | "confirm" | "delete" | "delete-password" | "invite" | "settings";

type OverlayItem = {
  kind: OverlayKind;
  label: string;
  description: string;
  icon: LucideIcon;
  tone?: "danger";
};

const overlayItems: OverlayItem[] = [
  { kind: "view", label: "View", description: "Read-only module details.", icon: Eye },
  { kind: "edit", label: "Edit", description: "Update a module without leaving the page.", icon: Pencil },
  { kind: "add", label: "Add", description: "Create a new interface module.", icon: Plus },
  { kind: "confirm", label: "Confirm", description: "Ask before publishing a change.", icon: Check },
  {
    kind: "delete",
    label: "Delete",
    description: "Confirm a destructive action.",
    icon: Trash2,
    tone: "danger",
  },
  {
    kind: "delete-password",
    label: "Delete + password",
    description: "Require a second verification step.",
    icon: KeyRound,
    tone: "danger",
  },
  { kind: "invite", label: "Invite", description: "Send a teammate an access link.", icon: UserPlus },
  {
    kind: "settings",
    label: "Settings",
    description: "Adjust workspace preferences in place.",
    icon: Settings2,
  },
];

export function ShowcaseOverlayGallery() {
  const [openOverlay, setOpenOverlay] = useState<OverlayKind | null>(null);
  const [moduleName, setModuleName] = useState("Control Surface");
  const [description, setDescription] = useState("Primary interface module for the workspace.");
  const [inviteEmail, setInviteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const overlayRef = useRef<HTMLElement>(null);

  useFocusTrap(overlayRef, openOverlay !== null);

  const closeOverlay = () => {
    setOpenOverlay(null);
    setDeletePassword("");
  };

  const finishAction = async (message: string) => {
    await waitForDemo();
    closeOverlay();
    toast.success(message);
  };

  const currentItem = overlayItems.find((item) => item.kind === openOverlay);
  const title = currentItem?.label ?? "Overlay";
  const titleId = "showcase-overlay-title";

  return (
    <>
      <div className="overlay-gallery" aria-label="Responsive modal and drawer examples">
        <div className="overlay-gallery-intro">
          <span className="overlay-gallery-mode">
            <span className="overlay-gallery-mode-desktop">Desktop modal</span>
            <span className="overlay-gallery-mode-mobile">Mobile drawer</span>
          </span>
          <p>Each action uses the same accessible surface and adapts its placement to the viewport.</p>
        </div>
        <div className="overlay-action-grid">
          {overlayItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className={`overlay-action-card ${item.tone ?? ""}`} key={item.kind}>
                <span className="overlay-action-icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
                </div>
                <button
                  className={`button ${item.tone === "danger" ? "button-danger" : "button-secondary"}`}
                  type="button"
                  onClick={() => setOpenOverlay(item.kind)}
                >
                  Open {item.label.toLowerCase()}
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {openOverlay && currentItem && (
        <div
          className="showcase-overlay-layer"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && closeOverlay()}
        >
          <section
            ref={overlayRef}
            className={`showcase-overlay-card ${currentItem.tone ?? ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeOverlay();
              }
            }}
          >
            <span className="showcase-overlay-handle" aria-hidden="true" />
            <header className="showcase-overlay-header">
              <div>
                <span className="eyebrow">Responsive overlay</span>
                <h2 id={titleId}>{title}</h2>
                <p>{currentItem.description}</p>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label={`Close ${title}`}
                onClick={closeOverlay}
              >
                <X size={18} />
              </button>
            </header>

            <div className="showcase-overlay-body">
              {openOverlay === "view" && (
                <div className="overlay-detail-list">
                  <div className="overlay-detail-owner">
                    <InitialsAvatar size="small" name="Alvin de Mesa" />
                    <span>
                      <strong>Control Surface</strong>
                      <small>Owned by Alvin · Updated today</small>
                    </span>
                  </div>
                  <dl>
                    <div>
                      <dt>Status</dt>
                      <dd>Ready</dd>
                    </div>
                    <div>
                      <dt>Usage</dt>
                      <dd>24 active screens</dd>
                    </div>
                    <div>
                      <dt>Size</dt>
                      <dd>4.8 MB</dd>
                    </div>
                  </dl>
                </div>
              )}

              {openOverlay === "edit" && (
                <form
                  className="showcase-overlay-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void finishAction("Module changes saved");
                  }}
                >
                  <label>
                    Module name
                    <input
                      autoFocus
                      data-autofocus
                      value={moduleName}
                      onChange={(event) => setModuleName(event.target.value)}
                    />
                  </label>
                  <label>
                    Description
                    <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
                  </label>
                </form>
              )}

              {openOverlay === "add" && (
                <form
                  className="showcase-overlay-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void finishAction("Module added");
                  }}
                >
                  <label>
                    Module name
                    <input autoFocus data-autofocus placeholder="e.g. Command Palette" />
                  </label>
                  <label>
                    Description
                    <textarea placeholder="What does this module do?" />
                  </label>
                </form>
              )}

              {openOverlay === "confirm" && (
                <div className="overlay-confirmation-copy">
                  <span className="overlay-confirmation-icon success">
                    <Check size={22} />
                  </span>
                  <p>Publish the current workspace changes for your team?</p>
                  <small>This will update the shared component registry and notify collaborators.</small>
                </div>
              )}

              {openOverlay === "delete" && (
                <div className="overlay-confirmation-copy">
                  <span className="overlay-confirmation-icon danger">
                    <CircleAlert size={22} />
                  </span>
                  <p>Delete Control Surface?</p>
                  <small>This action removes the module from the workspace and cannot be undone.</small>
                </div>
              )}

              {openOverlay === "delete-password" && (
                <div className="showcase-overlay-form">
                  <div className="overlay-confirmation-copy compact">
                    <span className="overlay-confirmation-icon danger">
                      <KeyRound size={22} />
                    </span>
                    <p>Confirm with your password</p>
                    <small>Enter your workspace password to permanently delete this module.</small>
                  </div>
                  <label>
                    Password
                    <input
                      autoFocus
                      data-autofocus
                      type="password"
                      value={deletePassword}
                      onChange={(event) => setDeletePassword(event.target.value)}
                      placeholder="Enter password"
                    />
                  </label>
                  <small className="overlay-password-hint">
                    Demo hint: use <strong>kinetic</strong>.
                  </small>
                </div>
              )}

              {openOverlay === "invite" && (
                <form
                  className="showcase-overlay-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void finishAction("Invitation sent");
                  }}
                >
                  <label>
                    Teammate email
                    <div className="overlay-input-with-icon">
                      <Mail size={16} />
                      <input
                        autoFocus
                        data-autofocus
                        type="email"
                        value={inviteEmail}
                        onChange={(event) => setInviteEmail(event.target.value)}
                        placeholder="name@example.com"
                      />
                    </div>
                  </label>
                  <p className="overlay-form-note">
                    They will receive an editor invite to the current workspace.
                  </p>
                </form>
              )}

              {openOverlay === "settings" && (
                <div className="overlay-settings-list">
                  <label>
                    <span className="overlay-settings-copy">
                      <strong>Sync automatically</strong>
                      <small>Keep component changes synchronized.</small>
                    </span>
                    <span className="overlay-checkbox">
                      <input type="checkbox" defaultChecked />
                      <span className="overlay-checkbox-control" aria-hidden="true" />
                    </span>
                  </label>
                  <label>
                    <span className="overlay-settings-copy">
                      <strong>Show release notes</strong>
                      <small>Surface updates in the notification center.</small>
                    </span>
                    <span className="overlay-checkbox">
                      <input type="checkbox" />
                      <span className="overlay-checkbox-control" aria-hidden="true" />
                    </span>
                  </label>
                </div>
              )}
            </div>

            <footer className="showcase-overlay-footer">
              <button className="button button-secondary" type="button" onClick={closeOverlay}>
                Cancel
              </button>
              {openOverlay === "view" && (
                <button className="button button-primary" type="button" onClick={closeOverlay}>
                  Done
                </button>
              )}
              {openOverlay === "edit" && (
                <LoadingButton
                  className="button button-primary"
                  loadingText="Saving"
                  onAction={async () => finishAction("Module changes saved")}
                >
                  Save changes
                </LoadingButton>
              )}
              {openOverlay === "add" && (
                <LoadingButton
                  className="button button-primary"
                  loadingText="Adding"
                  onAction={async () => finishAction("Module added")}
                >
                  Add module
                </LoadingButton>
              )}
              {openOverlay === "confirm" && (
                <LoadingButton
                  className="button button-primary"
                  loadingText="Publishing"
                  onAction={async () => finishAction("Workspace published")}
                >
                  Publish changes
                </LoadingButton>
              )}
              {openOverlay === "delete" && (
                <LoadingButton
                  className="button button-danger"
                  loadingText="Deleting"
                  onAction={async () => finishAction("Module deleted")}
                >
                  Delete module
                </LoadingButton>
              )}
              {openOverlay === "delete-password" && (
                <LoadingButton
                  className="button button-danger"
                  loadingText="Deleting"
                  disabled={deletePassword !== "kinetic"}
                  onAction={async () => finishAction("Module deleted")}
                >
                  Delete permanently
                </LoadingButton>
              )}
              {openOverlay === "invite" && (
                <LoadingButton
                  className="button button-primary"
                  loadingText="Sending"
                  disabled={!inviteEmail.trim()}
                  onAction={async () => finishAction("Invitation sent")}
                >
                  Send invite
                </LoadingButton>
              )}
              {openOverlay === "settings" && (
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => finishAction("Settings saved")}
                >
                  Save settings
                </button>
              )}
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
