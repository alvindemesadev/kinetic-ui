import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import { CatalogActions } from "@/sections/catalog/CatalogActions";
import { CatalogContent } from "@/sections/catalog/CatalogContent";
import { CatalogFeedback } from "@/sections/catalog/CatalogFeedback";
import { CatalogForms } from "@/sections/catalog/CatalogForms";
import { CatalogNavigation } from "@/sections/catalog/CatalogNavigation";
import { CatalogOverlays } from "@/sections/catalog/CatalogOverlays";

export default function ComponentCatalog() {
  const [date, setDate] = useState<Date | undefined>(() => new Date(2026, 7, 12));
  const [enabled, setEnabled] = useState(true);
  const [completion, setCompletion] = useState([62]);
  const [framework, setFramework] = useState("react");

  return (
    <div className="catalog-shell" aria-label="Skeuomorphic component library">
      <div className="catalog-summary">
        <div>
          <Badge variant="secondary">Reusable primitives</Badge>
          <TypographyH3>Skeuomorphic component library</TypographyH3>
          <TypographyMuted>
            Working, keyboard-accessible components styled with the same physical materials as the template.
          </TypographyMuted>
        </div>
      </div>

      <div className="catalog-demo-grid">
        <CatalogActions />
        <CatalogForms
          date={date}
          setDate={setDate}
          enabled={enabled}
          setEnabled={setEnabled}
          completion={completion}
          setCompletion={setCompletion}
          framework={framework}
          setFramework={setFramework}
        />
        <CatalogNavigation />
        <CatalogFeedback />
        <CatalogOverlays enabled={enabled} setEnabled={setEnabled} />
        <CatalogContent />
      </div>
    </div>
  );
}
