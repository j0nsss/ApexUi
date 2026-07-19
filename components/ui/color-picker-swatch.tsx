"use client";

import { TextInput } from "./text-input";

interface ColorPickerSwatchProps {
  value: string;
  onChange: (value: string) => void;
  palette: string[];
  label?: string;
}

const ColorPickerSwatch = ({ value, onChange, palette, label }: ColorPickerSwatchProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-label text-secondary">{label}</label>}
      <div className="grid grid-cols-6 gap-1">
        {palette.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-7 h-7 border border-solid transition-colors duration-75 ${
              value === color
                ? "border-primary ring-1 ring-primary"
                : "border-default hover:border-secondary"
            }`}
            style={{ backgroundColor: color }}
            aria-label={color}
          />
        ))}
      </div>
      <TextInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#HEX"
        className="font-jetbrains-mono text-code uppercase"
      />
    </div>
  );
};

export { ColorPickerSwatch };
export type { ColorPickerSwatchProps };
