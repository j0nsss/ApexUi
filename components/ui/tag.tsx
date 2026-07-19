interface TagProps {
  label: string;
  variant?: "default" | "accent";
}

const Tag = ({ label, variant = "default" }: TagProps) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-label border border-solid ${
        variant === "accent" ? "border-accent text-accent" : "border-default text-secondary"
      }`}
    >
      {label}
    </span>
  );
};

export { Tag };
export type { TagProps };
