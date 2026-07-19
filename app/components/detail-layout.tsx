"use client";

import { motion } from "framer-motion";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { usePanelStore } from "@/lib/store";
import { panelVariants, panelTransition } from "@/lib/motion-variants";
import { useReducedMotion } from "@/lib/motion-context";
import type { ReactNode } from "react";

const PANEL_A_WIDTH = 240;
const PANEL_C_WIDTH = 380;

interface DetailLayoutProps {
  panelA: ReactNode;
  panelB: ReactNode;
  panelC: ReactNode;
}

function DetailLayout({ panelA, panelB, panelC }: DetailLayoutProps) {
  const { panelAOpen, panelCOpen, togglePanelA, togglePanelC } = usePanelStore();
  const { shouldAnimate } = useReducedMotion();

  const aWidth = panelAOpen ? PANEL_A_WIDTH : 0;
  const cWidth = panelCOpen ? PANEL_C_WIDTH : 0;

  return (
    <div
      className="hidden lg:grid min-h-[calc(100vh-73px)]"
      style={{ gridTemplateColumns: `${aWidth}px 1fr ${cWidth}px` }}
    >
      <motion.div
        className="relative border-r border-default overflow-hidden"
        variants={shouldAnimate ? panelVariants : undefined}
        initial={false}
        animate={{ width: aWidth, opacity: panelAOpen ? 1 : 0 }}
        transition={shouldAnimate ? panelTransition : { duration: 0 }}
      >
        <div style={{ width: PANEL_A_WIDTH }} className="h-full">
          {panelA}
        </div>

        <div className="absolute right-0 top-4 -mr-3 z-10">
          <IconButton
            icon={panelAOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
            label={panelAOpen ? "Close navigator" : "Open navigator"}
            size={16}
            onClick={togglePanelA}
          />
        </div>
      </motion.div>

      <div className="relative overflow-auto border-r border-default">
        {panelB}
        {!panelCOpen && (
          <div className="absolute right-0 top-4 -mr-3 z-10">
            <IconButton
              icon={<PanelRightOpen size={16} />}
              label="Open code editor"
              size={16}
              onClick={togglePanelC}
            />
          </div>
        )}
      </div>

      <motion.div
        className="relative overflow-hidden"
        variants={shouldAnimate ? panelVariants : undefined}
        initial={false}
        animate={{ width: cWidth, opacity: panelCOpen ? 1 : 0 }}
        transition={shouldAnimate ? panelTransition : { duration: 0 }}
      >
        <div style={{ width: PANEL_C_WIDTH }} className="h-full">
          {panelC}
        </div>

        <div className="absolute left-0 top-4 -ml-3 z-10">
          <IconButton
            icon={panelCOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            label={panelCOpen ? "Close code editor" : "Open code editor"}
            size={16}
            onClick={togglePanelC}
          />
        </div>
      </motion.div>
    </div>
  );
}

export { DetailLayout };
