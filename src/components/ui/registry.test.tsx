import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Button } from "./button";
import { componentRegistry } from "./registry";

describe("shadcn-style component registry", () => {
  it("tracks every component in the official catalog", () => {
    expect(componentRegistry).toHaveLength(64);
    expect(new Set(componentRegistry).size).toBe(componentRegistry.length);
    expect(componentRegistry).toContain("Data Table");
    expect(componentRegistry).toContain("Typography");
  });

  it("renders generated primitives and compound controls", async () => {
    render(
      <>
        <Button>Save changes</Button>
        <Accordion type="single" collapsible>
          <AccordionItem value="details">
            <AccordionTrigger>Details</AccordionTrigger>
            <AccordionContent>Accessible content</AccordionContent>
          </AccordionItem>
        </Accordion>
      </>,
    );
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
    await userEvent.click(screen.getByRole("button", { name: "Details" }));
    expect(screen.getByText("Accessible content")).toBeVisible();
  });
});
