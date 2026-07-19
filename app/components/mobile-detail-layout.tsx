"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import type { ComponentFull, CodeVariant } from "@/lib/types";
import { LivePreviewCanvas } from "./live-preview-canvas";
import { useReducedMotion } from "@/lib/motion-context";
import { sheetVariants, sheetTransition } from "@/lib/motion-variants";

interface MobileDetailLayoutProps {
  component: ComponentFull;
  codeVariants: CodeVariant[];
  dataLoading?: boolean;
  onGenerateRandomData?: () => void;
}

function MobileDetailLayout({
  component,
  codeVariants,
  dataLoading,
  onGenerateRandomData,
}: MobileDetailLayoutProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeLang, setActiveLang] = useState(codeVariants[0]?.language ?? "html");
  const { shouldAnimate } = useReducedMotion();

  const activeVariant = codeVariants.find((v) => v.language === activeLang);
  const code = activeVariant?.code_template ?? "";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);

    fetch("/api/analytics/copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        component_id: component.id,
        language: activeLang,
        session_id: crypto.randomUUID(),
      }),
    });

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code, component.id, activeLang]);

  return (
    <div className="min-h-screen bg-base flex flex-col lg:hidden">
      <header className="border-b border-default px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-body text-primary font-medium">{component.name}</h1>
            <p className="text-small text-secondary mt-0.5">{component.category}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <LivePreviewCanvas
          component={component}
          disableViewportToggles
          dataLoading={dataLoading}
          onGenerateRandomData={onGenerateRandomData}
        />
      </div>

      <div className="sticky bottom-0 border-t border-default bg-card flex">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex-1 px-4 py-3 text-label border-r border-default text-secondary hover:text-primary transition-colors duration-75"
        >
          View Code
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 px-4 py-3 text-label bg-accent text-primary transition-colors duration-75 hover:bg-accent-dim"
        >
          {copied ? (
            <span className="flex items-center justify-center gap-1.5">
              <Check size={14} strokeWidth={1.5} /> Copied
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5">
              <Copy size={14} strokeWidth={1.5} /> Copy Code
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {sheetOpen && (
          <motion.div className="fixed inset-0 z-50 flex flex-col" initial={false}>
            <div className="absolute inset-0 bg-base/80" onClick={() => setSheetOpen(false)} />

            <motion.div
              className="relative mt-auto bg-card border-t border-default flex flex-col max-h-[80vh]"
              variants={shouldAnimate ? sheetVariants : undefined}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={shouldAnimate ? sheetTransition : { duration: 0 }}
              drag={shouldAnimate ? "y" : undefined}
              dragConstraints={{ top: 0, bottom: 300 }}
              dragElastic={0.2}
              onDragEnd={(_e, info) => {
                if (info.offset.y > 200 || info.velocity.y > 500) {
                  setSheetOpen(false);
                }
              }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-default">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 rounded bg-muted mx-auto -mt-1" />
                  <div className="flex gap-1">
                    {codeVariants.map((v) => (
                      <button
                        key={v.language}
                        onClick={() => setActiveLang(v.language)}
                        className={`px-2 py-1 text-small border transition-colors duration-75 ${
                          activeLang === v.language
                            ? "border-accent text-accent"
                            : "border-default text-secondary"
                        }`}
                      >
                        {v.language}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="text-secondary hover:text-primary transition-colors duration-75"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-code p-3">
                <pre className="text-small text-primary font-jetbrains-mono whitespace-pre-wrap break-all">
                  {code}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { MobileDetailLayout };
