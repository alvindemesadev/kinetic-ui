import { Component, LayoutDashboard, Settings, Users, type LucideIcon } from "lucide-react";
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

export type MiniSection = "Dashboard" | "Components" | "Team" | "Settings";

export const miniNavigation: Array<{ label: MiniSection; icon: LucideIcon }> = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Components", icon: Component },
  { label: "Team", icon: Users },
  { label: "Settings", icon: Settings },
];

export const miniViews: Record<
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

export const palette = [
  { name: "Obsidian", value: "#111315" },
  { name: "Graphite", value: "#26292C" },
  { name: "Porcelain", value: "#F3F1EA" },
  { name: "Signal", value: "#FF6A2A" },
  { name: "Ember", value: "#E34D18" },
  { name: "Success", value: "#45B87F" },
  { name: "Warning", value: "#E8A33D" },
  { name: "Info", value: "#559BFF" },
];

export const carouselSlides = [
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

export const logoCarouselItems = [
  { name: "React", icon: siReact },
  { name: "TypeScript", icon: siTypescript },
  { name: "Vite", icon: siVite },
  { name: "Tailwind CSS", icon: siTailwindcss },
  { name: "shadcn/ui", icon: siShadcnui },
  { name: "Radix UI", icon: siRadixui },
  { name: "Figma", icon: siFigma },
  { name: "GitHub", icon: siGithub },
];

export const tableRows = [
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

export function calendarDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatCalendarMonth(year: number, month: number) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
}

export function createCalendarMonth(year: number, month: number) {
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
    };
  });
}
