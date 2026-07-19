"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}

const Toggle = ({ checked, onChange, label, id }: ToggleProps) => {
  const toggleId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex items-center gap-2">
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 border border-solid transition-colors duration-75 ${
          checked ? "bg-accent border-accent" : "bg-transparent border-default"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-primary transition-transform duration-75 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      {label && (
        <label htmlFor={toggleId} className="text-body text-secondary cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
};

export { Toggle };
export type { ToggleProps };
