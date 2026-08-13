import {
  Activity,
  BarChart3,
  Component,
  Gauge,
  LibraryBig,
  LayoutDashboard,
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
  { label: "Reference", href: "/library", icon: LibraryBig },
  { label: "Data", href: "#data", icon: BarChart3 },
  { label: "States", href: "#states", icon: Activity },
];
