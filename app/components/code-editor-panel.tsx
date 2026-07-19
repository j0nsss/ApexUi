"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Check, Copy } from "lucide-react";
import { FlatTab } from "@/components/ui/flat-tab";
import type { CodeVariant } from "@/lib/types";
import type { FlatTabItem } from "@/components/ui/flat-tab";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const languageMap: Record<string, string> = {
  html: "html",
  tailwind: "html",
  "react-tsx": "typescript",
};

function defineApexUITheme(monaco: typeof import("monaco-editor")) {
  monaco.editor.defineTheme("apexui-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "A31D1D", fontStyle: "bold" },
      { token: "string", foreground: "C8A97E" },
      { token: "number", foreground: "A8C4E0" },
      { token: "comment", foreground: "5A5C63", fontStyle: "italic" },
      { token: "tag", foreground: "D4A5A5" },
      { token: "attribute.name", foreground: "9A9BA0" },
      { token: "attribute.value", foreground: "C8A97E" },
    ],
    colors: {
      "editor.background": "#1E222B",
      "editor.foreground": "#F5F2EB",
      "editor.lineHighlightBackground": "#262930",
      "editorLineNumber.foreground": "#5A5C63",
      "editorGutter.background": "#1E222B",
      "editor.selectionBackground": "#A31D1D40",
      "editorCursor.foreground": "#A31D1D",
      "scrollbarSlider.background": "#26293080",
      "scrollbarSlider.hoverBackground": "#A31D1D80",
    },
  });
}

interface CodeEditorPanelProps {
  codeVariants: CodeVariant[];
  componentId: string;
}

function CodeEditorPanel({ codeVariants, componentId }: CodeEditorPanelProps) {
  const [activeLang, setActiveLang] = useState(codeVariants[0]?.language ?? "html");
  const [copied, setCopied] = useState(false);

  const tabs: FlatTabItem[] = codeVariants.map((v) => ({
    label: v.language,
    value: v.language,
  }));

  const activeVariant = codeVariants.find((v) => v.language === activeLang);
  const code = activeVariant?.code_template ?? "";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);

    fetch("/api/analytics/copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        component_id: componentId,
        language: activeLang,
        session_id: crypto.randomUUID(),
      }),
    });

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code, componentId, activeLang]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-default">
        <FlatTab tabs={tabs} activeTab={activeLang} onChange={setActiveLang} />
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 mr-2 text-label border border-default text-secondary hover:text-primary hover:border-accent transition-colors duration-75"
        >
          {copied ? (
            <>
              <Check size={14} strokeWidth={1.5} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} strokeWidth={1.5} />
              Copy Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          language={languageMap[activeLang] ?? "plaintext"}
          value={code}
          theme="apexui-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            renderWhitespace: "boundary",
            wordWrap: "on",
          }}
          beforeMount={defineApexUITheme}
          loading={
            <div className="flex items-center justify-center h-full bg-code">
              <div className="w-5 h-5 border border-muted animate-spin" />
            </div>
          }
        />
      </div>
    </div>
  );
}

export { CodeEditorPanel };
