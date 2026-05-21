import { cn } from "@/lib/utils";
import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "gold";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-crunkie-red text-crunkie-white hover:bg-crunkie-chocolate border border-crunkie-red hover:border-crunkie-chocolate",
  secondary:
    "bg-transparent text-crunkie-red border border-crunkie-red hover:bg-crunkie-red hover:text-crunkie-white",
  ghost:
    "bg-transparent text-crunkie-dark border border-transparent hover:border-crunkie-cream",
  dark: "bg-crunkie-dark text-crunkie-white border border-crunkie-dark hover:bg-crunkie-chocolate hover:border-crunkie-chocolate",
  gold: "bg-crunkie-gold text-crunkie-dark border border-crunkie-gold hover:bg-crunkie-chocolate hover:text-crunkie-white hover:border-crunkie-chocolate",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs tracking-widest",
  md: "px-6 py-3 text-sm tracking-widest",
  lg: "px-8 py-4 text-sm tracking-widest",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-sans font-semibold uppercase transition-all duration-300",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
}
