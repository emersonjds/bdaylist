import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "shadow-card rounded-lg border border-outline-variant/30 bg-surface-container-lowest",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
