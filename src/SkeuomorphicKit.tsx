"use client";

import {
  Activity,
  ArrowUp,
  Bell,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Command,
  Download,
  FileText,
  Inbox,
  Link2,
  LoaderCircle,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings,
  Tags,
  Trash2,
  UploadCloud,
  User,
  X,
  Zap,
} from "lucide-react";
import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { toast } from "sonner";
import {
  AuthCard,
  ForgotPasswordCard,
  InitialsAvatar,
  ButtonStateShowcase,
  DeleteConfirmationDialog,
  DatePicker,
  FrameworkCombobox,
  InfiniteLogoCarousel,
  StyleDropdown,
  TimePicker,
  SwitchControl,
  type ThemePreference,
} from "./components";
import { DeferredRender } from "./components/DeferredRender";
import { useFocusTrap } from "./hooks/useFocusTrap";
import { useTheme } from "./hooks/useTheme";

type OpenControl = "date" | "time" | "style" | "framework" | null;
type ViewDensity = "compact" | "comfortable" | "spacious";

const densityOptions: Array<{ value: ViewDensity; label: string }> = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
];

const ChartGallery = lazy(() => import("./ChartGallery"));
const ComponentCatalog = lazy(() => import("./ComponentCatalog"));

// Static sections are memoized so local controls (pickers, filters, menus) do not
// rerender unrelated galleries. Interactive sections keep their own state and
// are intentionally left outside this boundary.
const MemoShowcaseStatCards = memo(ShowcaseStatCards);
const MemoShowcaseFeatures = memo(ShowcaseFeatures);
const MemoShowcasePricing = memo(ShowcasePricing);
const MemoShowcaseFoundation = memo(ShowcaseFoundation);
const MemoShowcaseProfile = memo(ShowcaseProfile);
const MemoShowcaseSettings = memo(ShowcaseSettings);
const MemoShowcaseCalendar = memo(ShowcaseCalendar);
const MemoShowcaseKanban = memo(ShowcaseKanban);
const MemoShowcaseTimeline = memo(ShowcaseTimeline);
const MemoShowcaseTodoList = memo(ShowcaseTodoList);
const MemoShowcaseOverlayGallery = memo(ShowcaseOverlayGallery);

const isLibraryAlias = () => {
  const path = window.location.pathname.replace(/\/+$/, "");
  return (path === "/library" && !window.location.hash) || window.location.hash === "#library";
};

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

import { waitForDemo } from "./sections/demoUtils";
import { Sidebar } from "./sections/Sidebar";
import { Navbar } from "./sections/Navbar";
import { Hero } from "./sections/Hero";
import { ShowcaseFoundation } from "./sections/showcase/ShowcaseFoundation";
import { ShowcaseStatCards } from "./sections/showcase/ShowcaseStatCards";
import { ShowcaseFeatures } from "./sections/showcase/ShowcaseFeatures";
import { ShowcasePricing } from "./sections/showcase/ShowcasePricing";
import { ShowcaseCalendar } from "./sections/showcase/ShowcaseCalendar";
import { ShowcaseKanban, ShowcaseTimeline, ShowcaseTodoList } from "./sections/showcase/ShowcaseProductivity";
import { ShowcaseDataTable } from "./sections/showcase/ShowcaseDataTable";
import { ShowcaseActivityStream } from "./sections/showcase/ShowcaseActivityStream";
import { ShowcaseModals } from "./sections/showcase/ShowcaseModals";
import { ShowcaseOverlayGallery } from "./sections/showcase/ShowcaseOverlayGallery";
import { ShowcaseProfile } from "./sections/showcase/ShowcaseProfile";
import { ShowcaseSettings } from "./sections/showcase/ShowcaseSettings";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "./components/ui/message";

import {
  carouselSlides,
  logoCarouselItems,
  miniViews,
  tableRows,
  type MiniSection,
} from "./sections/showcase/ShowcaseData";

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="kit-section" id={id}>
      <header className="section-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {children}
    </section>
  );
}

