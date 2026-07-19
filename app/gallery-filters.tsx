"use client";

interface GalleryFiltersProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const GalleryFilters = ({ categories, activeCategory, onCategoryChange }: GalleryFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-default">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-3 py-1.5 text-label border border-solid transition-colors duration-75 ${
          activeCategory === null
            ? "border-accent text-accent"
            : "border-default text-secondary hover:text-primary hover:border-accent"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-3 py-1.5 text-label border border-solid capitalize transition-colors duration-75 ${
            activeCategory === cat
              ? "border-accent text-accent"
              : "border-default text-secondary hover:text-primary hover:border-accent"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export { GalleryFilters };
