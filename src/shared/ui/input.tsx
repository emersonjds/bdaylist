"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ className, label, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-on-surface">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "rounded-md border-2 border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-on-surface transition-colors placeholder:text-outline focus:border-secondary focus:ring-0 focus:outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}
