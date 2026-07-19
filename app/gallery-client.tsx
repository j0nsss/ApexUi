"use client";

import { useState, useEffect } from "react";
import { BentoGrid } from "@/components/ui/bento-grid";
import { BentoCell } from "@/components/ui/bento-cell";
import { GalleryFilters } from "./gallery-filters";
import type { ComponentMeta } from "@/components/ui/bento-cell";

interface GalleryClientProps {
  components: ComponentMeta[];
}

function GalleryClient({ components }: GalleryClientProps) {
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
        <BentoGrid>
          {filtered.map((component) => (
            <BentoCell key={component.id} component={component} />
          ))}
        </BentoGrid>
      </main>
    </>
  );
}

export { GalleryClient };
