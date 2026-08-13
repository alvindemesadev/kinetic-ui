import {
  Bell,
  CheckCircle2,
  ChevronRight,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { InitialsAvatar, LoadingButton } from "@/components";
import { waitForDemo } from "./demoUtils";

export type NavbarProps = {
  toggleMainSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
  theme: "dark" | "light";
  chooseTheme: (theme: "dark" | "light") => void;
  navbarNotificationOpen: boolean;
  setNavbarNotificationOpen: (open: boolean | ((current: boolean) => boolean)) => void;
  navbarNotificationCount: number;
  setNavbarNotificationCount: (count: number | ((current: number) => number)) => void;
  profileSignedIn: boolean;
  setProfileSignedIn: (value: boolean) => void;
  navbarProfileOpen: boolean;
  setNavbarProfileOpen: (open: boolean | ((current: boolean) => boolean)) => void;
};

export function Navbar({
  toggleMainSidebar,
  setCommandOpen,
  theme,
  chooseTheme,
  navbarNotificationOpen,
  setNavbarNotificationOpen,
  navbarNotificationCount,
  setNavbarNotificationCount,
  profileSignedIn,
  setProfileSignedIn,
  navbarProfileOpen,
  setNavbarProfileOpen,
}: NavbarProps) {
  const notificationTriggerRef = useRef<HTMLButtonElement>(null);
  const notificationMenuRef = useRef<HTMLElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navbarNotificationOpen) return;
    const focusFrame = requestAnimationFrame(() =>
      notificationMenuRef.current?.querySelector<HTMLButtonElement>("button")?.focus(),
    );
    return () => cancelAnimationFrame(focusFrame);
  }, [navbarNotificationOpen]);

  useEffect(() => {
    if (!navbarProfileOpen) return;
    const focusFrame = requestAnimationFrame(() =>
      profileMenuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus(),
    );
    return () => cancelAnimationFrame(focusFrame);
  }, [navbarProfileOpen]);

  const closeNotifications = useCallback(() => {
    setNavbarNotificationOpen(false);
    requestAnimationFrame(() => notificationTriggerRef.current?.focus());
  }, [setNavbarNotificationOpen]);

  const closeProfile = useCallback(() => {
    setNavbarProfileOpen(false);
    requestAnimationFrame(() => profileTriggerRef.current?.focus());
  }, [setNavbarProfileOpen]);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="icon-button hamburger"
          type="button"
          aria-label="Toggle sidebar"
          aria-controls="main-sidebar"
          onClick={toggleMainSidebar}
        >
          <Menu size={20} />
        </button>
        <div className="breadcrumbs">
          <span>Design system</span>
          <ChevronRight size={14} />
          <strong>Components</strong>
        </div>
      </div>
      <div className="navbar-search">
        <Search size={16} />
        <button onClick={() => setCommandOpen(true)}>Search components...</button>
        <kbd>Ctrl K</kbd>
      </div>
      <div className="navbar-actions">
        <div className="mode-toggle" role="group" aria-label="Theme">
          <button
            className={theme === "light" ? "active" : ""}
            aria-label="Light mode"
            aria-pressed={theme === "light"}
            onClick={() => chooseTheme("light")}
          >
            <Sun size={15} />
          </button>
          <button
            className={theme === "dark" ? "active" : ""}
            aria-label="Dark mode"
            aria-pressed={theme === "dark"}
            onClick={() => chooseTheme("dark")}
          >
            <Moon size={15} />
          </button>
        </div>
        <div className="navbar-notification-wrap" onClick={(event) => event.stopPropagation()}>
          <button
            ref={notificationTriggerRef}
            className={`icon-button notification-button ${navbarNotificationOpen ? "active" : ""}`}
            type="button"
            aria-label={`${navbarNotificationCount} notifications`}
            aria-haspopup="dialog"
            aria-expanded={navbarNotificationOpen}
            aria-controls="navbar-notifications"
            onClick={() => setNavbarNotificationOpen((open) => !open)}
          >
            <Bell size={18} />
            {navbarNotificationCount > 0 && <i aria-hidden="true" />}
          </button>
          {navbarNotificationOpen && (
            <section
              ref={notificationMenuRef}
              className="navbar-notification-menu"
              id="navbar-notifications"
              role="dialog"
              aria-label="Notifications"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  closeNotifications();
                }
              }}
            >
              <header>
                <div>
                  <strong>Notifications</strong>
                  <small>
                    {navbarNotificationCount > 0
                      ? `${navbarNotificationCount} unread updates`
                      : "You're all caught up"}
                  </small>
                </div>
                {navbarNotificationCount > 0 && (
                  <button type="button" onClick={() => setNavbarNotificationCount(0)}>
                    Mark all read
                  </button>
                )}
              </header>
              <div className="navbar-notification-list">
                <button
                  className={navbarNotificationCount > 0 ? "is-unread" : ""}
                  type="button"
                  onClick={() => {
                    setNavbarNotificationCount(0);
                    closeNotifications();
                    document.querySelector("#components")?.scrollIntoView({ behavior: "smooth" });
                    toast.success("Component review opened");
                  }}
                >
                  <span className="navbar-notification-icon">
                    <CheckCircle2 size={16} />
                  </span>
                  <span>
                    <strong>Component review ready</strong>
                    <small>24 updated primitives are ready to inspect.</small>
                  </span>
                </button>
                <button
                  className={navbarNotificationCount > 1 ? "is-unread" : ""}
                  type="button"
                  onClick={() => {
                    setNavbarNotificationCount(0);
                    closeNotifications();
                    toast.info("Team activity marked as read");
                  }}
                >
                  <span className="navbar-notification-icon">
                    <Users size={16} />
                  </span>
                  <span>
                    <strong>Team activity</strong>
                    <small>Two teammates joined your workspace.</small>
                  </span>
                </button>
              </div>
              <footer>
                <button type="button" onClick={closeNotifications}>
                  Close notifications
                </button>
              </footer>
            </section>
          )}
        </div>
        <div className="navbar-profile-wrap" onClick={(event) => event.stopPropagation()}>
          <button
            ref={profileTriggerRef}
            className={`icon-button navbar-profile-trigger ${navbarProfileOpen ? "active" : ""}`}
            type="button"
            aria-label="Navbar profile menu"
            aria-haspopup="menu"
            aria-expanded={navbarProfileOpen}
            aria-controls="navbar-profile-menu"
            onClick={() => setNavbarProfileOpen((open) => !open)}
          >
            <InitialsAvatar size="small" name={profileSignedIn ? "Alvin de Mesa" : "Guest"} />
          </button>
          {navbarProfileOpen && (
            <div
              ref={profileMenuRef}
              className="navbar-profile-card"
              id="navbar-profile-menu"
              role="menu"
              aria-label="Navbar profile"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  closeProfile();
                }
              }}
            >
              <div className="profile-card-identity">
                <InitialsAvatar name={profileSignedIn ? "Alvin de Mesa" : "Guest"} />
                <span>
                  <strong>{profileSignedIn ? "Alvin de Mesa" : "Signed out"}</strong>
                  <small>{profileSignedIn ? "alvin@kinetic.ui" : "Guest mode"}</small>
                </span>
              </div>
              <div className="profile-card-divider" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  closeProfile();
                  toast("Profile", { description: "Alvin de Mesa · Product developer" });
                }}
              >
                <User size={15} />
                Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  closeProfile();
                  document.querySelector("#controls")?.scrollIntoView({ behavior: "smooth" });
                  toast("Settings opened");
                }}
              >
                <Settings size={15} />
                Settings
              </button>
              <div className="profile-card-divider" />
              <LoadingButton
                className="logout"
                type="button"
                role="menuitem"
                loadingText="Logging out"
                onAction={async () => {
                  await waitForDemo();
                  closeProfile();
                  setProfileSignedIn(false);
                  toast.success("Logged out of the preview");
                }}
              >
                <LogOut size={15} />
                Log out
              </LoadingButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
