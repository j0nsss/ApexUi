"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-label text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-code text-primary text-body border border-default px-3 py-2 placeholder:text-muted transition-colors duration-75 focus:border-accent focus:outline-none disabled:opacity-40 ${className}`}
          {...props}
        />
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export { TextInput };
export type { TextInputProps };
