import type { Variants } from "framer-motion";

export const panelVariants: Variants = {
  open: { width: "240px", opacity: 1 },
  closed: { width: "0px", opacity: 0 },
};

export const panelTransition = {
  duration: 0.2,
  ease: "easeInOut" as const,
};

export const sheetVariants: Variants = {
  hidden: { y: "100%" },
  visible: { y: "0%" },
};

export const sheetTransition = {
  duration: 0.25,
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
};

export const overlayVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1.0 },
};

export const overlayTransition = {
  duration: 0.12,
  ease: "easeOut" as const,
};
