import { CalendarDays, Edit3, Mail, MapPin, Settings, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

import { InitialsAvatar } from "../../components";

type AccountPageNavigation = (href: "#profile" | "#settings") => void;

export function ShowcaseProfile({ onNavigateToPage }: { onNavigateToPage: AccountPageNavigation }) {
  return (
    <section className="kit-section account-page" id="profile" aria-labelledby="profile-page-title">
      <header className="section-heading">
        <span>Account · Profile</span>
        <h2 id="profile-page-title">Your profile</h2>
        <p>Keep your identity, workspace role, and contact details ready wherever you collaborate.</p>
      </header>

      <div className="account-page-grid">
        <article className="panel account-profile-page-card">
          <div className="cover-strip account-cover-strip" />
          <div className="account-profile-page-body">
            <div className="account-profile-page-heading">
              <InitialsAvatar size="large" name="Alvin de Mesa" />
              <div>
                <span className="account-kicker">Workspace owner</span>
                <h3>Alvin de Mesa</h3>
                <p>Product developer · Building focused Windows utilities with Rust and React.</p>
              </div>
            </div>
            <div className="account-page-actions">
              <button
                className="button button-primary"
                type="button"
                onClick={() => toast.success("Profile editor ready")}
              >
                <Edit3 size={16} /> Edit profile
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => onNavigateToPage("#settings")}
              >
                <Settings size={16} /> Account settings
              </button>
            </div>
            <div className="profile-stats account-profile-stats">
              <span>
                <strong>12</strong>
                <small>Projects</small>
              </span>
              <span>
                <strong>4.8k</strong>
                <small>Followers</small>
              </span>
              <span>
                <strong>86%</strong>
                <small>Complete</small>
              </span>
            </div>
          </div>
        </article>

        <article className="panel account-details-card">
          <div className="panel-heading">
            <div>
              <h3>Personal details</h3>
              <p>Information shown to your workspace teammates.</p>
            </div>
            <UserRound size={19} aria-hidden="true" />
          </div>
          <dl className="account-details-list">
            <div>
              <dt>
                <Mail size={15} /> Email
              </dt>
              <dd>alvin@kinetic.ui</dd>
            </div>
            <div>
              <dt>
                <MapPin size={15} /> Location
              </dt>
              <dd>Manila, Philippines</dd>
            </div>
            <div>
              <dt>
                <CalendarDays size={15} /> Member since
              </dt>
              <dd>August 2024</dd>
            </div>
          </dl>
          <div className="account-security-note">
            <ShieldCheck size={17} aria-hidden="true" />
            <span>
              <strong>Verified workspace identity</strong>
              <small>Your account is protected by the Kinetic workspace.</small>
            </span>
          </div>
        </article>
      </div>

      <div className="component-grid two-column account-secondary-grid">
        <article className="panel account-activity-card">
          <div className="panel-heading">
            <div>
              <h3>Recent activity</h3>
              <p>A quick view of your latest workspace actions.</p>
            </div>
          </div>
          <ul className="account-activity-list">
            <li>
              <span className="activity-dot success" />
              <span>
                <strong>Published a component update</strong>
                <small>Today · 10:42 AM</small>
              </span>
            </li>
            <li>
              <span className="activity-dot" />
              <span>
                <strong>Added a workspace shortcut</strong>
                <small>Yesterday · 4:18 PM</small>
              </span>
            </li>
          </ul>
        </article>
        <article className="panel account-next-card">
          <span className="account-kicker">Keep your workspace current</span>
          <h3>Make your profile yours</h3>
          <p>Update notification preferences, theme behavior, and security controls from settings.</p>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => onNavigateToPage("#settings")}
          >
            Open settings <Settings size={15} />
          </button>
        </article>
      </div>
    </section>
  );
}
