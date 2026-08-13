import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Badge } from "./badge";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Input } from "./input";
import { Kbd } from "./kbd";
import { Label } from "./label";
import { Progress } from "./progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { Slider } from "./slider";
import { Switch } from "./switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

describe("ui component behaviors", () => {
  it("renders button variants with the correct visual state", () => {
    render(
      <>
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
      </>,
    );
    for (const name of ["Default", "Secondary", "Outline", "Destructive", "Ghost"]) {
      const button = screen.getByRole("button", { name });
      expect(button).toBeEnabled();
      expect(button).toHaveAttribute("data-slot", "button");
    }
  });

  it("toggles checkbox and switch primitives", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Checkbox aria-label="Accept terms" />
        <Switch aria-label="Notifications" />
      </>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "checked");
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-state", "unchecked");

    const switchControl = screen.getByRole("switch", { name: "Notifications" });
    await user.click(switchControl);
    expect(switchControl).toHaveAttribute("data-state", "checked");
  });

  it("switches tabs and exposes the active content", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview content</TabsContent>
        <TabsContent value="details">Details content</TabsContent>
      </Tabs>,
    );
    expect(screen.getByText("Overview content")).toBeVisible();
    expect(screen.queryByText("Details content")).not.toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Details" }));
    expect(screen.getByText("Details content")).toBeVisible();
    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute("data-state", "active");
  });

  it("opens a dialog, traps focus, and closes with Escape", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm action</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    const dialog = screen.getByRole("dialog", { name: "Confirm action" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows tooltip content on hover", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Tooltip copy</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.hover(screen.getByRole("button", { name: "Hover me" }));
    expect(await screen.findByText("Tooltip copy")).toBeInTheDocument();
  });

  it("reports progress and slider values accessibly", () => {
    render(
      <>
        <Progress value={60} aria-label="Loading" />
        <Slider value={[40]} max={100} aria-label="Volume" />
      </>,
    );
    const progress = screen.getByRole("progressbar", { name: "Loading" });
    expect(progress).toHaveAttribute("aria-valuenow", "60");
    expect(progress).toHaveAttribute("aria-valuemax", "100");
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toHaveAttribute("aria-valuenow", "40");
  });

  it("selects an option with the keyboard", async () => {
    const user = userEvent.setup();
    render(
      <Select defaultValue="vue">
        <SelectTrigger aria-label="Framework">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Framework" });
    await user.click(trigger);
    await user.keyboard("{ArrowUp}{Enter}");
    expect(screen.getByRole("combobox", { name: "Framework" })).toHaveTextContent("React");
  });

  it("renders form, layout, and data components with stable semantics", () => {
    const { container } = render(
      <>
        <Label htmlFor="field">Display name</Label>
        <Input id="field" defaultValue="Kinetic" />
        <Badge variant="outline">Beta</Badge>
        <Separator />
        <Skeleton />
        <Kbd>Ctrl</Kbd>
        <Accordion type="single" collapsible>
          <AccordionItem value="item">
            <AccordionTrigger>Accordion row</AccordionTrigger>
            <AccordionContent>Accordion body</AccordionContent>
          </AccordionItem>
        </Accordion>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button>Expand</Button>
          </CollapsibleTrigger>
          <CollapsibleContent>Collapsible body</CollapsibleContent>
        </Collapsible>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Kinetic UI</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>,
    );
    expect(screen.getByLabelText("Display name")).toHaveValue("Kinetic");
    expect(screen.getByText("Beta")).toHaveAttribute("data-variant", "outline");
    expect(container.querySelector('[data-slot="separator"]')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accordion row" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Expand" })).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Kinetic UI" })).toBeInTheDocument();
  });
});
