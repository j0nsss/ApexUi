"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-primary border-accent hover:bg-accent-dim focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 active:opacity-90 disabled:bg-card disabled:text-muted disabled:border-default disabled:opacity-100",
  secondary:
    "bg-card text-primary border-default hover:border-accent hover:text-primary focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 active:bg-code disabled:opacity-40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-label",
  md: "px-4 py-2 text-body font-semibold",
  lg: "px-6 py-3 text-body font-semibold",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center border border-solid transition-colors duration-75 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
