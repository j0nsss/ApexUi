"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { CommandPalette } from "./components/command-palette";

interface CommandProviderProps {
  children: ReactNode;
}

function CommandProvider({ children }: CommandProviderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {children}
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export { CommandProvider };
