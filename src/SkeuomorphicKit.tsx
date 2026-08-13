"use client";

import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Command,
  Component,
  Copy,
  Download,
  Eye,
  FileText,
  Filter,
  Inbox,
  LayoutDashboard,
  Link2,
  LoaderCircle,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Paperclip,
  Palette,
  Plus,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  Type,
  UploadCloud,
  User,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { toast } from "sonner";
import {
  siFigma,
  siGithub,
  siRadixui,
  siReact,
  siShadcnui,
  siTailwindcss,
  siTypescript,
  siVite,
} from "simple-icons";
import {
  AuthCard,
  Avatar,
  ButtonStateShowcase,
  DatePicker,
  FrameworkCombobox,
  InfiniteLogoCarousel,
  LoadingButton,
  StatusBadge,
  StyleDropdown,
  TimePicker,
  Toggle,
  type ThemePreference,
} from "./components";
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

function waitForDemo(duration = 750) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration));
}

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard },
  { label: "Foundation", href: "#foundation", icon: Palette },
  { label: "Controls", href: "#controls", icon: SlidersHorizontal },
  { label: "Components", href: "#components", icon: Component },
  { label: "Data", href: "#data", icon: BarChart3 },
  { label: "States", href: "#states", icon: Activity },
];

type MiniSection = "Dashboard" | "Components" | "Team" | "Settings";

const miniNavigation: Array<{ label: MiniSection; icon: LucideIcon }> = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Components", icon: Component },
  { label: "Team", icon: Users },
  { label: "Settings", icon: Settings },
];

const miniViews: Record<
  MiniSection,
  { eyebrow: string; title: string; description: string; cards: Array<{ label: string; value: string }> }
> = {
  Dashboard: {
    eyebrow: "Workspace pulse",
    title: "Dashboard overview",
    description: "A quick read on current product activity.",
    cards: [
      { label: "Active projects", value: "12" },
      { label: "Review queue", value: "08" },
      { label: "Team velocity", value: "+18%" },
    ],
  },
  Components: {
    eyebrow: "Design system",
    title: "Component library",
    description: "Reusable interface parts and their release status.",
    cards: [
      { label: "Ready", value: "64" },
      { label: "In review", value: "06" },
      { label: "Coverage", value: "94%" },
    ],
  },
  Team: {
    eyebrow: "People",
    title: "Team workspace",
    description: "Members, availability, and shared responsibilities.",
    cards: [
      { label: "Members", value: "18" },
      { label: "Online now", value: "11" },
      { label: "Open tasks", value: "27" },
    ],
  },
  Settings: {
    eyebrow: "Configuration",
    title: "Workspace settings",
    description: "Preferences, integrations, and access controls.",
    cards: [
      { label: "Integrations", value: "09" },
      { label: "Active roles", value: "04" },
      { label: "Automations", value: "16" },
    ],
  },
};

const palette = [
  { name: "Obsidian", value: "#111315" },
  { name: "Graphite", value: "#26292C" },
  { name: "Porcelain", value: "#F3F1EA" },
  { name: "Signal", value: "#FF6A2A" },
  { name: "Ember", value: "#E34D18" },
  { name: "Success", value: "#45B87F" },
  { name: "Warning", value: "#E8A33D" },
  { name: "Info", value: "#559BFF" },
];

const calendarEvents = new Set([
  "2026-07-21",
  "2026-08-05",
  "2026-08-15",
  "2026-08-22",
  "2026-09-03",
  "2026-09-18",
]);

function calendarDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatCalendarMonth(year: number, month: number) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
}

function createCalendarMonth(year: number, month: number) {
  const mondayFirstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const today = new Date();
  const todayKey = calendarDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(year, month, index - mondayFirstOffset + 1);
    const value = calendarDateKey(date.getFullYear(), date.getMonth(), date.getDate());
    return {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      value,
      muted: date.getMonth() !== month,
      today: value === todayKey,
      event: calendarEvents.has(value),
    };
  });
}

