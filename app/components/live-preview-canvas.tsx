"use client";

import { useState } from "react";
import type { ComponentFull } from "@/lib/types";

type ViewportMode = "desktop" | "tablet" | "mobile";

const viewportWidths: Record<ViewportMode, string> = {
  desktop: "w-full",
  tablet: "max-w-[768px]",
  mobile: "max-w-[375px]",
};

const viewportLabels: Record<ViewportMode, string> = {
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile",
};

interface LivePreviewCanvasProps {
  component: ComponentFull;
  disableViewportToggles?: boolean;
}

function LivePreviewCanvas({ component, disableViewportToggles }: LivePreviewCanvasProps) {
  const [mode, setMode] = useState<ViewportMode>("desktop");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-4 py-2 border-b border-default">
        {(Object.keys(viewportWidths) as ViewportMode[]).map((v) => (
          <button
            key={v}
            onClick={() => !disableViewportToggles && setMode(v)}
            className={`px-3 py-1 text-label border border-solid transition-colors duration-75 ${
              disableViewportToggles
                ? "border-default text-muted opacity-40 cursor-default"
                : mode === v
                  ? "border-accent text-accent"
                  : "border-default text-secondary hover:text-primary hover:border-accent"
            }`}
          >
            {viewportLabels[v]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto flex items-start justify-center p-8">
        <div className={`w-full ${viewportWidths[mode]}`}>
          <div
            className="min-h-[200px] border border-default flex items-center justify-center p-8"
            style={{
              backgroundColor: "#16181D",
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%23262930'/%3E%3C/svg%3E")`,
            }}
          >
            <div className="text-center">
              <p className="text-h3 text-primary">{component.name}</p>
              <p className="text-body text-secondary mt-2">{component.description ?? ""}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { LivePreviewCanvas };
