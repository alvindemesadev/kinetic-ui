import { Archive, CircleHelp, LogOut, MoreHorizontal, Settings, User, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { InitialsAvatar, LoadingButton } from "@/components";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { navigation } from "./navigationData";
import { waitForDemo } from "./demoUtils";

export type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  profileSignedIn: boolean;
  setProfileSignedIn: (value: boolean) => void;
  profileMenuOpen: boolean;
  setProfileMenuOpen: (open: boolean | ((current: boolean) => boolean)) => void;
};

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  profileSignedIn,
  setProfileSignedIn,
  profileMenuOpen,
  setProfileMenuOpen,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useFocusTrap(sidebarRef, sidebarOpen);

  useEffect(() => {
    if (!profileMenuOpen || !profileSignedIn) return;
    const focusFrame = requestAnimationFrame(() =>
      profileMenuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus(),
    );
    return () => cancelAnimationFrame(focusFrame);
  }, [profileMenuOpen, profileSignedIn]);

  const closeProfileMenu = useCallback(
    (restoreFocus = true) => {
      setProfileMenuOpen(false);
      if (restoreFocus) requestAnimationFrame(() => profileTriggerRef.current?.focus());
    },
    [setProfileMenuOpen],
  );

  return (
    <aside ref={sidebarRef} className={`sidebar ${sidebarOpen ? "is-open" : ""}`} id="main-sidebar">
      <div className="brand-lockup">
        <span className="brand-mark">
          <span />
        </span>
        <span>
          <strong>Kinetic UI</strong>
          <small>React system · 1.0</small>
        </span>
        <button
          className="icon-button sidebar-close"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={18} />
        </button>
      </div>
      <nav className="sidebar-nav" aria-label="Component sections">
        <span className="nav-label">Library</span>
        {navigation.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              className={index === 0 ? "active" : ""}
              href={item.href}
              key={item.label}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={17} />
              <span>{item.label}</span>
              {index === 2 && <span className="nav-count">64</span>}
            </a>
          );
        })}
        <span className="nav-label nav-label-secondary">Workspace</span>
        <a href="#components">
          <Archive size={17} />
          <span>Resources</span>
        </a>
        <a href="#states">
          <CircleHelp size={17} />
          <span>Documentation</span>
        </a>
      </nav>
      <div className="sidebar-profile" onClick={(event) => event.stopPropagation()}>
        <InitialsAvatar
          label={profileSignedIn ? "AD" : "?"}
          name={profileSignedIn ? "Alvin de Mesa" : "Guest"}
        />
        <span>
          <strong>{profileSignedIn ? "Alvin de Mesa" : "Signed out"}</strong>
          <small>{profileSignedIn ? "Product developer" : "Guest mode"}</small>
        </span>
        <button
          ref={profileTriggerRef}
          className="icon-button"
          type="button"
          aria-label={profileSignedIn ? "Profile menu" : "Sign in"}
          aria-haspopup={profileSignedIn ? "menu" : undefined}
          aria-expanded={profileSignedIn ? profileMenuOpen : undefined}
          aria-controls={profileSignedIn ? "sidebar-profile-menu" : undefined}
          onClick={() => {
            if (!profileSignedIn) {
              setProfileSignedIn(true);
              toast.success("Signed back in");
              return;
            }
            setProfileMenuOpen((open) => !open);
          }}
        >
          {profileSignedIn ? <MoreHorizontal size={18} /> : <User size={17} />}
        </button>
        {profileMenuOpen && profileSignedIn && (
          <div
            ref={profileMenuRef}
            className="sidebar-profile-card"
            id="sidebar-profile-menu"
            role="menu"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeProfileMenu();
              }
            }}
          >
            <div className="profile-card-identity">
              <InitialsAvatar name="Alvin de Mesa" />
              <span>
                <strong>Alvin de Mesa</strong>
                <small>alvin@kinetic.ui</small>
              </span>
            </div>
            <div className="profile-card-divider" />
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                closeProfileMenu();
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
                closeProfileMenu(!window.matchMedia("(max-width: 980px)").matches);
                setSidebarOpen(false);
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
                closeProfileMenu();
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
    </aside>
  );
}