const carouselSlides = [
  {
    kicker: "01 · Foundation",
    title: "Tactile by default",
    body: "Layered gradients, beveled edges, and restrained highlights make every surface feel physical.",
  },
  {
    kicker: "02 · Interaction",
    title: "Feedback you can feel",
    body: "Buttons compress, drawers glide, and focus rings stay clear for keyboard users.",
  },
  {
    kicker: "03 · Adaptation",
    title: "One system, two moods",
    body: "Dark and light modes preserve material depth instead of simply reversing colors.",
  },
];

const logoCarouselItems = [
  { name: "React", icon: siReact },
  { name: "TypeScript", icon: siTypescript },
  { name: "Vite", icon: siVite },
  { name: "Tailwind CSS", icon: siTailwindcss },
  { name: "shadcn/ui", icon: siShadcnui },
  { name: "Radix UI", icon: siRadixui },
  { name: "Figma", icon: siFigma },
  { name: "GitHub", icon: siGithub },
];

const tableRows = [
  {
    name: "Control Surface",
    owner: "Alvin",
    avatarName: "Alvin de Mesa",
    initials: "AD",
    status: "Ready",
    updated: "Today",
    size: "4.8 MB",
  },
  {
    name: "Command Palette",
    owner: "Mika",
    avatarName: "Mika",
    initials: "MI",
    status: "Review",
    updated: "Aug 11",
    size: "2.1 MB",
  },
  {
    name: "Analytics Module",
    owner: "Clyde",
    avatarName: "Clyde",
    initials: "CL",
    status: "Ready",
    updated: "Aug 10",
    size: "8.7 MB",
  },
  {
    name: "Profile Drawer",
    owner: "Alvin",
    avatarName: "Alvin de Mesa",
    initials: "AD",
    status: "Draft",
    updated: "Aug 08",
    size: "1.2 MB",
  },
];

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
  const [calendarView, setCalendarView] = useState({ year: 2026, month: 7 });
  const [calendarSelection, setCalendarSelection] = useState("2026-08-12");
  const [miniSection, setMiniSection] = useState<MiniSection>("Dashboard");
  const [miniSidebarOpen, setMiniSidebarOpen] = useState(true);
  const [miniSearchOpen, setMiniSearchOpen] = useState(false);
  const [miniSearchQuery, setMiniSearchQuery] = useState("");
  const [miniNotificationOpen, setMiniNotificationOpen] = useState(false);
  const [miniNotificationCount, setMiniNotificationCount] = useState(2);
  const [navbarNotificationOpen, setNavbarNotificationOpen] = useState(false);
  const [navbarNotificationCount, setNavbarNotificationCount] = useState(2);
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

  const chooseTheme = (nextTheme: "dark" | "light") => setPreference(nextTheme);
  const chooseStyle = (style: ThemePreference) => setPreference(style);
  const toggleMainSidebar = () => {
    if (window.matchMedia("(max-width: 980px)").matches) {
      setSidebarOpen((open) => !open);
      return;
    }
    setSidebarCollapsed((collapsed) => !collapsed);
  };

  useFocusTrap(modalDialogRef, modalOpen);
  useFocusTrap(commandDialogRef, commandOpen);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setModalOpen(false);
        setCommandOpen(false);
        setSidebarOpen(false);
        setOpenControl(null);
        setProfileMenuOpen(false);
        setNavbarNotificationOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    localStorage.setItem("kinetic-view-density", viewDensity);
  }, [viewDensity]);

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
  const calendarDays = useMemo(
    () => createCalendarMonth(calendarView.year, calendarView.month),
    [calendarView],
  );
  const calendarEventCount = calendarDays.filter(
    (date) => !date.muted && calendarEvents.has(date.value),
  ).length;
  const moveCalendarMonth = (amount: number) => {
    setCalendarView((current) => {
      const nextMonth = new Date(current.year, current.month + amount, 1);
      return { year: nextMonth.getFullYear(), month: nextMonth.getMonth() };
    });
  };
  const miniView = miniViews[miniSection];
  const miniCards = miniView.cards.filter((card) =>
    card.label.toLowerCase().includes(miniSearchQuery.toLowerCase()),
  );
  const chooseMiniSection = (section: MiniSection) => {
    setMiniSection(section);
    setMiniSelectedCard(null);
    setMiniSearchQuery("");
    setMiniNotificationOpen(false);
    setMiniProfileOpen(false);
  };

  return (
    <div
      className={`ui-kit ${theme} density-${viewDensity} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      onClick={() => {
        setOpenControl(null);
        setProfileMenuOpen(false);
        setNavbarNotificationOpen(false);
      }}
    >
      <button
        className={`mobile-scrim ${sidebarOpen ? "is-visible" : ""}`}
        aria-label="Close menu"
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`} id="main-sidebar">
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
          <Avatar label={profileSignedIn ? "AD" : "?"} name={profileSignedIn ? "Alvin de Mesa" : "Guest"} />
          <span>
            <strong>{profileSignedIn ? "Alvin de Mesa" : "Signed out"}</strong>
            <small>{profileSignedIn ? "Product developer" : "Guest mode"}</small>
          </span>
          <button
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
            <div className="sidebar-profile-card" id="sidebar-profile-menu" role="menu">
              <div className="profile-card-identity">
                <Avatar />
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
                  setProfileMenuOpen(false);
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
                  setProfileMenuOpen(false);
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
                  setProfileMenuOpen(false);
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

      <div className="app-column">
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
                  className="navbar-notification-menu"
                  id="navbar-notifications"
                  role="dialog"
                  aria-label="Notifications"
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
                        setNavbarNotificationOpen(false);
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
                        setNavbarNotificationOpen(false);
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
                    <button type="button" onClick={() => setNavbarNotificationOpen(false)}>
                      Close notifications
                    </button>
                  </footer>
                </section>
              )}
            </div>
            <Avatar size="small" />
          </div>
        </header>

        <main className="content-shell">
          <section className="hero" id="overview">
            <div className="hero-copy">
              <span className="eyebrow">
                <Sparkles size={14} /> Skeuomorphic React template
              </span>
              <h1>
                <span className="hero-title-lead">Interfaces</span> with
                <br />
                <em>physical presence.</em>
              </h1>
              <p>
                A practical component system for your Windows apps: tactile controls, restrained depth,
                responsive behavior, and matching dark and light materials.
              </p>
              <div className="hero-actions">
                <button
                  className="button button-primary"
                  onClick={() =>
                    document.querySelector("#foundation")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Component size={17} /> Explore components
                </button>
                <button className="button button-secondary" onClick={() => setModalOpen(true)}>
                  <Eye size={17} /> Open modal
                </button>
              </div>
            </div>
            <div className="hero-device" aria-label="Skeuomorphic control preview">
              <span className="hero-device-shine" />
              <button className="device-button" aria-label="Previous">
                <ChevronLeft size={24} />
              </button>
              <div className="device-display">
                <span className="display-pulse" />
                <div>
                  <small>ACTIVE SESSION</small>
                  <strong>00:22:22</strong>
                </div>
                <span className="orange-line" />
              </div>
            </div>
          </section>

          <div className="metrics-row">
            <article className="metric-card">
              <span className="metric-icon orange">
                <Component size={18} />
              </span>
              <div>
                <small>Components</small>
                <strong>32</strong>
              </div>
              <span className="trend positive">+8 new</span>
            </article>
            <article className="metric-card">
              <span className="metric-icon blue">
                <Zap size={18} />
              </span>
              <div>
                <small>Interactions</small>
                <strong>18</strong>
              </div>
              <span className="trend">Keyboard ready</span>
            </article>
            <article className="metric-card">
              <span className="metric-icon green">
                <CheckCircle2 size={18} />
              </span>
              <div>
                <small>Theme coverage</small>
                <strong>100%</strong>
              </div>
              <span className="trend positive">Light + dark</span>
            </article>
          </div>

          <Section
            id="foundation"
            eyebrow="01 · Foundation"
            title="Tokens that define the material"
            description="A warm neutral palette, orange signal color, and dual-font hierarchy designed for compact desktop interfaces."
          >
            <div className="foundation-grid">
              <article className="panel palette-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Color palette</h3>
                    <p>Semantic tokens shared by both themes.</p>
                  </div>
                  <Palette size={19} />
                </div>
                <div className="swatch-grid">
                  {palette.map((color) => (
                    <button
                      className="swatch"
                      key={color.name}
                      onClick={() => navigator.clipboard?.writeText(color.value)}
                      aria-label={`Copy ${color.value}`}
                    >
                      <span style={{ background: color.value }} />
                      <strong>{color.name}</strong>
                      <small>{color.value}</small>
                      <Copy size={13} />
                    </button>
                  ))}
                </div>
              </article>
              <article className="panel type-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Typography</h3>
                    <p>Display character plus readable utility text.</p>
                  </div>
                  <Type size={19} />
                </div>
                <div className="font-sample display-font">
                  <span>DISPLAY · DotGothic16</span>
                  <strong>Human Interface</strong>
                  <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789</p>
                </div>
                <div className="font-sample body-font">
                  <span>BODY · Geist Sans</span>
                  <strong>Clear at every size</strong>
                  <p>Interface copy, metadata, tables, and form labels.</p>
                </div>
                <div className="font-note">
                  <AlertTriangle size={15} />
                  <p>
                    <strong>Font used in the first logo recreation:</strong> Arial/Helvetica for normal UI
                    text. The LED timer was a custom CSS dot-matrix, not an installed font.
                  </p>
                </div>
              </article>
            </div>
          </Section>

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
                  <button className="button button-danger" onClick={() => toast.success("Demo item deleted")}>
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
                    <Toggle checked={notifications} onChange={setNotifications} label="Notifications" />
                  </div>
                  <div className="switch-row">
                    <span>
                      <strong>Anonymous analytics</strong>
                      <small>Help improve the application</small>
                    </span>
                    <Toggle checked={analytics} onChange={setAnalytics} label="Anonymous analytics" />
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
            </div>
            <div className="component-grid three-column">
              <article className="panel profile-card">
                <div className="cover-strip" />
                <Avatar size="large" />
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
                  <Sparkles size={19} />
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
                <div className="chat-feed">
                  <div className="message incoming">
                    <Avatar size="small" label="MI" name="Mika" />
                    <div>
                      <p>The new component set looks solid. Is light mode ready?</p>
                      <span>10:42 PM</span>
                    </div>
                  </div>
                  <div className="message outgoing">
                    <div>
                      <p>Yes, both themes use the same depth and material rules.</p>
                      <span>10:43 PM · Read</span>
                    </div>
                  </div>
                </div>
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
              <article className="panel calendar-card" aria-label="Schedule calendar">
                <div className="calendar-header">
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Previous calendar month"
                    onClick={() => moveCalendarMonth(-1)}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div>
                    <strong>{formatCalendarMonth(calendarView.year, calendarView.month)}</strong>
                    <span>
                      {calendarEventCount} scheduled {calendarEventCount === 1 ? "event" : "events"}
                    </span>
                  </div>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Next calendar month"
                    onClick={() => moveCalendarMonth(1)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="calendar-weekdays" aria-hidden="true">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                    <span key={`${day}-${index}`}>{day}</span>
                  ))}
                </div>
                <div
                  className="calendar-grid"
                  role="group"
                  aria-label={formatCalendarMonth(calendarView.year, calendarView.month)}
                >
                  {calendarDays.map((date) => (
                    <button
                      className={`${date.muted ? "muted" : ""} ${date.today ? "today" : ""} ${date.event ? "has-event" : ""} ${date.value === calendarSelection ? "selected" : ""}`}
                      type="button"
                      aria-label={date.value}
                      aria-pressed={date.value === calendarSelection}
                      key={date.value}
                      onClick={() => {
                        setCalendarSelection(date.value);
                        if (date.muted) setCalendarView({ year: date.year, month: date.month });
                      }}
                    >
                      {date.day}
                    </button>
                  ))}
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
                      onChange={(event) => setMiniSearchQuery(event.target.value)}
                    />
                  )}
                  <button
                    className={`icon-button ${miniSearchOpen ? "active" : ""}`}
                    type="button"
                    aria-label={miniSearchOpen ? "Close preview search" : "Search preview"}
                    aria-pressed={miniSearchOpen}
                    onClick={() => {
                      setMiniSearchOpen((open) => !open);
                      if (miniSearchOpen) setMiniSearchQuery("");
                    }}
                  >
                    <Search size={16} />
                  </button>
                  <button
                    className="icon-button mini-notification-button"
                    type="button"
                    aria-label={`${miniNotificationCount} preview notifications`}
                    aria-expanded={miniNotificationOpen}
                    onClick={() => {
                      setMiniNotificationOpen((open) => !open);
                      setMiniProfileOpen(false);
                    }}
                  >
                    <Bell size={16} />
                    {miniNotificationCount > 0 && <i>{miniNotificationCount}</i>}
                  </button>
                  <button
                    className="mini-avatar-button"
                    type="button"
                    aria-label="Open preview profile"
                    aria-expanded={miniProfileOpen}
                    onClick={() => {
                      setMiniProfileOpen((open) => !open);
                      setMiniNotificationOpen(false);
                    }}
                  >
                    <Avatar size="small" />
                  </button>
                </div>
                {miniNotificationOpen && (
                  <div className="mini-menu mini-notifications" role="status">
                    <strong>Notifications</strong>
                    <p>Component review is ready.</p>
                    <p>Two teammates joined the workspace.</p>
                    <button type="button" onClick={() => setMiniNotificationCount(0)}>
                      Mark all as read
                    </button>
                  </div>
                )}
                {miniProfileOpen && (
                  <div className="mini-menu mini-profile-menu">
                    <strong>Alvin de Mesa</strong>
                    <small>Product developer</small>
                    <button type="button" onClick={() => chooseMiniSection("Team")}>
                      View team
                    </button>
                    <button type="button" onClick={() => chooseMiniSection("Settings")}>
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
            <Suspense
              fallback={
                <div className="panel charts-placeholder">
                  <LoaderCircle className="large-spinner" size={23} />
                  <div>
                    <strong>Loading component library</strong>
                    <p>The reusable component examples are loading.</p>
                  </div>
                </div>
              }
            >
              <ComponentCatalog />
            </Suspense>
          </Section>

          <Section
            id="data"
            eyebrow="04 · Data"
            title="Tables and information density"
            description="Readable structured data with search, sorting affordances, filters, and semantic status."
          >
            <article className="panel table-panel">
              <div className="table-toolbar">
                <div>
                  <h3>Project files</h3>
                  <p>4 active interface modules</p>
                </div>
                <div>
                  <div className="input-shell has-icon table-search">
                    <Search size={15} />
                    <input
                      placeholder="Filter modules..."
                      value={tableQuery}
                      onChange={(event) => setTableQuery(event.target.value)}
                    />
                  </div>
                  <button className="button button-secondary compact">
                    <Filter size={15} /> Filter
                  </button>
                  <button
                    className="button button-primary compact"
                    onClick={() => toast.success("Module added")}
                  >
                    <Plus size={15} /> Add module
                  </button>
                </div>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <button>
                          Name <ArrowUpDown size={13} />
                        </button>
                      </th>
                      <th>Owner</th>
                      <th>Status</th>
                      <th>Updated</th>
                      <th>Size</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.name}>
                        <td>
                          <span className="file-type">
                            <FileText size={16} />
                          </span>
                          <strong>{row.name}</strong>
                        </td>
                        <td>
                          <span className="owner-cell">
                            <Avatar size="small" label={row.initials} name={row.avatarName} />
                            {row.owner}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={row.status} />
                        </td>
                        <td>{row.updated}</td>
                        <td>{row.size}</td>
                        <td>
                          <button className="icon-button" aria-label={`Actions for ${row.name}`}>
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
            <div id="charts" className="charts-heading">
              <span>Chart library</span>
              <h3>Eight responsive visualizations</h3>
              <p>
                Recharts-powered examples using the same theme tokens, custom tooltip, and material surfaces.
              </p>
            </div>
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
          </Section>

          <Section
            id="states"
            eyebrow="05 · States"
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
              <button className="button button-secondary" onClick={() => setModalOpen(false)}>
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
              <button onClick={() => chooseTheme(theme === "dark" ? "light" : "dark")}>
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
    </div>
  );
}
