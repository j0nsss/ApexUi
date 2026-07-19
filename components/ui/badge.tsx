interface BadgeProps {
  count: number;
  max?: number;
}

const Badge = ({ count, max = 999 }: BadgeProps) => {
  const display = count > max ? `${max}+` : String(count);

  return (
    <span className="inline-flex items-center px-1.5 py-0.5 bg-code text-label text-secondary">
      {display}
    </span>
  );
};

export { Badge };
export type { BadgeProps };
