import {
  Activity,
  BarChart3,
  CalendarDays,
  Columns3,
  Component,
  Gauge,
  LibraryBig,
  ListTodo,
  LayoutDashboard,
  Milestone,
  PanelsTopLeft,
  Palette,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navigation: NavigationItem[] = [
  { label: "Overview", href: "#overview", icon: LayoutDashboard },
  { label: "Stats", href: "#stats", icon: Gauge },
  { label: "Foundation", href: "#foundation", icon: Palette },
  { label: "Controls", href: "#controls", icon: SlidersHorizontal },
  { label: "Components", href: "#components", icon: Component },
  { label: "Calendar", href: "#calendar", icon: CalendarDays },
  { label: "Kanban", href: "#kanban", icon: Columns3 },
  { label: "Timeline", href: "#timeline", icon: Milestone },
  { label: "To-do List", href: "#todo", icon: ListTodo },
  { label: "Overlays", href: "#overlays", icon: PanelsTopLeft },
  { label: "Reference", href: "#reference", icon: LibraryBig },
  { label: "Data", href: "#data", icon: BarChart3 },
  { label: "States", href: "#states", icon: Activity },
];
