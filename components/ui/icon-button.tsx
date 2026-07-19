"use client";

import { forwardRef, cloneElement } from "react";
import type { ButtonHTMLAttributes, ReactElement } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactElement;
  label: string;
  size?: 16 | 20 | 24;
}

const sizeMap = {
  16: "w-6 h-6",
  20: "w-8 h-8",
  24: "w-10 h-10",
};

const iconSizeMap = {
  16: 16,
  20: 20,
  24: 24,
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = 20, className = "", ...props }, ref) => {
    const sizedIcon = cloneElement(icon, {
      size: iconSizeMap[size],
      strokeWidth: 1.5,
      "aria-hidden": true,
    });

    return (
      <button
        ref={ref}
        aria-label={label}
        className={`inline-flex items-center justify-center border border-default bg-transparent text-secondary hover:text-primary hover:border-accent transition-colors duration-75 disabled:opacity-40 ${sizeMap[size]} ${className}`}
        {...props}
      >
        {sizedIcon}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export { IconButton };
export type { IconButtonProps };
