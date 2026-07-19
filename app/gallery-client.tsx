"use client";

import { useState, useEffect } from "react";
import { BentoGrid } from "@/components/ui/bento-grid";
import { BentoCell } from "@/components/ui/bento-cell";
import { GalleryFilters } from "./gallery-filters";
import { MobileCatalogCard } from "./components/mobile-catalog-card";
import { useIsMobile } from "@/hooks/use-media-query";
import type { ComponentMeta } from "@/lib/types";

interface GalleryClientProps {
  components: ComponentMeta[];
}

function GalleryClient({ components }: GalleryClientProps) {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        route: "/",
        session_id: crypto.randomUUID(),
      }),
    });
  }, []);

  const categories = Array.from(new Set(components.map((c) => c.category))).sort();

  const filtered = activeCategory
    ? components.filter((c) => c.category === activeCategory)
    : components;

  return (
    <>
      <GalleryFilters
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <main>
        {isMobile ? (
          <div className="border-b border-default">
            {filtered.map((component) => (
              <MobileCatalogCard key={component.id} component={component} />
            ))}
          </div>
        ) : (
          <BentoGrid>
            {filtered.map((component) => (
              <BentoCell key={component.id} component={component} />
            ))}
          </BentoGrid>
        )}
      </main>
    </>
  );
}

export { GalleryClient };
