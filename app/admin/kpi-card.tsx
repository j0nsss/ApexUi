interface KpiCardProps {
  label: string;
  value: string | number;
}

function KpiCard({ label, value }: KpiCardProps) {
  return (
    <div className="bg-card border border-default p-5">
      <p className="text-small text-secondary mb-1">{label}</p>
      <p className="text-h2 text-primary">{value}</p>
    </div>
  );
}

export { KpiCard };
