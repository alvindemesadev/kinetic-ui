import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "./useTheme";

function ThemeExample() {
  const { theme, preference, setPreference } = useTheme();
  return <button onClick={() => setPreference("dark")}>{`${preference}:${theme}`}</button>;
}

describe("useTheme", () => {
  beforeEach(() => localStorage.clear());

  it("defaults to the system preference and persists explicit choices", async () => {
    render(<ThemeExample />);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("system:light");
    await userEvent.click(button);
    expect(button).toHaveTextContent("dark:dark");
    expect(localStorage.getItem("kinetic-theme")).toBe("dark");
  });

  it("observes operating-system theme changes while using system mode", () => {
    let listener: (() => void) | undefined;
    let matches = false;
    vi.stubGlobal("matchMedia", () => ({
      get matches() {
        return matches;
      },
      addEventListener: (_event: string, nextListener: () => void) => {
        listener = nextListener;
      },
      removeEventListener: vi.fn(),
    }));
    render(<ThemeExample />);
    expect(screen.getByRole("button")).toHaveTextContent("system:light");
    matches = true;
    act(() => listener?.());
    expect(screen.getByRole("button")).toHaveTextContent("system:dark");
    vi.unstubAllGlobals();
  });
});
