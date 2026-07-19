"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface MotionContextValue {
  shouldAnimate: boolean;
}

const MotionContext = createContext<MotionContextValue>({ shouldAnimate: true });

export function MotionProvider({ children }: { children: ReactNode }) {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldAnimate(!mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      setShouldAnimate(!e.matches);
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return <MotionContext.Provider value={{ shouldAnimate }}>{children}</MotionContext.Provider>;
}

export function useReducedMotion(): MotionContextValue {
  return useContext(MotionContext);
}
