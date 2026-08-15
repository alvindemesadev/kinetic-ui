import { useCallback, useEffect, useState } from "react";
import type { ThemePreference } from "../components";

export type Theme = "dark" | "light";
const storageKey = "kinetic-theme";
const mediaQuery = "(prefers-color-scheme: dark)";

function getStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored === "dark" || stored === "light" || stored === "system" ? stored : "system";
  } catch {
    return "system";
  }
}

function resolveTheme(preference: ThemePreference, prefersDark: boolean): Theme {
  return preference === "system" ? (prefersDark ? "dark" : "light") : preference;
}

export function useTheme() {
  const [preference, setPreferenceState] = useState<ThemePreference>(getStoredPreference);
  const [theme, setTheme] = useState<Theme>(() =>
    resolveTheme(getStoredPreference(), typeof matchMedia === "function" && matchMedia(mediaQuery).matches),
  );

  useEffect(() => {
    if (typeof matchMedia !== "function") return;
    const media = matchMedia(mediaQuery);
    const sync = () => setTheme(resolveTheme(preference, media.matches));
    sync();
    if (preference === "system") media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [preference]);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    try {
      localStorage.setItem(storageKey, nextPreference);
    } catch {
      // The in-memory preference still works when storage is unavailable.
    }
    setPreferenceState(nextPreference);
  }, []);

  return { theme, preference, setPreference };
}
