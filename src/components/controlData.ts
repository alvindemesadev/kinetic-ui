import type { ThemePreference } from "./controls";

export const styleOptions: Array<{ value: ThemePreference; label: string; detail: string }> = [
  { value: "dark", label: "Dark skeuomorphic", detail: "Obsidian materials" },
  { value: "light", label: "Light skeuomorphic", detail: "Porcelain materials" },
  { value: "system", label: "Follow system", detail: "Match device theme" },
];

export const frameworkOptions = ["React", "Vue", "Svelte", "Solid"];
