import { render, screen } from "@testing-library/react";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ComponentCatalog from "./ComponentCatalog";

describe("ComponentCatalog showcase", () => {
  it("renders the library summary and every demo block", () => {
    render(<ComponentCatalog />);
    expect(screen.getByLabelText("Skeuomorphic component library")).toBeInTheDocument();
    expect(screen.getByText("Skeuomorphic component library")).toBeInTheDocument();
    for (const title of [
      "Actions & feedback",
      "Form controls",
      "Date, OTP & popover",
      "Navigation",
      "Disclosure & selection",
      "Loading & typography",
      "Dialogs, sheets & drawers",
      "Menus, search & selection",
      "Inputs, toggles & identity",
      "Content, messages & empty states",
      "Layout, carousel & scrolling",
      "Table & structured data",
    ]) {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    }
  });

  it("toggles the checkbox and switch controls", async () => {
    const user = userEvent.setup();
    render(<ComponentCatalog />);
    const checkbox = screen.getByRole("checkbox", { name: "Sync automatically" });
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();

    const switchControl = screen.getByRole("switch", { name: "Notifications" });
    await user.click(switchControl);
    expect(switchControl).toHaveAttribute("data-state", "unchecked");
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

  it("uses the Kinetic date picker in the date primitives card", async () => {
    const user = userEvent.setup();
    render(<ComponentCatalog />);
    const trigger = screen.getByRole("button", { name: "Date picker, 08/12/2026" });

    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Choose a date" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Month" })).toHaveValue("7");
    expect(screen.getByRole("combobox", { name: "Year" })).toHaveValue("2026");
    expect(screen.getByRole("gridcell", { name: "2026-08-12" })).toHaveAttribute("aria-selected", "true");
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

  it("renders the structured data table with all rows", () => {
    render(<ComponentCatalog />);
    const tableDemo = document.querySelector<HTMLElement>(".catalog-table-demo");
    expect(tableDemo).toBeInTheDocument();

    const table = within(tableDemo as HTMLElement);
    expect(table.getByRole("table")).toBeInTheDocument();
    expect(table.getByRole("columnheader", { name: /Name/ })).toBeInTheDocument();
    expect(table.getByRole("cell", { name: /Control Surface/ })).toBeInTheDocument();
    expect(table.getByRole("cell", { name: /Command Palette/ })).toBeInTheDocument();
    expect(table.getByRole("cell", { name: /Analytics Module/ })).toBeInTheDocument();
    expect(table.getByRole("cell", { name: /Profile Drawer/ })).toBeInTheDocument();
    expect(table.getByRole("textbox", { name: "Filter modules" })).toBeInTheDocument();
  });

  it("opens row actions with view, edit, and delete choices", async () => {
    const user = userEvent.setup();
    render(<ComponentCatalog />);
    const actions = screen.getByRole("button", { name: "Actions for Control Surface" });

    await user.click(actions);

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "View" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute("data-variant", "destructive");
  });
});
