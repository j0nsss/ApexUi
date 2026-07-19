import type { ReactNode } from "react";

interface ChartTileProps {
  title: string;
  children: ReactNode;
  className?: string;
}

function ChartTile({ title, children, className = "" }: ChartTileProps) {
  return (
    <div className={`bg-card border border-default p-5 ${className}`}>
      <h3 className="text-label text-primary mb-4">{title}</h3>
      {children}
    </div>
  );
}

export { ChartTile };
