"use client";

import type { ComponentFull, CodeVariant } from "@/lib/types";
import { DetailLayout } from "./detail-layout";
import { CategoryNavigator } from "./category-navigator";
import { LivePreviewCanvas } from "./live-preview-canvas";
import { CodeEditorPanel } from "./code-editor-panel";

interface NavComponent {
  slug: string;
  name: string;
  category: string;
}

interface DetailShellProps {
  component: ComponentFull;
  codeVariants: CodeVariant[];
  allComponents: NavComponent[];
}

function DetailShell({ component, codeVariants, allComponents }: DetailShellProps) {
  return (
    <div className="min-h-screen bg-base">
      <header className="border-b border-default px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1">{component.name}</h1>
            <p className="text-body text-secondary mt-1">
              {component.description ?? component.category}
            </p>
          </div>
        </div>
      </header>

      <DetailLayout
        panelA={<CategoryNavigator allComponents={allComponents} />}
        panelB={<LivePreviewCanvas component={component} />}
        panelC={<CodeEditorPanel codeVariants={codeVariants} componentId={component.id} />}
      />
    </div>
  );
}

export { DetailShell };
