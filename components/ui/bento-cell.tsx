"use client";

import { useRouter } from "next/navigation";
import { Tag } from "./tag";
import { Badge } from "./badge";

interface ComponentMeta {
  id: string;
  slug: string;
  name: string;
  category: string;
  bento_size: "1x1" | "2x1" | "2x2";
  copy_count: number;
  description?: string;
}

interface BentoCellProps {
  component: ComponentMeta;
}

const sizeClasses: Record<string, string> = {
  "1x1": "col-span-1 row-span-1",
  "2x1": "col-span-1 sm:col-span-2 row-span-1",
  "2x2": "col-span-1 sm:col-span-2 row-span-1 sm:row-span-2",
};

function MiniPreview({ category }: { category: string }) {
  switch (category) {
    case "table":
      return (
        <div className="w-full space-y-0.5">
          <div className="flex gap-1">
            <div className="h-2 flex-1 bg-border-default" />
            <div className="h-2 flex-1 bg-border-default" />
            <div className="h-2 flex-1 bg-border-default" />
          </div>
          <div className="h-1.5 w-full bg-code" />
          <div className="h-1.5 w-full bg-code" />
          <div className="h-1.5 w-3/4 bg-code" />
        </div>
      );
    case "chart":
      return (
        <div className="flex items-end gap-0.5 h-12 w-full">
          <div className="flex-1 bg-accent/60" style={{ height: "60%" }} />
          <div className="flex-1 bg-accent/60" style={{ height: "80%" }} />
          <div className="flex-1 bg-accent/60" style={{ height: "45%" }} />
          <div className="flex-1 bg-accent/60" style={{ height: "90%" }} />
          <div className="flex-1 bg-accent/60" style={{ height: "70%" }} />
        </div>
      );
    case "navigation":
      return (
        <div className="flex items-center gap-1 w-full">
          <div className="w-12 h-3 bg-accent/60" />
          <div className="w-8 h-3 bg-border-default" />
          <div className="w-8 h-3 bg-border-default" />
        </div>
      );
    case "bento":
      return (
        <div className="grid grid-cols-2 gap-0.5 w-full">
          <div className="col-span-2 h-6 bg-accent/20 border border-border-default" />
          <div className="h-6 bg-card border border-border-default" />
          <div className="h-6 bg-card border border-border-default" />
        </div>
      );
    default:
      return null;
  }
}

const BentoCell = ({ component }: BentoCellProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/components/${component.slug}`)}
      className={`group relative flex flex-col border-b border-r border-default bg-card p-4 text-left transition-colors duration-80 hover:border-accent cursor-pointer ${sizeClasses[component.bento_size]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <Tag label={component.category} />
        <Badge count={component.copy_count} />
      </div>

      <div className="flex-1 flex items-center justify-center min-h-[60px] px-2">
        <MiniPreview category={component.category} />
      </div>

      <h3 className="text-sm font-medium text-primary mt-3 group-hover:text-accent transition-colors duration-80">
        {component.name}
      </h3>
    </button>
  );
};

export { BentoCell };
export type { ComponentMeta };
