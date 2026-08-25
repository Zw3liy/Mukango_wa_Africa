import React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "teak" | "charcoal" | "outline" | "success";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "default",
  size = "sm",
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium uppercase tracking-widest rounded-xs";

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  const variantStyles = {
    default: "bg-[#F7F5F0] text-[#4F2607] border border-[#D4B896]/40",
    gold: "bg-[#D4B896]/20 text-[#7A6039] border border-[#D4B896]",
    teak: "bg-[#8B6F47] text-[#FAF9F6]",
    charcoal: "bg-[#2D2A26] text-[#FAF9F6]",
    outline: "bg-transparent border border-current text-[#4F2607]",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  };

  return (
    <span className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
};
