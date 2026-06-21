"use client";

import { cn } from "@/shared/lib/cn";

export type PriceRange = "todos" | "ate100" | "100a300" | "acima300";

const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "ate100", label: "Até R$ 100" },
  { value: "100a300", label: "R$ 100 - R$ 300" },
  { value: "acima300", label: "R$ 300+" },
];

interface PriceFilterProps {
  value: PriceRange;
  onChange: (value: PriceRange) => void;
}

export function PriceFilter({ value, onChange }: PriceFilterProps) {
  return (
    <div className="flex flex-col gap-2" role="group" aria-label="Filtrar por faixa de preço">
      <span className="px-1 text-sm font-bold text-primary">Filtrar por Preço</span>
      <div className="flex flex-wrap gap-2">
        {PRICE_RANGES.map((range) => (
          <button
            key={range.value}
            type="button"
            onClick={() => onChange(range.value)}
            className={cn(
              "rounded-full border-2 px-4 py-2 text-sm font-bold transition-all",
              value === range.value
                ? "border-primary bg-primary text-on-primary"
                : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
            )}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
