import type { ReactNode } from "react";

interface BentoGridProps {
  children: ReactNode;
}

const BentoGrid = ({ children }: BentoGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-auto border-t border-l border-default">
      {children}
    </div>
  );
};

export { BentoGrid };
export type { BentoGridProps };
