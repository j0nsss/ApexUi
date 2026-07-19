import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 border border-default bg-card">
      <h3 className="text-h3 text-primary">{title}</h3>
      {description && (
        <p className="text-body text-secondary text-center max-w-sm">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export { EmptyState };
export type { EmptyStateProps };
