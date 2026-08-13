import {
  Activity,
  BarChart3,
  Component,
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
  { label: "Foundation", href: "#foundation", icon: Palette },
  { label: "Controls", href: "#controls", icon: SlidersHorizontal },
  { label: "Components", href: "#components", icon: Component },
  { label: "Data", href: "#data", icon: BarChart3 },
  { label: "States", href: "#states", icon: Activity },
];
