"use client";

import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ className, label, id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-on-surface">
          {label}
        </label>
      )}
      <textarea
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
