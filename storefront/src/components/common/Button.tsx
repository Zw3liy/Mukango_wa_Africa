import React from "react";
import { cn } from "../../utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none text-center";

    const variantStyles = {
      primary:
        "bg-[#4F2607] text-[#FAF9F6] hover:bg-[#6E3B13] active:bg-[#381B05] border border-transparent shadow-sm",
      secondary:
        "bg-[#8B6F47] text-[#FAF9F6] hover:bg-[#A88B63] active:bg-[#725A37] border border-transparent",
      outline:
        "bg-transparent text-[#2D2A26] border border-[#D4B896] hover:border-[#4F2607] hover:bg-[#F7F5F0]",
      ghost:
        "bg-transparent text-[#2D2A26] hover:bg-[#F7F5F0] hover:text-[#4F2607] border border-transparent",
      danger:
        "bg-[#C02B0A] text-white hover:bg-red-700 active:bg-red-800 border border-transparent",
    };

    const sizeStyles = {
      sm: "text-xs tracking-wider uppercase px-3 py-1.5 rounded-sm gap-1.5",
      md: "text-sm tracking-wide px-5 py-2.5 rounded-sm gap-2",
      lg: "text-base tracking-wide px-8 py-3.5 rounded-sm gap-2.5 font-medium",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
