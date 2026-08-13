import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { siReact, siVite } from "simple-icons";
import { describe, expect, it, vi } from "vitest";
import {
  AuthCard,
  ButtonStateShowcase,
  DatePicker,
  FrameworkCombobox,
  InfiniteLogoCarousel,
  LoadingButton,
  TimePicker,
  SwitchControl,
} from ".";

describe("reusable controls", () => {
  it("reports and changes switch state", async () => {
    const onChange = vi.fn();
    render(<SwitchControl checked={false} onChange={onChange} label="Notifications" />);
    const control = screen.getByRole("switch", { name: "Notifications" });
    expect(control).toHaveAttribute("aria-checked", "false");
    await userEvent.click(control);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("selects a combobox option with the keyboard", async () => {
    function Example() {
      const [value, setValue] = useState("");
      const [open, setOpen] = useState(false);
      return (
        <FrameworkCombobox
          value={value}
          onChange={setValue}
          isOpen={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
        />
      );
    }
    render(<Example />);
    const input = screen.getByRole("combobox", { name: "Framework" });
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(input).toHaveValue("Vue");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("moves through the date grid with arrow keys", async () => {
    render(<DatePicker value="2026-08-12" onChange={vi.fn()} isOpen onToggle={vi.fn()} onClose={vi.fn()} />);
    const selectedDay = await screen.findByRole("gridcell", { name: "2026-08-12" });
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("gridcell", { name: "2026-08-13" })).toHaveFocus();
    expect(selectedDay).toHaveAttribute("aria-selected", "true");
  });

  it("selects a month, year, and day directly", async () => {
    function Example() {
      const [value, setValue] = useState("2026-08-12");
      return <DatePicker value={value} onChange={setValue} isOpen onToggle={vi.fn()} onClose={vi.fn()} />;
    }
    render(<Example />);
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Month" }), "1");
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Year" }), "2030");
    await userEvent.click(screen.getByRole("gridcell", { name: "2030-02-14" }));
    expect(screen.getByRole("button", { name: "Date picker, 02/14/2030" })).toBeVisible();
  });

  it("accepts typed hour and minute values", async () => {
    function Example() {
      const [value, setValue] = useState("22:22");
      return <TimePicker value={value} onChange={setValue} isOpen onToggle={vi.fn()} onClose={vi.fn()} />;
    }
    render(<Example />);
    const hour = screen.getByRole("textbox", { name: "Hour" });
    const minute = screen.getByRole("textbox", { name: "Minute" });
    await userEvent.clear(hour);
    await userEvent.type(hour, "07{Enter}");
    await userEvent.clear(minute);
    await userEvent.type(minute, "45{Enter}");
    expect(screen.getByRole("button", { name: "Time picker, 07:45" })).toBeVisible();
  });

  it("supports 12-hour input with an AM and PM selector", async () => {
    function Example() {
      const [value, setValue] = useState("23:22");
      return <TimePicker value={value} onChange={setValue} isOpen onToggle={vi.fn()} onClose={vi.fn()} />;
    }
    render(<Example />);
    await userEvent.click(screen.getByRole("radio", { name: "12H" }));
    expect(screen.getByRole("textbox", { name: "Hour" })).toHaveValue("11");
    expect(screen.getByRole("radio", { name: "PM" })).toBeChecked();

    await userEvent.click(screen.getByRole("radio", { name: "AM" }));
    expect(screen.getByRole("button", { name: "Time picker, 11:22 AM" })).toBeVisible();
  });

  it("renders an accessible infinite logo track and lets users pause it", async () => {
    render(
      <InfiniteLogoCarousel
        items={[
          { name: "React", icon: siReact },
          { name: "Vite", icon: siVite },
        ]}
      />,
    );

    expect(screen.getByRole("region", { name: "Featured technologies" })).toBeVisible();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    const pause = screen.getByRole("button", { name: "Pause logos" });
    expect(pause.querySelector("svg")).toBeInTheDocument();
    await userEvent.click(pause);
    const resume = screen.getByRole("button", { name: "Resume logos" });
    expect(resume).toHaveAttribute("aria-pressed", "true");
    expect(resume.querySelector("svg")).toBeInTheDocument();
  });

  it("submits the login card and toggles password visibility", async () => {
    const onSubmit = vi.fn();
    render(<AuthCard mode="login" onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Email address"), "alvin@example.com");
    const password = screen.getByLabelText("Password");
    await userEvent.type(password, "kinetic12");
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    await userEvent.click(screen.getByRole("checkbox", { name: "Remember me" }));
    await userEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: undefined,
      email: "alvin@example.com",
      password: "kinetic12",
      remember: true,
    });
  });

  it("validates matching passwords before submitting signup", async () => {
    const onSubmit = vi.fn();
    render(<AuthCard mode="signup" onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Full name"), "Alvin de Mesa");
    await userEvent.type(screen.getByLabelText("Email address"), "alvin@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "kinetic12");
    const confirmation = screen.getByLabelText("Confirm password");
    await userEvent.type(confirmation, "different12");
    await userEvent.click(screen.getByRole("checkbox", { name: "I agree to the terms" }));
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Passwords do not match.");
    expect(onSubmit).not.toHaveBeenCalled();

    await userEvent.clear(confirmation);
    await userEvent.type(confirmation, "kinetic12");
    await userEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("locks action buttons and announces their loading state", async () => {
    let finishAction: (() => void) | undefined;
    const onAction = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishAction = resolve;
        }),
    );
    render(
      <LoadingButton loadingText="Saving" minimumLoadingTime={0} onAction={onAction}>
        Save template
      </LoadingButton>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Save template" }));
    const loadingButton = screen.getByRole("button", { name: "Saving" });
    expect(loadingButton).toBeDisabled();
    expect(loadingButton).toHaveAttribute("aria-busy", "true");
    finishAction?.();
    await waitFor(() => expect(screen.getByRole("button", { name: "Save template" })).not.toBeDisabled());
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("documents the complete semantic button state set", () => {
    render(<ButtonStateShowcase />);

    expect(screen.getAllByRole("button")).toHaveLength(10);
    expect(screen.getByRole("button", { name: "Creating" })).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Created" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Try again" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
    expect(screen.getAllByRole("button", { name: "Create" }).at(-1)).toBeDisabled();
  });
});
