import { useState } from "react";
import { CatalogActions } from "@/sections/catalog/CatalogActions";
import { CatalogContent } from "@/sections/catalog/CatalogContent";
import { CatalogFeedback } from "@/sections/catalog/CatalogFeedback";
import { CatalogForms } from "@/sections/catalog/CatalogForms";
import { CatalogNavigation } from "@/sections/catalog/CatalogNavigation";
import { CatalogOverlays } from "@/sections/catalog/CatalogOverlays";

export default function ComponentCatalog() {
  const [enabled, setEnabled] = useState(true);
  const [completion, setCompletion] = useState([62]);
  const [framework, setFramework] = useState("react");

  return (
    <div className="catalog-shell" aria-label="Skeuomorphic component library">
      <div className="catalog-demo-grid">
        <CatalogActions />
        <CatalogForms
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
