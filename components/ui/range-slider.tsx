"use client";

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label?: string;
}

const RangeSlider = ({ value, onChange, min, max, step, label }: RangeSliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-label text-secondary">{label}</label>}
      <div className="relative h-2 bg-border-default">
        <div
          className="absolute top-0 left-0 h-full bg-accent transition-none"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={label}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary border border-default"
          style={{ left: `${percentage}%`, marginLeft: "-6px" }}
        />
      </div>
      <div className="flex justify-between text-label text-muted">
        <span>{min}</span>
        <span>{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export { RangeSlider };
export type { RangeSliderProps };
