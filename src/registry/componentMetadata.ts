import { componentRegistry, type ComponentRegistryName } from "@/components/ui/registry";

export type ComponentCategory = "actions" | "forms" | "navigation" | "feedback" | "overlays" | "content";
export type ComponentStability = "stable" | "composed" | "planned";

export type ComponentMetadata = {
  name: ComponentRegistryName;
  slug: string;
  category: ComponentCategory;
  source: string;
  example: string;
  dependencies: string[];
  stability: ComponentStability;
  accessibility: string;
  searchTerms: string[];
};

const categoryByName: Partial<Record<ComponentRegistryName, ComponentCategory>> = {
  Accordion: "content",
  "Aspect Ratio": "content",
  Breadcrumb: "navigation",
  Button: "actions",
  "Button Group": "actions",
  Checkbox: "forms",
  Combobox: "forms",
  "Date Picker": "forms",
  Dialog: "overlays",
  Drawer: "overlays",
  "Dropdown Menu": "navigation",
  Input: "forms",
  "Input Group": "forms",
  "Input OTP": "forms",
  Menubar: "navigation",
  Popover: "overlays",
  Progress: "feedback",
  "Radio Group": "forms",
  Select: "forms",
  Sheet: "overlays",
  Slider: "forms",
  Spinner: "feedback",
  Switch: "forms",
  Table: "content",
  Tabs: "navigation",
  Toast: "feedback",
  Toggle: "actions",
  "Toggle Group": "actions",
  Tooltip: "feedback",
};

const sourceSlug = (name: ComponentRegistryName) =>
  name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();

const exampleByName: Partial<Record<ComponentRegistryName, string>> = {
  Calendar: "#calendar",
  "Data Table": "#data",
  Chart: "#data",
  "Date Picker": "#controls",
  "Input OTP": "#components",
  Message: "#components",
  "Message Scroller": "#components",
  Dialog: "#overlays",
  Drawer: "#overlays",
  Sheet: "#overlays",
  Checkbox: "#controls",
  "Radio Group": "#controls",
  Switch: "#controls",
  Progress: "#states",
  Skeleton: "#states",
  Empty: "#states",
};

const categoryExample: Record<ComponentCategory, string> = {
  actions: "#controls",
  forms: "#controls",
  navigation: "#components",
  feedback: "#states",
  overlays: "#overlays",
  content: "#reference",
};

const fallbackCategory = (name: ComponentRegistryName): ComponentCategory => {
  if (name.includes("Dialog") || name === "Drawer" || name === "Sheet" || name === "Popover")
    return "overlays";
  if (name.includes("Input") || name === "Field" || name === "Label" || name.includes("Select"))
    return "forms";
  if (name.includes("Menu") || name === "Command" || name === "Pagination" || name === "Tabs")
    return "navigation";
  if (name === "Alert" || name === "Badge" || name === "Marker" || name === "Tooltip") return "feedback";
  if (name === "Button" || name.includes("Toggle") || name === "Spinner") return "actions";
  return "content";
};

export const componentMetadata: ComponentMetadata[] = componentRegistry.map((name) => {
  const category = categoryByName[name] ?? fallbackCategory(name);
  const slug = sourceSlug(name);
  return {
    name,
    slug,
    category,
    source: `src/components/ui/${slug}.tsx`,
    example: exampleByName[name] ?? categoryExample[category],
    dependencies: ["React", "Kinetic UI tokens"],
    stability: "stable",
    accessibility: "Uses semantic markup and the primitive's keyboard/focus behavior.",
    searchTerms: [name.toLowerCase(), category, slug],
  };
});

export const componentMetadataByName = new Map(componentMetadata.map((item) => [item.name, item]));
