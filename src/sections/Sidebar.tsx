import { LogOut, Menu, Settings, User, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { InitialsAvatar, LoadingButton } from "@/components";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { navigation } from "./navigationData";
import { waitForDemo } from "./demoUtils";

export type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  toggleMainSidebar: () => void;
  profileSignedIn: boolean;
  setProfileSignedIn: (value: boolean) => void;
  profileMenuOpen: boolean;
  setProfileMenuOpen: (open: boolean | ((current: boolean) => boolean)) => void;
};

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  toggleMainSidebar,
  profileSignedIn,
  setProfileSignedIn,
  profileMenuOpen,
  setProfileMenuOpen,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const sidebarToggleRef = useRef<HTMLButtonElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [sidebarTooltip, setSidebarTooltip] = useState<{ label: string; top: number } | null>(null);
  const getActiveHref = () => {
    const path = window.location.pathname.replace(/\/+$/, "");
    if ((path === "/library" && !window.location.hash) || window.location.hash === "#library") {
      return "#reference";
    }
    return window.location.hash || "#overview";
  };
  const [activeHref, setActiveHref] = useState(getActiveHref);

  useEffect(() => {
    const handleRouteChange = () => setActiveHref(getActiveHref());
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

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

  const handleSidebarToggle = () => {
    const isDesktop = window.matchMedia("(min-width: 981px)").matches;
    setSidebarTooltip(null);
    toggleMainSidebar();
    if (isDesktop) requestAnimationFrame(() => sidebarToggleRef.current?.focus());
  };

  const showSidebarTooltip = (target: HTMLElement) => {
    if (!sidebarCollapsed || !window.matchMedia("(min-width: 981px)").matches) return;
    const label = target.dataset.tooltip;
    if (!label) return;
    const bounds = target.getBoundingClientRect();
    setSidebarTooltip({ label, top: bounds.top + bounds.height / 2 });
  };

  const hideSidebarTooltip = () => setSidebarTooltip(null);

  return (
    <>
      <aside ref={sidebarRef} className={`sidebar ${sidebarOpen ? "is-open" : ""}`} id="main-sidebar">
        <div className="brand-lockup">
          <span className="brand-mark">
            <span />
          </span>
          <span>
            <strong>Kinetic UI</strong>
          </span>
          <button
            className="icon-button sidebar-close"
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
          <button
            ref={sidebarToggleRef}
            className="icon-button sidebar-toggle"
            type="button"
            aria-label="Toggle sidebar"
            aria-controls="main-sidebar"
            aria-expanded={!sidebarCollapsed}
            data-tooltip={sidebarCollapsed ? "Expand sidebar" : undefined}
            onMouseEnter={(event) => showSidebarTooltip(event.currentTarget)}
            onMouseLeave={hideSidebarTooltip}
            onFocus={(event) => showSidebarTooltip(event.currentTarget)}
            onBlur={hideSidebarTooltip}
            onClick={handleSidebarToggle}
          >
            <Menu size={19} />
          </button>
        </div>
        <nav className="sidebar-nav" aria-label="Component sections">
          <span className="nav-label">Library</span>
          {navigation.map((item) => {
            const Icon = item.icon;
            const href = item.href;
            return (
              <a
                className={href === activeHref ? "active" : ""}
                href={href}
                key={item.label}
                aria-label={item.label}
                data-tooltip={sidebarCollapsed ? item.label : undefined}
                onMouseEnter={(event) => showSidebarTooltip(event.currentTarget)}
                onMouseLeave={hideSidebarTooltip}
                onFocus={(event) => showSidebarTooltip(event.currentTarget)}
                onBlur={hideSidebarTooltip}
                onClick={() => {
                  hideSidebarTooltip();
                  setSidebarOpen(false);
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {item.label === "Reference" && <span className="nav-count">64</span>}
              </a>
            );
          })}
        </nav>
        <div className="sidebar-profile" onClick={(event) => event.stopPropagation()}>
          <button
            ref={profileTriggerRef}
            className="sidebar-profile-trigger"
            type="button"
            aria-label={profileSignedIn ? "Profile menu" : "Sign in"}
            aria-haspopup={profileSignedIn ? "menu" : undefined}
            aria-expanded={profileSignedIn ? profileMenuOpen : undefined}
            aria-controls={profileSignedIn ? "sidebar-profile-menu" : undefined}
            data-tooltip={
              sidebarCollapsed && !profileMenuOpen ? (profileSignedIn ? "Profile" : "Sign in") : undefined
            }
            onMouseEnter={(event) => showSidebarTooltip(event.currentTarget)}
            onMouseLeave={hideSidebarTooltip}
            onFocus={(event) => showSidebarTooltip(event.currentTarget)}
            onBlur={hideSidebarTooltip}
            onClick={() => {
              hideSidebarTooltip();
              if (!profileSignedIn) {
                setProfileSignedIn(true);
                toast.success("Signed back in");
                return;
              }
              setProfileMenuOpen((open) => !open);
            }}
          >
            <InitialsAvatar
              label={profileSignedIn ? "AD" : "?"}
              name={profileSignedIn ? "Alvin de Mesa" : "Guest"}
            />
            <span>
              <strong>{profileSignedIn ? "Alvin de Mesa" : "Signed out"}</strong>
              <small>{profileSignedIn ? "Product developer" : "Guest mode"}</small>
            </span>
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
        {sidebarTooltip && (
          <span className="sidebar-tooltip" style={{ top: `${sidebarTooltip.top}px` }} aria-hidden="true">
            {sidebarTooltip.label}
          </span>
        )}
      </aside>
    </>
  );
}
