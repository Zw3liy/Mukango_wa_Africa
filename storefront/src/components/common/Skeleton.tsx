import React from "react";
import { cn } from "../../utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangular" | "circular" | "text";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  ...props
}) => {
  const variantStyles = {
    rectangular: "rounded-sm",
    circular: "rounded-full",
    text: "rounded-xs h-4 w-full",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-[#E5D5C5]/50",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};
