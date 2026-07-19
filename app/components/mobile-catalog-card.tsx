"use client";

import { useRouter } from "next/navigation";
import { Tag } from "@/components/ui/tag";
import type { ComponentMeta } from "@/lib/types";

function MiniPreview({ category }: { category: string }) {
  switch (category) {
    case "table":
      return (
        <div className="flex gap-1 items-end h-8">
          <div className="flex-1 h-6 bg-border-default" />
          <div className="flex-1 h-4 bg-border-default" />
          <div className="flex-1 h-7 bg-border-default" />
        </div>
      );
    case "chart":
      return (
        <div className="flex items-end gap-0.5 h-8">
          <div className="flex-1 bg-accent/60" style={{ height: "60%" }} />
          <div className="flex-1 bg-accent/60" style={{ height: "90%" }} />
          <div className="flex-1 bg-accent/60" style={{ height: "50%" }} />
          <div className="flex-1 bg-accent/60" style={{ height: "80%" }} />
        </div>
      );
    case "navigation":
      return (
        <div className="flex items-center gap-1 h-8">
          <div className="w-12 h-4 bg-accent/60" />
          <div className="w-8 h-4 bg-border-default" />
          <div className="w-8 h-4 bg-border-default" />
        </div>
      );
    case "bento":
      return (
        <div className="grid grid-cols-2 gap-0.5 h-8">
          <div className="col-span-2 h-3.5 bg-accent/20 border border-border-default" />
          <div className="h-3.5 bg-card border border-border-default" />
          <div className="h-3.5 bg-card border border-border-default" />
        </div>
      );
    default:
      return <div className="h-8 bg-code" />;
  }
}

interface MobileCatalogCardProps {
  component: ComponentMeta;
}

function MobileCatalogCard({ component }: MobileCatalogCardProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/components/${component.slug}`)}
      className="flex items-center gap-4 w-full px-4 py-3 border-b border-default bg-card text-left transition-colors duration-75 hover:bg-code"
    >
      <div className="w-16 h-12 flex items-center justify-center bg-code border border-default shrink-0">
        <MiniPreview category={component.category} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-body text-primary truncate">{component.name}</p>
        <p className="text-small text-secondary truncate mt-0.5">{component.description ?? ""}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Tag label={component.category} />
      </div>
    </button>
  );
}

export { MobileCatalogCard };
