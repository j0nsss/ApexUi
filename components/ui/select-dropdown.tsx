"use client";

interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  label?: string;
}

const SelectDropdown = ({ value, onChange, options, label }: SelectDropdownProps) => {
  const id = label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-label text-secondary">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-code text-primary text-body border border-default px-3 py-2 transition-colors duration-75 focus:border-accent focus:outline-none disabled:opacity-40"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export { SelectDropdown };
export type { SelectDropdownProps };
