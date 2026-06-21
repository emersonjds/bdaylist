import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      tone: {
        primary: "bg-primary text-on-primary",
        secondary: "bg-secondary text-on-secondary",
        tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
        neutral: "bg-surface-container text-on-surface-variant",
      },
    },
    defaultVariants: {
      tone: "primary",
    },
  }
);

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
