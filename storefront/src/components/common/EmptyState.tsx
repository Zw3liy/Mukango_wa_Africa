import React from "react";
import { PackageOpen } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-[#F7F5F0]/60 rounded border border-[#D4B896]/30 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#8B6F47] mb-4">
        {icon || <PackageOpen className="w-8 h-8 stroke-[1.5]" />}
      </div>
      <h3 className="font-serif text-2xl text-[#4F2607] mb-2">{title}</h3>
      <p className="text-sm font-light text-stone-600 mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
