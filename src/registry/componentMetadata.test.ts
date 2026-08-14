import { describe, expect, it } from "vitest";
import { componentMetadata, componentMetadataByName } from "./componentMetadata";
import { componentRegistry } from "@/components/ui/registry";

describe("component metadata registry", () => {
  it("has one metadata record for every public registry entry", () => {
    expect(componentMetadata).toHaveLength(componentRegistry.length);
    expect(new Set(componentMetadata.map((item) => item.name)).size).toBe(componentRegistry.length);
    expect(componentMetadata.every((item) => item.source.startsWith("src/components/ui/"))).toBe(true);
  });

  it("provides searchable metadata by component name", () => {
    expect(componentMetadataByName.get("Calendar")).toMatchObject({
      category: "content",
      example: "#calendar",
    });
    expect(componentMetadataByName.get("Date Picker")?.searchTerms).toContain("date-picker");
  });
});
