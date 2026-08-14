import { useState } from "react";
import { useMemo } from "react";
import { CatalogActions } from "@/sections/catalog/CatalogActions";
import { CatalogContent } from "@/sections/catalog/CatalogContent";
import { CatalogFeedback } from "@/sections/catalog/CatalogFeedback";
import { CatalogForms } from "@/sections/catalog/CatalogForms";
import { CatalogNavigation } from "@/sections/catalog/CatalogNavigation";
import { CatalogOverlays } from "@/sections/catalog/CatalogOverlays";

import { Search } from "lucide-react";
import { componentMetadata } from "@/registry";

export default function ComponentCatalog() {
  const [enabled, setEnabled] = useState(true);
  const [completion, setCompletion] = useState([62]);
  const [framework, setFramework] = useState("react");
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return componentMetadata
      .filter((item) =>
        [item.name, item.category, item.slug, ...item.searchTerms].some((value) =>
          value.toLowerCase().includes(normalized),
        ),
      )
      .slice(0, 8);
  }, [query]);

  return (
    <div className="catalog-shell" aria-label="Skeuomorphic component library">
      <div className="catalog-reference-toolbar" role="search">
        <div>
          <strong>Browse the registry</strong>
          <small>Search source-owned components and jump to their canonical example.</small>
        </div>
        <label className="catalog-reference-search">
          <Search size={15} aria-hidden="true" />
          <span className="sr-only">Search components</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search components..."
            type="search"
            aria-label="Search components"
          />
        </label>
      </div>
      {query.trim() && (
        <div className="catalog-reference-results" aria-live="polite">
          {matches.length > 0 ? (
            matches.map((item) => (
              <a
                key={item.name}
                href={item.example}
                aria-label={`${item.name} ${item.category}`}
                onClick={() => setQuery("")}
              >
                <span>{item.name}</span>
                <small>{item.category}</small>
              </a>
            ))
          ) : (
            <p>No source-owned components match “{query}”.</p>
          )}
        </div>
      )}
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
