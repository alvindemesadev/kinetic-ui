import { render, screen } from "@testing-library/react";
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
});