export default function SkeuomorphicKit() {
  const { theme, preference: selectedStyle, setPreference } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem("kinetic-sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [buttonDeleteOpen, setButtonDeleteOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselDirection, setCarouselDirection] = useState<"next" | "previous">("next");
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("balanced");
  const [checked, setChecked] = useState(true);
  const [fileName, setFileName] = useState("zenith-interface.fig");
  const [tableQuery, setTableQuery] = useState("");
  const [combobox, setCombobox] = useState("React");
  const [openControl, setOpenControl] = useState<OpenControl>(null);
  const [selectedDate, setSelectedDate] = useState("2026-08-12");
  const [selectedTime, setSelectedTime] = useState("22:22");
  const [miniSection, setMiniSection] = useState<MiniSection>("Dashboard");
  const [miniSidebarOpen, setMiniSidebarOpen] = useState(true);
  const [miniSearchOpen, setMiniSearchOpen] = useState(false);
  const [miniSearchQuery, setMiniSearchQuery] = useState("");
  const [miniNotificationOpen, setMiniNotificationOpen] = useState(false);
  const [miniNotificationCount, setMiniNotificationCount] = useState(2);
  const [navbarNotificationOpen, setNavbarNotificationOpen] = useState(false);
  const [navbarNotificationCount, setNavbarNotificationCount] = useState(2);
  const [navbarProfileOpen, setNavbarProfileOpen] = useState(false);
  const [miniProfileOpen, setMiniProfileOpen] = useState(false);
  const [miniSelectedCard, setMiniSelectedCard] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileSignedIn, setProfileSignedIn] = useState(true);
  const [viewDensity, setViewDensity] = useState<ViewDensity>(() => {
    const storedDensity = localStorage.getItem("kinetic-view-density");
    return densityOptions.some((option) => option.value === storedDensity)
      ? (storedDensity as ViewDensity)
      : "compact";
  });
  const modalDialogRef = useRef<HTMLElement>(null);
  const commandDialogRef = useRef<HTMLElement>(null);

  const chooseTheme = useCallback((nextTheme: "dark" | "light") => setPreference(nextTheme), [setPreference]);
  const chooseStyle = useCallback((style: ThemePreference) => setPreference(style), [setPreference]);
  const navigateToPage = useCallback((href: "#profile" | "#settings") => {
    if (window.location.hash !== href) {
      window.history.pushState({}, "", href);
      window.dispatchEvent(new Event("hashchange"));
    }
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(href)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      }),
    );
  }, []);
  const toggleMainSidebar = useCallback(() => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      setSidebarOpen((open) => !open);
      return;
    }
    setSidebarCollapsed((collapsed) => !collapsed);
  }, []);

  useFocusTrap(modalDialogRef, modalOpen);
  useFocusTrap(commandDialogRef, commandOpen);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
      if (event.key === "Escape") {
        if (openControl) {
          const activeElement = document.activeElement;
          const control = activeElement?.closest<HTMLElement>(".custom-control");
          const trigger = control?.querySelector<HTMLButtonElement>(".custom-trigger");
          if (trigger) requestAnimationFrame(() => trigger.focus());
        }
        setModalOpen(false);
        setCommandOpen(false);
        setSidebarOpen(false);
        setOpenControl(null);
        setProfileMenuOpen(false);
        setNavbarNotificationOpen(false);
        setNavbarProfileOpen(false);
        setMiniSearchOpen(false);
        setMiniNotificationOpen(false);
        setMiniProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openControl]);

  useEffect(() => {
    localStorage.setItem("kinetic-view-density", viewDensity);
  }, [viewDensity]);

  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, "");
    const navigationEntry = performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;
    const isReload = navigationEntry?.type === "reload";
    if (path === "" && window.location.hash === "#reference" && isReload) {
      window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}`);
      const resetScroll = () => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      };
      resetScroll();
      requestAnimationFrame(() => {
        resetScroll();
        requestAnimationFrame(resetScroll);
      });
      window.dispatchEvent(new Event("hashchange"));
    }

    const handleRouteChange = () => {
      if (isLibraryAlias()) {
        requestAnimationFrame(() =>
          document.querySelector("#reference")?.scrollIntoView({ behavior: "auto", block: "start" }),
        );
        return;
      }
      const hash = window.location.hash;
      if (/^#[A-Za-z][\w-]*$/.test(hash)) {
        requestAnimationFrame(() =>
          document.querySelector(hash)?.scrollIntoView({ behavior: "auto", block: "start" }),
        );
      }
    };
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);
    handleRouteChange();
    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("kinetic-sidebar-collapsed", String(sidebarCollapsed));
    } catch {
      // The in-memory sidebar preference still works when storage is unavailable.
    }
  }, [sidebarCollapsed]);

  const handleDensityKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? densityOptions.length - 1
          : (index + direction + densityOptions.length) % densityOptions.length;
    setViewDensity(densityOptions[nextIndex].value);
    const densityButtons =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=radio]");
    densityButtons?.[nextIndex]?.focus();
  };

  const filteredRows = useMemo(
    () => tableRows.filter((row) => row.name.toLowerCase().includes(tableQuery.toLowerCase())),
    [tableQuery],
  );
  const miniView = miniViews[miniSection];
  const miniCards = miniView.cards.filter((card) =>
    card.label.toLowerCase().includes(miniSearchQuery.toLowerCase()),
  );
  const chooseMiniSection = useCallback((section: MiniSection) => {
    setMiniSection(section);
    setMiniSelectedCard(null);
    setMiniSearchQuery("");
    setMiniNotificationOpen(false);
    setMiniProfileOpen(false);
  }, []);
  return (
    <div
      className={`ui-kit ${theme} density-${viewDensity} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      onClick={() => {
        setOpenControl(null);
        setProfileMenuOpen(false);
        setNavbarNotificationOpen(false);
        setNavbarProfileOpen(false);
      }}
    >
      <button
        className={`mobile-scrim ${sidebarOpen ? "is-visible" : ""}`}
        aria-label="Close menu"
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        toggleMainSidebar={toggleMainSidebar}
        profileSignedIn={profileSignedIn}
        setProfileSignedIn={setProfileSignedIn}
        profileMenuOpen={profileMenuOpen}
        setProfileMenuOpen={setProfileMenuOpen}
        onNavigateToPage={navigateToPage}
      />

      <div className="app-column">
        <Navbar
          toggleMainSidebar={toggleMainSidebar}
          setCommandOpen={setCommandOpen}
          theme={theme}
          chooseTheme={chooseTheme}
          navbarNotificationOpen={navbarNotificationOpen}
          setNavbarNotificationOpen={setNavbarNotificationOpen}
          navbarNotificationCount={navbarNotificationCount}
          setNavbarNotificationCount={setNavbarNotificationCount}
          profileSignedIn={profileSignedIn}
          setProfileSignedIn={setProfileSignedIn}
          navbarProfileOpen={navbarProfileOpen}
          setNavbarProfileOpen={setNavbarProfileOpen}
          onNavigateToPage={navigateToPage}
        />

        <main className="content-shell">
          <Hero setModalOpen={setModalOpen} />

          <MemoShowcaseProfile onNavigateToPage={navigateToPage} />

          <MemoShowcaseSettings
            selectedStyle={selectedStyle}
            onStyleChange={chooseStyle}
            onNavigateToPage={navigateToPage}
          />

          <MemoShowcaseStatCards />

          <MemoShowcaseFeatures />

          <MemoShowcasePricing />

          <MemoShowcaseFoundation />

          <Section
            id="controls"
            eyebrow="02 · Controls"
            title="Buttons, fields, and selections"
            description="Core inputs retain clear affordances while using pressed, recessed, and raised skeuomorphic states."
          >
            <div className="component-grid two-column">
              <article className="panel demo-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Buttons</h3>
                    <p>Primary, secondary, quiet, icon, and destructive.</p>
                  </div>
                  <span className="badge badge-neutral">5 variants</span>
                </div>
                <div className="button-demo-row">
                  <button
                    className="button button-primary"
                    onClick={() => toast.success("Component created")}
                  >
                    <Plus size={16} /> Create
                  </button>
                  <button
                    className="button button-secondary"
                    onClick={() => toast.success("Export prepared")}
                  >
                    <Download size={16} /> Export
                  </button>
                  <button className="button button-ghost">Cancel</button>
                  <button
                    className="button button-danger"
                    onClick={() => setButtonDeleteOpen(true)}
                    type="button"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <button className="icon-button raised" aria-label="Settings">
                    <Settings size={17} />
                  </button>
                </div>
                <div className="button-group" role="radiogroup" aria-label="View density">
                  {densityOptions.map((option, index) => {
                    const selected = viewDensity === option.value;
                    return (
                      <button
                        className={selected ? "active" : ""}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        tabIndex={selected ? 0 : -1}
                        key={option.value}
                        onClick={() => setViewDensity(option.value)}
                        onKeyDown={(event) => handleDensityKeyDown(event, index)}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </article>
              <article className="panel demo-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Inputs</h3>
                    <p>Custom fields, date, time, and dropdown.</p>
                  </div>
                  <span className="badge badge-success">Fully themed</span>
                </div>
                <div className="field-grid">
                  <label className="field">
                    <span>Project name</span>
                    <div className="input-shell">
                      <input defaultValue="Zenith for Windows" />
                    </div>
                  </label>
                  <label className="field">
                    <span>Search</span>
                    <div className="input-shell has-icon">
                      <Search size={15} />
                      <input placeholder="Search files..." />
                    </div>
                  </label>
                  <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    isOpen={openControl === "date"}
                    onToggle={() => setOpenControl((current) => (current === "date" ? null : "date"))}
                    onClose={() => setOpenControl(null)}
                  />
                  <TimePicker
                    value={selectedTime}
                    onChange={setSelectedTime}
                    isOpen={openControl === "time"}
                    onToggle={() => setOpenControl((current) => (current === "time" ? null : "time"))}
                    onClose={() => setOpenControl(null)}
                  />
                  <StyleDropdown
                    value={selectedStyle}
                    onChange={chooseStyle}
                    isOpen={openControl === "style"}
                    onToggle={() => setOpenControl((current) => (current === "style" ? null : "style"))}
                    onClose={() => setOpenControl(null)}
                  />
                </div>
              </article>
              <article className="panel demo-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Selection controls</h3>
                    <p>Checkboxes, radios, and switches.</p>
                  </div>
                  <CheckCircle2 size={19} />
                </div>
                <div className="selection-list">
                  <label className="check-row">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      className={`checkbox ${checked ? "checked" : ""}`}
                      onClick={() => setChecked(!checked)}
                    >
                      {checked && <Check size={14} />}
                    </button>
                    <span>
                      <strong>Launch at startup</strong>
                      <small>Keep Zenith ready after sign-in.</small>
                    </span>
                  </label>
                  <label className="check-row">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedRadio === "balanced"}
                      className={`radio ${selectedRadio === "balanced" ? "checked" : ""}`}
                      onClick={() => setSelectedRadio("balanced")}
                    >
                      <i />
                    </button>
                    <span>
                      <strong>Balanced performance</strong>
                      <small>Best mix of speed and battery use.</small>
                    </span>
                  </label>
                  <label className="check-row">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selectedRadio === "maximum"}
                      className={`radio ${selectedRadio === "maximum" ? "checked" : ""}`}
                      onClick={() => setSelectedRadio("maximum")}
                    >
                      <i />
                    </button>
                    <span>
                      <strong>Maximum performance</strong>
                      <small>Prioritize responsiveness.</small>
                    </span>
                  </label>
                  <div className="switch-row">
                    <span>
                      <strong>Notifications</strong>
                      <small>Desktop alerts and sounds</small>
                    </span>
                    <SwitchControl
                      checked={notifications}
                      onChange={setNotifications}
                      label="Notifications"
                    />
                  </div>
                  <div className="switch-row">
                    <span>
                      <strong>Anonymous analytics</strong>
                      <small>Help improve the application</small>
                    </span>
                    <SwitchControl checked={analytics} onChange={setAnalytics} label="Anonymous analytics" />
                  </div>
                </div>
              </article>
              <article className="panel demo-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Combobox & command</h3>
                    <p>Fast keyboard-first selection.</p>
                  </div>
                  <Command size={19} />
                </div>
                <FrameworkCombobox
                  value={combobox}
                  onChange={setCombobox}
                  isOpen={openControl === "framework"}
                  onOpen={() => setOpenControl("framework")}
                  onClose={() => setOpenControl(null)}
                />
                <button className="command-trigger" onClick={() => setCommandOpen(true)}>
                  <span>
                    <Command size={16} /> Open command menu
                  </span>
                  <kbd>Ctrl K</kbd>
                </button>
                <div className="tooltip-demo">
                  <button className="icon-button raised tooltip-anchor" aria-describedby="tooltip-copy">
                    <Link2 size={17} />
                    <span className="tooltip" role="tooltip" id="tooltip-copy">
                      Copy component link
                    </span>
                  </button>
                  <span>Hover the link button for a tooltip</span>
                </div>
              </article>
            </div>
          </Section>

          <Section
            id="components"
            eyebrow="03 · Components"
            title="Surfaces, communication, and navigation"
            description="Reusable compositions for profiles, files, messages, schedules, and content browsing."
          >
            <article className="panel infinite-logo-demo">
              <div className="panel-heading">
                <div>
                  <h3>Infinite logo carousel</h3>
                  <p>A seamless, reusable marquee for technologies, partners, or client logos.</p>
                </div>
                <span className="component-count">8 logos</span>
              </div>
              <InfiniteLogoCarousel items={logoCarouselItems} duration={28} />
            </article>
            <div className="auth-card-grid">
              <AuthCard
                mode="login"
                onSubmit={async () => {
                  await waitForDemo();
                  toast.success("Signed in to the demo workspace");
                }}
                onForgotPassword={() => toast.info("Password reset link requested")}
                onModeChange={() => toast.info("Signup card is beside this one")}
              />
              <AuthCard
                mode="signup"
                onSubmit={async () => {
                  await waitForDemo();
                  toast.success("Demo account created");
                }}
                onModeChange={() => toast.info("Login card is beside this one")}
              />
              <ForgotPasswordCard
                onRequestCode={async () => {
                  await waitForDemo();
                  toast.success("Reset code sent to your email");
                }}
                onResendCode={async () => {
                  await waitForDemo();
                  toast.success("A new reset code was sent");
                }}
                onResetPassword={async () => {
                  await waitForDemo();
                  toast.success("Password reset complete");
                }}
              />
            </div>
            <div className="component-grid three-column">
              <article className="panel profile-card">
                <div className="cover-strip" />
                <InitialsAvatar size="large" name="Alvin de Mesa" />
                <button className="icon-button profile-menu" aria-label="Profile options">
                  <MoreHorizontal size={18} />
                </button>
                <h3>Alvin de Mesa</h3>
                <p>Building focused Windows utilities with Rust and React.</p>
                <div className="profile-stats">
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
                <button className="button button-primary full-width">
                  <User size={16} /> View profile
                </button>
              </article>
              <article className="panel attachment-card">
                <div className="panel-heading">
                  <div>
                    <h3>Attachment</h3>
                    <p>Drag, browse, and manage files.</p>
                  </div>
                  <Paperclip size={19} />
                </div>
                <label className="drop-zone">
                  <UploadCloud size={24} />
                  <strong>Drop a file here</strong>
                  <span>or click to browse · max 25 MB</span>
                  <input
                    type="file"
                    onChange={(event) => setFileName(event.target.files?.[0]?.name ?? fileName)}
                  />
                </label>
                <div className="file-row">
                  <span className="file-icon">
                    <FileText size={19} />
                  </span>
                  <span>
                    <strong>{fileName}</strong>
                    <small>4.8 MB · Ready</small>
                  </span>
                  <button
                    className="icon-button"
                    aria-label="Remove file"
                    onClick={() => setFileName("No file selected")}
                  >
                    <X size={16} />
                  </button>
                </div>
              </article>
              <article className="panel badge-card">
                <div className="panel-heading">
                  <div>
                    <h3>Badges</h3>
                    <p>Status, count, and category labels.</p>
                  </div>
                  <Tags size={19} />
                </div>
                <div className="badge-cloud">
                  <span className="badge badge-success">Ready</span>
                  <span className="badge badge-warning">In review</span>
                  <span className="badge badge-danger">Blocked</span>
                  <span className="badge badge-info">Beta</span>
                  <span className="badge badge-neutral">Draft</span>
                  <span className="badge badge-accent">New</span>
                </div>
                <div className="notification-preview">
                  <span className="metric-icon orange">
                    <Bell size={18} />
                  </span>
                  <div>
                    <strong>Update available</strong>
                    <p>Version 1.4 includes 8 new components.</p>
                  </div>
                  <span className="count-badge">8</span>
                </div>
              </article>
              <article className="panel chat-card">
                <div className="panel-heading">
                  <div>
                    <h3>Chat bubbles</h3>
                    <p>Compact conversation layout.</p>
                  </div>
                  <MessageCircle size={19} />
                </div>
                <MessageGroup className="chat-feed">
                  <Message>
                    <MessageAvatar>MI</MessageAvatar>
                    <MessageContent>
                      <MessageHeader>Mika</MessageHeader>
                      <div className="message-bubble">
                        The new component set looks solid. Is light mode ready?
                      </div>
                      <MessageFooter>10:42 PM</MessageFooter>
                    </MessageContent>
                  </Message>
                  <Message align="end">
                    <MessageAvatar>AD</MessageAvatar>
                    <MessageContent>
                      <MessageHeader>Alvin</MessageHeader>
                      <div className="message-bubble">
                        Yes, both themes use the same depth and material rules.
                      </div>
                      <MessageFooter>10:43 PM - Read</MessageFooter>
                      <span>10:43 PM · Read</span>
                    </MessageContent>
                  </Message>
                </MessageGroup>
                <div className="chat-input">
                  <button className="icon-button" aria-label="Attach">
                    <Paperclip size={16} />
                  </button>
                  <input placeholder="Write a message..." />
                  <button
                    className="send-button"
                    type="button"
                    aria-label="Send"
                    onClick={() => toast.success("Message sent")}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </article>
              <article className="panel carousel-card">
                <div
                  className={`carousel-slide carousel-slide-${carouselDirection}`}
                  key={carouselIndex}
                  aria-live="polite"
                >
                  <div className="carousel-kicker">{carouselSlides[carouselIndex].kicker}</div>
                  <h3>{carouselSlides[carouselIndex].title}</h3>
                  <p>{carouselSlides[carouselIndex].body}</p>
                  <div className="carousel-visual" aria-hidden="true">
                    <span />
                    <i />
                    <b />
                  </div>
                </div>
                <div className="carousel-controls">
                  <div>
                    {carouselSlides.map((_, index) => (
                      <button
                        className={index === carouselIndex ? "active" : ""}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === carouselIndex ? "true" : undefined}
                        key={index}
                        onClick={() => {
                          if (index === carouselIndex) return;
                          setCarouselDirection(index > carouselIndex ? "next" : "previous");
                          setCarouselIndex(index);
                        }}
                      />
                    ))}
                  </div>
                  <span>
                    <button
                      className="icon-button"
                      aria-label="Previous slide"
                      onClick={() => {
                        setCarouselDirection("previous");
                        setCarouselIndex(
                          (index) => (index + carouselSlides.length - 1) % carouselSlides.length,
                        );
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      className="icon-button"
                      aria-label="Next slide"
                      onClick={() => {
                        setCarouselDirection("next");
                        setCarouselIndex((index) => (index + 1) % carouselSlides.length);
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </span>
                </div>
              </article>
            </div>
            <ShowcaseActivityStream
              miniSidebarOpen={miniSidebarOpen}
              setMiniSidebarOpen={setMiniSidebarOpen}
              miniSection={miniSection}
              chooseMiniSection={chooseMiniSection}
              miniSearchOpen={miniSearchOpen}
              setMiniSearchOpen={setMiniSearchOpen}
              miniSearchQuery={miniSearchQuery}
              setMiniSearchQuery={setMiniSearchQuery}
              miniNotificationCount={miniNotificationCount}
              setMiniNotificationCount={setMiniNotificationCount}
              miniNotificationOpen={miniNotificationOpen}
              setMiniNotificationOpen={setMiniNotificationOpen}
              miniProfileOpen={miniProfileOpen}
              setMiniProfileOpen={setMiniProfileOpen}
              miniView={miniView}
              miniCards={miniCards}
              miniSelectedCard={miniSelectedCard}
              setMiniSelectedCard={setMiniSelectedCard}
            />
            <div className="overlay-demo panel">
              <div>
                <span className="eyebrow">
                  <Zap size={14} /> Responsive overlay
                </span>
                <h3>
                  Modal on desktop.
                  <br />
                  Drawer on mobile.
                </h3>
                <p>The same component changes its physical placement based on the viewport.</p>
              </div>
              <button className="button button-primary" onClick={() => setModalOpen(true)}>
                Open component
              </button>
            </div>
          </Section>

          <MemoShowcaseCalendar />

          <MemoShowcaseKanban />

          <MemoShowcaseTimeline />

          <MemoShowcaseTodoList />

          <Section
            id="overlays"
            eyebrow="08 · Overlays"
            title="Modals on desktop. Drawers on mobile."
            description="Focused actions that stay contextual: inspect, edit, create, confirm, invite, and safely remove workspace content."
          >
            <MemoShowcaseOverlayGallery />
          </Section>

          <Section
            id="reference"
            eyebrow="09 · Reference"
            title="Component reference"
            description="Reusable primitives with the same tactile materials, interaction rules, and accessible behavior as the template."
          >
            <DeferredRender
              fallback={
                <div className="panel charts-placeholder">
                  <LoaderCircle className="large-spinner" size={23} />
                  <div>
                    <strong>Loading component reference</strong>
                    <p>The reusable primitive examples load as this section approaches.</p>
                  </div>
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="panel charts-placeholder">
                    <LoaderCircle className="large-spinner" size={23} />
                    <div>
                      <strong>Loading component reference</strong>
                      <p>The reusable primitive examples are loading.</p>
                    </div>
                  </div>
                }
              >
                <ComponentCatalog />
              </Suspense>
            </DeferredRender>
          </Section>

          <Section
            id="data"
            eyebrow="10 · Data"
            title="Tables and information density"
            description="Readable structured data with search, sorting affordances, filters, and semantic status."
          >
            <ShowcaseDataTable
              tableQuery={tableQuery}
              setTableQuery={setTableQuery}
              filteredRows={filteredRows}
            />
            <div id="charts" className="charts-heading">
              <span>Chart library</span>
              <h3>Eight responsive visualizations</h3>
              <p>
                Recharts-powered examples using the same theme tokens, custom tooltip, and material surfaces.
              </p>
            </div>
            <DeferredRender
              fallback={
                <div className="panel charts-placeholder">
                  <LoaderCircle className="large-spinner" size={23} />
                  <div>
                    <strong>Loading charts</strong>
                    <p>The chart bundle loads as this gallery approaches.</p>
                  </div>
                </div>
              }
            >
              <Suspense
                fallback={
                  <div className="panel charts-placeholder">
                    <LoaderCircle className="large-spinner" size={23} />
                    <div>
                      <strong>Loading charts</strong>
                      <p>The chart bundle is fetched only when this gallery renders.</p>
                    </div>
                  </div>
                }
              >
                <ChartGallery />
              </Suspense>
            </DeferredRender>
          </Section>

          <Section
            id="states"
            eyebrow="11 · States"
            title="Every state accounted for"
            description="Empty, loading, skeleton, and progress patterns that preserve layout and communicate what happens next."
          >
            <div className="state-grid">
              <article className="panel empty-state">
                <span className="empty-icon">
                  <Inbox size={28} />
                </span>
                <h3>No shortcuts yet</h3>
                <p>Drop a folder here or create your first shortcut to get started.</p>
                <button className="button button-primary" onClick={() => toast.success("Shortcut added")}>
                  <Plus size={16} /> Add shortcut
                </button>
              </article>
              <article className="panel state-card">
                <div className="panel-heading">
                  <div>
                    <h3>Loading</h3>
                    <p>Static loading treatment.</p>
                  </div>
                  <LoaderCircle size={19} />
                </div>
                <div className="loading-demo">
                  <span className="large-spinner">
                    <LoaderCircle size={30} />
                  </span>
                  <strong>Syncing your workspace</strong>
                  <small>This preview intentionally stays still.</small>
                </div>
              </article>
              <article className="panel state-card">
                <div className="panel-heading">
                  <div>
                    <h3>Skeleton</h3>
                    <p>Static structure before content.</p>
                  </div>
                  <Activity size={19} />
                </div>
                <div className="skeleton-profile">
                  <span className="skeleton-avatar" />
                  <div>
                    <span className="skeleton-line medium" />
                    <span className="skeleton-line short" />
                  </div>
                </div>
                <span className="skeleton-line wide" />
                <span className="skeleton-line wide" />
                <span className="skeleton-line medium" />
              </article>
              <article className="panel state-card">
                <div className="panel-heading">
                  <div>
                    <h3>Progress</h3>
                    <p>Task completion and steps.</p>
                  </div>
                  <span className="badge badge-success">72%</span>
                </div>
                <div className="progress-meta">
                  <strong>Uploading assets</strong>
                  <span>18 of 25 files</span>
                </div>
                <div className="progress-track">
                  <span style={{ width: "72%" }} />
                </div>
                <div className="stepper">
                  <span className="complete">
                    <Check size={12} />
                  </span>
                  <i />
                  <span className="complete">
                    <Check size={12} />
                  </span>
                  <i />
                  <span className="current">3</span>
                  <i />
                  <span>4</span>
                </div>
              </article>
            </div>
            <ButtonStateShowcase
              onRunDemo={async () => {
                await waitForDemo();
                toast.success("Button state completed");
              }}
            />
          </Section>

          <footer className="kit-footer">
            <span className="brand-mark">
              <span />
            </span>
            <div>
              <strong>Kinetic UI</strong>
              <p>Skeuomorphic React template · DotGothic16 + Geist</p>
            </div>
            <a className="back-to-top" href="#overview">
              <ArrowUp size={15} aria-hidden="true" />
              Back to top
            </a>
          </footer>
        </main>
      </div>

      <ShowcaseModals
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        modalDialogRef={modalDialogRef}
        commandOpen={commandOpen}
        setCommandOpen={setCommandOpen}
        commandDialogRef={commandDialogRef}
        theme={theme}
        chooseTheme={chooseTheme}
      />

      <DeleteConfirmationDialog
        open={buttonDeleteOpen}
        rowName="Demo item"
        onOpenChange={setButtonDeleteOpen}
      />
    </div>
  );
}
