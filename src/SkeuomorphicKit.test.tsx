import { fireEvent, render, screen } from "@testing-library/react";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import SkeuomorphicKit from "./SkeuomorphicKit";

describe("SkeuomorphicKit shell", () => {
  it("renders the brand, navigation, and hero content", () => {
    render(<SkeuomorphicKit />);
    expect(screen.getAllByText("Kinetic UI").length).toBeGreaterThan(0);
    expect(screen.getByRole("navigation", { name: "Component sections" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Overview" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("64").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("starts in light mode by default and switches themes from the mode toggle", async () => {
    const user = userEvent.setup();
    render(<SkeuomorphicKit />);
    const root = screen.getAllByText("Kinetic UI")[0].closest(".ui-kit");
    expect(root).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");

    const lightButton = screen.getByRole("button", { name: "Light mode" });
    const darkButton = screen.getByRole("button", { name: "Dark mode" });
    expect(lightButton).toHaveAttribute("aria-pressed", "true");
    expect(darkButton).toHaveAttribute("aria-pressed", "false");

    await user.click(darkButton);
    expect(root).toHaveClass("dark");
    expect(root).not.toHaveClass("light");
    expect(document.documentElement).toHaveClass("dark");

    await user.click(lightButton);
    expect(root).toHaveClass("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("opens the profile menu and keeps it keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<SkeuomorphicKit />);
    const profileButton = screen.getByRole("button", { name: "Profile menu" });
    await user.click(profileButton);
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Profile/i })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens the command menu with Ctrl+K", async () => {
    const user = userEvent.setup();
    render(<SkeuomorphicKit />);
    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByText("Kinetic command")).toBeInTheDocument();
    expect(screen.getByText("Export design tokens")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Kinetic command")).not.toBeInTheDocument();
  });

  it("renders the shared sections with their headings", () => {
    render(<SkeuomorphicKit />);
    for (const heading of [
      "Tokens that define the material",
      "Surfaces, communication, and navigation",
      "Every state accounted for",
    ]) {
      expect(screen.getAllByRole("heading", { name: heading }).length).toBeGreaterThan(0);
    }
  });

  it("provides a functional calendar month and agenda view", async () => {
    const user = userEvent.setup();
    render(<SkeuomorphicKit />);
    const calendar = document.querySelector<HTMLElement>("#calendar");
    expect(calendar).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Calendar that feels tactile" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Calendar view mode" }));
    await user.click(screen.getByRole("menuitemradio", { name: /^Week/ }));
    expect(screen.getByText("Seven-day view")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Calendar view mode" }));
    await user.click(screen.getByRole("menuitemradio", { name: /^Month/ }));

    await user.click(screen.getByRole("button", { name: /2026-08-12/ }));
    expect(screen.getByText("Wednesday, August 12, 2026")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add event" }));
    const eventDialog = screen.getByRole("dialog", { name: "Add event" });
    await user.click(within(eventDialog).getByRole("button", { name: /Time picker/ }));
    expect(screen.getByRole("dialog", { name: "Choose a time" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    // The lazy catalog's resizable panels attach a document-level pointerdown
    // listener whose hit-test, under jsdom's mocked layout, can steal focus to
    // the resizable handle between userEvent's focus click and its keystrokes.
    // Type via fireEvent to avoid the pointer interaction entirely.
    fireEvent.change(screen.getByLabelText("Event title"), { target: { value: "Team sync" } });
    await user.click(screen.getByRole("button", { name: "Save event" }));
    expect((await screen.findAllByText("Team sync")).length).toBeGreaterThanOrEqual(2);
  });
});
