"use client";

import { useRouter, useParams } from "next/navigation";

interface NavComponent {
  slug: string;
  name: string;
  category: string;
}

interface CategoryNavigatorProps {
  allComponents: NavComponent[];
}

function CategoryNavigator({ allComponents }: CategoryNavigatorProps) {
  const router = useRouter();
  const params = useParams();
  const activeSlug = params.slug as string;

  const grouped: Record<string, NavComponent[]> = {};

  for (const c of allComponents) {
    if (!grouped[c.category]) grouped[c.category] = [];
    grouped[c.category].push(c);
  }

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <div className="py-2">
      {sortedCategories.map((category) => (
        <div key={category}>
          <p className="px-4 py-2 text-small text-secondary uppercase tracking-wider">{category}</p>
          {grouped[category].map((comp) => {
            const isActive = comp.slug === activeSlug;
            return (
              <button
                key={comp.slug}
                onClick={() => router.push(`/components/${comp.slug}`)}
                className={`w-full text-left px-4 py-2 text-label transition-colors duration-75 ${
                  isActive
                    ? "border-l-2 border-accent bg-code text-primary"
                    : "border-l-2 border-transparent text-secondary hover:text-primary hover:bg-code"
                }`}
              >
                {comp.name}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export { CategoryNavigator };
