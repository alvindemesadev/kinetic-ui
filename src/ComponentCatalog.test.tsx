import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ComponentCatalog from "./ComponentCatalog";

describe("ComponentCatalog showcase", () => {
  it("renders the reference examples in the shared page system", () => {
    render(<ComponentCatalog />);
    expect(screen.getByLabelText("Skeuomorphic component library")).toBeInTheDocument();
    for (const title of [
      "Actions, feedback & loading",
      "Form controls",
      "OTP & popover",
      "Navigation",
      "Disclosure & selection",
      "Loading & typography",
      "Dialogs, sheets & drawers",
      "Menus, search & selection",
      "Inputs, toggles & identity",
      "Content & empty states",
      "Layout, carousel & scrolling",
    ]) {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    }
    expect(screen.queryByText("Table & structured data")).not.toBeInTheDocument();
  });

  it("keeps the shared form controls and verification input available", () => {
    render(<ComponentCatalog />);
    expect(screen.getByLabelText("Project name")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Verification code" })).toBeInTheDocument();
  });

  it("defaults the alert notification channel to active", () => {
    render(<ComponentCatalog />);
    expect(screen.getByRole("button", { name: "Alerts" })).toHaveAttribute("data-state", "on");
    expect(screen.getByRole("button", { name: "Updates" })).toHaveAttribute("data-state", "off");
  });

  it("marks the current pagination page as active", () => {
    render(<ComponentCatalog />);
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("link", { name: "2" })).not.toHaveAttribute("data-active");
  });

  it("selects a framework from the select with the keyboard", async () => {
    const user = userEvent.setup();
    render(<ComponentCatalog />);
    const trigger = screen.getByRole("combobox", { name: "Framework" });
    await user.click(trigger);
    await user.keyboard("{ArrowDown}{Enter}");
    expect(screen.getByText("Vue")).toBeInTheDocument();
  });

  it("opens and closes the edit profile dialog", async () => {
    const user = userEvent.setup();
    render(<ComponentCatalog />);
    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(screen.getByRole("dialog", { name: "Edit profile" })).toBeInTheDocument();
    expect(screen.getByLabelText("Display name")).toHaveValue("Alvin de Mesa");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("switches tabs and exposes the tooltip on hover", async () => {
    const user = userEvent.setup();
    render(<ComponentCatalog />);
    const activityTab = screen.getByRole("tab", { name: "Activity" });
    activityTab.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByLabelText("Activity completion")).toBeInTheDocument();

    await user.hover(screen.getByRole("button", { name: "Hover for details" }));
    expect(await screen.findByText("Accessible tooltip content")).toHaveClass("sidebar-matched-tooltip");
  });

  it("lays out resizable panels and a scrollable region", () => {
    render(<ComponentCatalog />);
    expect(screen.getAllByText("Navigation").length).toBeGreaterThan(0);
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByLabelText("Scrollable component rows")).toBeInTheDocument();
    expect(screen.getByText("Scrollable component row 1")).toBeInTheDocument();
  });
});
