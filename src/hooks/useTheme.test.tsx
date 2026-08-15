import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "./useTheme";

function ThemeExample() {
  const { theme, preference, setPreference } = useTheme();
  return <button onClick={() => setPreference("dark")}>{`${preference}:${theme}`}</button>;
}

function StableSetterExample() {
  const { setPreference } = useTheme();
  const [firstSetPreference] = useState(() => setPreference);
  const [, setTick] = useState(0);
  return (
    <>
      <span data-testid="identity-stable">{String(firstSetPreference === setPreference)}</span>
      <button onClick={() => setTick((current) => current + 1)}>re-render</button>
    </>
  );
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

  it("keeps setPreference referentially stable across re-renders", async () => {
    render(<StableSetterExample />);
    expect(screen.getByTestId("identity-stable")).toHaveTextContent("true");
    await userEvent.click(screen.getByRole("button", { name: "re-render" }));
    await userEvent.click(screen.getByRole("button", { name: "re-render" }));
    expect(screen.getByTestId("identity-stable")).toHaveTextContent("true");
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
