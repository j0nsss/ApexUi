"use client";

import { useEffect, useCallback } from "react";
import type { ComponentFull, CodeVariant } from "@/lib/types";
import { DetailLayout } from "./detail-layout";
import { CategoryNavigator } from "./category-navigator";
import { LivePreviewCanvas } from "./live-preview-canvas";
import { CodeEditorPanel } from "./code-editor-panel";
import { CustomizerPanel } from "./customizer-panel";
import { MobileDetailLayout } from "./mobile-detail-layout";
import { usePanelStore } from "@/lib/store";
import { useCustomizerStore } from "@/lib/store";
import { useIsMobile } from "@/hooks/use-media-query";
import { useRandomData } from "@/hooks/use-random-data";
import { interpolate } from "@/lib/interpolate";

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
  const isMobile = useIsMobile();
  const { panelCTab, setPanelCTab } = usePanelStore();
  const params = useCustomizerStore((s) => s.params);
  const setParam = useCustomizerStore((s) => s.setParam);
  const { loading, generate } = useRandomData();

  useEffect(() => {
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        route: `/components/${component.slug}`,
        session_id: crypto.randomUUID(),
      }),
    });
  }, [component.slug]);

  const handleGenerateRandomData = useCallback(() => {
    if (!component.random_data_schema) return;
    generate(component.random_data_schema, component.category, (json) => {
      setParam("__random_data", json);
    });
  }, [component.random_data_schema, component.category, generate, setParam]);

  const interpolatedVariants = codeVariants.map((v) => ({
    ...v,
    code_template: interpolate(v.code_template, params),
  }));

  if (isMobile) {
    return (
      <MobileDetailLayout
        component={component}
        codeVariants={interpolatedVariants}
        dataLoading={loading}
        onGenerateRandomData={handleGenerateRandomData}
      />
    );
  }

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
        panelB={
          <LivePreviewCanvas
            component={component}
            dataLoading={loading}
            onGenerateRandomData={handleGenerateRandomData}
          />
        }
        panelC={
          <div className="flex flex-col h-full">
            <div className="flex border-b border-default">
              <button
                onClick={() => setPanelCTab("code")}
                className={`px-4 py-2 text-body border border-transparent border-b-0 transition-colors duration-75 ${
                  panelCTab === "code"
                    ? "text-primary border-default border-b-2 border-b-accent"
                    : "text-secondary hover:text-primary"
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setPanelCTab("customize")}
                className={`px-4 py-2 text-body border border-transparent border-b-0 transition-colors duration-75 ${
                  panelCTab === "customize"
                    ? "text-primary border-default border-b-2 border-b-accent"
                    : "text-secondary hover:text-primary"
                }`}
              >
                Customize
              </button>
            </div>

            {panelCTab === "code" && (
              <CodeEditorPanel codeVariants={interpolatedVariants} componentId={component.id} />
            )}
            {panelCTab === "customize" && component.customizer_schema && (
              <CustomizerPanel schema={component.customizer_schema} slug={component.slug} />
            )}
          </div>
        }
      />
    </div>
  );
}

export { DetailShell };
