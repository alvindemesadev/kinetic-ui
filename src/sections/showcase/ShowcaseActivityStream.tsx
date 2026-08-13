import * as React from "react";
import { Menu, Search, Bell } from "lucide-react";
import { InitialsAvatar } from "@/components";
import { miniNavigation, type MiniSection } from "./ShowcaseData";

interface MiniCard {
  label: string;
  value: string;
}

interface ShowcaseActivityStreamProps {
  miniSidebarOpen: boolean;
  setMiniSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  miniSection: MiniSection;
  chooseMiniSection: (section: MiniSection) => void;
  miniSearchOpen: boolean;
  setMiniSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  miniSearchQuery: string;
  setMiniSearchQuery: (query: string) => void;
  miniNotificationCount: number;
  setMiniNotificationCount: (count: number) => void;
  miniNotificationOpen: boolean;
  setMiniNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  miniProfileOpen: boolean;
  setMiniProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  miniView: { eyebrow: string; title: string; description: string };
  miniCards: MiniCard[];
  miniSelectedCard: string | null;
  setMiniSelectedCard: (label: string | null) => void;
}

export function ShowcaseActivityStream({
  miniSidebarOpen,
  setMiniSidebarOpen,
  miniSection,
  chooseMiniSection,
  miniSearchOpen,
  setMiniSearchOpen,
  miniSearchQuery,
  setMiniSearchQuery,
  miniNotificationCount,
  setMiniNotificationCount,
  miniNotificationOpen,
  setMiniNotificationOpen,
  miniProfileOpen,
  setMiniProfileOpen,
  miniView,
  miniCards,
  miniSelectedCard,
  setMiniSelectedCard,
}: ShowcaseActivityStreamProps) {
  const searchTriggerRef = React.useRef<HTMLButtonElement>(null);
  const notificationTriggerRef = React.useRef<HTMLButtonElement>(null);
  const notificationMenuRef = React.useRef<HTMLDivElement>(null);
  const profileTriggerRef = React.useRef<HTMLButtonElement>(null);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!miniNotificationOpen) return;
    const focusFrame = requestAnimationFrame(() =>
      notificationMenuRef.current?.querySelector<HTMLButtonElement>("button")?.focus(),
    );
    return () => cancelAnimationFrame(focusFrame);
  }, [miniNotificationOpen]);

  React.useEffect(() => {
    if (!miniProfileOpen) return;
    const focusFrame = requestAnimationFrame(() =>
      profileMenuRef.current?.querySelector<HTMLButtonElement>("button")?.focus(),
    );
    return () => cancelAnimationFrame(focusFrame);
  }, [miniProfileOpen]);

  const closeMiniSearch = React.useCallback(() => {
    setMiniSearchOpen(false);
    setMiniSearchQuery("");
    requestAnimationFrame(() => searchTriggerRef.current?.focus());
  }, [setMiniSearchOpen, setMiniSearchQuery]);

  const closeMiniNotifications = React.useCallback(() => {
    setMiniNotificationOpen(false);
    requestAnimationFrame(() => notificationTriggerRef.current?.focus());
  }, [setMiniNotificationOpen]);

  const closeMiniProfile = React.useCallback(() => {
    setMiniProfileOpen(false);
    requestAnimationFrame(() => profileTriggerRef.current?.focus());
  }, [setMiniProfileOpen]);

  return (
    <article
      className={`panel navigation-preview ${miniSidebarOpen ? "" : "sidebar-collapsed"}`}
      aria-label="Interactive navigation preview"
    >
      <div className="mini-sidebar">
        <span className="mini-brand">
          <span className="brand-mark">
            <span />
          </span>
          Kinetic
        </span>
        <nav aria-label="Preview sections">
          {miniNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={miniSection === item.label ? "active" : ""}
                type="button"
                aria-current={miniSection === item.label ? "page" : undefined}
                key={item.label}
                onClick={() => chooseMiniSection(item.label)}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="mini-app">
        <div className="mini-navbar">
          <button
            className="icon-button"
            type="button"
            aria-label={miniSidebarOpen ? "Collapse preview menu" : "Expand preview menu"}
            aria-expanded={miniSidebarOpen}
            onClick={() => setMiniSidebarOpen((open) => !open)}
          >
            <Menu size={17} />
          </button>
          <strong>{miniSection}</strong>
          <span />
          {miniSearchOpen && (
            <input
              className="mini-search"
              aria-label="Search preview cards"
              placeholder="Search cards..."
              value={miniSearchQuery}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  closeMiniSearch();
                }
              }}
              onChange={(event) => setMiniSearchQuery(event.target.value)}
            />
          )}
          <button
            ref={searchTriggerRef}
            className={`icon-button ${miniSearchOpen ? "active" : ""}`}
            type="button"
            aria-label={miniSearchOpen ? "Close preview search" : "Search preview"}
            aria-pressed={miniSearchOpen}
            onClick={() => {
              if (miniSearchOpen) {
                closeMiniSearch();
              } else {
                setMiniSearchOpen(true);
              }
            }}
          >
            <Search size={16} />
          </button>
          <button
            ref={notificationTriggerRef}
            className="icon-button mini-notification-button"
            type="button"
            aria-label={`${miniNotificationCount} preview notifications`}
            aria-haspopup="dialog"
            aria-expanded={miniNotificationOpen}
            onClick={() => {
              if (miniNotificationOpen) {
                closeMiniNotifications();
              } else {
                setMiniNotificationOpen(true);
                setMiniProfileOpen(false);
              }
            }}
          >
            <Bell size={16} />
            {miniNotificationCount > 0 && <i>{miniNotificationCount}</i>}
          </button>
          <button
            ref={profileTriggerRef}
            className="mini-avatar-button"
            type="button"
            aria-label="Open preview profile"
            aria-haspopup="menu"
            aria-expanded={miniProfileOpen}
            onClick={() => {
              if (miniProfileOpen) {
                closeMiniProfile();
              } else {
                setMiniProfileOpen(true);
                setMiniNotificationOpen(false);
              }
            }}
          >
            <InitialsAvatar size="small" name="Alvin de Mesa" />
          </button>
        </div>
        {miniNotificationOpen && (
          <div
            ref={notificationMenuRef}
            className="mini-menu mini-notifications"
            role="dialog"
            aria-label="Preview notifications"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeMiniNotifications();
              }
            }}
          >
            <strong>Notifications</strong>
            <p>Component review is ready.</p>
            <p>Two teammates joined the workspace.</p>
            <button type="button" onClick={() => setMiniNotificationCount(0)}>
              Mark all as read
            </button>
            <button type="button" onClick={closeMiniNotifications}>
              Close notifications
            </button>
          </div>
        )}
        {miniProfileOpen && (
          <div
            ref={profileMenuRef}
            className="mini-menu mini-profile-menu"
            role="menu"
            aria-label="Preview profile"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeMiniProfile();
              }
            }}
          >
            <strong>Alvin de Mesa</strong>
            <small>Product developer</small>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                chooseMiniSection("Team");
                closeMiniProfile();
              }}
            >
              View team
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                chooseMiniSection("Settings");
                closeMiniProfile();
              }}
            >
              Account settings
            </button>
          </div>
        )}
        <div className="mini-content">
          <div className="mini-content-heading">
            <span>{miniView.eyebrow}</span>
            <strong>{miniView.title}</strong>
            <p>{miniView.description}</p>
          </div>
          <div className="mini-card-grid">
            {miniCards.map((card) => (
              <button
                className={miniSelectedCard === card.label ? "selected" : ""}
                type="button"
                aria-pressed={miniSelectedCard === card.label}
                key={card.label}
                onClick={() => setMiniSelectedCard(card.label)}
              >
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <small>{miniSelectedCard === card.label ? "Selected" : "Open details"}</small>
              </button>
            ))}
            {miniCards.length === 0 && <p className="mini-empty">No matching cards.</p>}
          </div>
        </div>
      </div>
    </article>
  );
}
