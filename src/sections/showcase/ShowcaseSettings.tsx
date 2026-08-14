import { Bell, KeyRound, LockKeyhole, Save, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { InitialsAvatar, StyleDropdown, SwitchControl, type ThemePreference } from "../../components";

type AccountPageNavigation = (href: "#profile" | "#settings") => void;

export function ShowcaseSettings({
  selectedStyle,
  onStyleChange,
  onNavigateToPage,
}: {
  selectedStyle: ThemePreference;
  onStyleChange: (value: ThemePreference) => void;
  onNavigateToPage: AccountPageNavigation;
}) {
  const [styleOpen, setStyleOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <section
      className="kit-section account-page settings-page"
      id="settings"
      aria-labelledby="settings-page-title"
    >
      <header className="section-heading">
        <span>Account · Settings</span>
        <h2 id="settings-page-title">Workspace settings</h2>
        <p>
          Adjust your preferences in place while keeping the same tactile controls as the rest of the
          template.
        </p>
      </header>

      <div className="settings-page-grid">
        <article className="panel settings-preferences-card">
          <div className="panel-heading">
            <div>
              <h3>Preferences</h3>
              <p>Choose how Kinetic behaves for you.</p>
            </div>
            <Bell size={19} aria-hidden="true" />
          </div>
          <div className="settings-list">
            <div className="settings-row">
              <span>
                <strong>Notifications</strong>
                <small>Desktop alerts and sounds.</small>
              </span>
              <SwitchControl checked={notifications} onChange={setNotifications} label="Notifications" />
            </div>
            <div className="settings-row">
              <span>
                <strong>Weekly digest</strong>
                <small>Receive a summary of workspace activity.</small>
              </span>
              <SwitchControl checked={weeklyDigest} onChange={setWeeklyDigest} label="Weekly digest" />
            </div>
            <div className="settings-row settings-style-row">
              <span>
                <strong>Interface style</strong>
                <small>Follow a fixed theme or your device preference.</small>
              </span>
              <StyleDropdown
                value={selectedStyle}
                onChange={onStyleChange}
                isOpen={styleOpen}
                onToggle={() => setStyleOpen((open) => !open)}
                onClose={() => setStyleOpen(false)}
              />
            </div>
          </div>
        </article>

        <article className="panel settings-account-card">
          <div className="panel-heading">
            <div>
              <h3>Account access</h3>
              <p>Keep your identity and security details current.</p>
            </div>
            <ShieldCheck size={19} aria-hidden="true" />
          </div>
          <div className="settings-account-summary">
            <InitialsAvatar size="small" name="Alvin de Mesa" />
            <span>
              <strong>Alvin de Mesa</strong>
              <small>alvin@kinetic.ui</small>
            </span>
            <button
              className="button button-ghost"
              type="button"
              onClick={() => onNavigateToPage("#profile")}
            >
              View profile
            </button>
          </div>
          <div className="settings-action-list">
            <button type="button" onClick={() => toast.success("Password change flow opened")}>
              <KeyRound size={16} />
              <span>
                <strong>Change password</strong>
                <small>Use a unique password for your workspace.</small>
              </span>
            </button>
            <button type="button" onClick={() => toast.info("Security keys are ready to configure")}>
              <LockKeyhole size={16} />
              <span>
                <strong>Security keys</strong>
                <small>Add a second step to protect your account.</small>
              </span>
            </button>
          </div>
        </article>
      </div>

      <article className="panel settings-security-card">
        <div className="panel-heading">
          <div>
            <h3>Security and privacy</h3>
            <p>Controls that protect the workspace without getting in your way.</p>
          </div>
          <UserRound size={19} aria-hidden="true" />
        </div>
        <div className="settings-security-grid">
          <div className="settings-security-row">
            <span>
              <strong>Two-step verification</strong>
              <small>Require a code when signing in from a new device.</small>
            </span>
            <SwitchControl checked={twoFactor} onChange={setTwoFactor} label="Two-step verification" />
          </div>
          <div className="settings-security-row">
            <span>
              <strong>Session timeout</strong>
              <small>Sign out after 30 minutes of inactivity.</small>
            </span>
            <span className="settings-value">30 min</span>
          </div>
        </div>
        <div className="settings-footer-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={() => onNavigateToPage("#profile")}
          >
            Cancel
          </button>
          <button
            className="button button-primary"
            type="button"
            onClick={() => toast.success("Settings saved")}
          >
            <Save size={16} /> Save settings
          </button>
        </div>
      </article>
    </section>
  );
}
