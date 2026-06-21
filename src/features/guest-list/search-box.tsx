"use client";

import { Search } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="relative w-full md:w-64">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-outline" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar presente..."
        className="w-full rounded-xl border-2 border-outline-variant bg-surface-container-lowest py-3 pr-4 pl-10 transition-colors focus:border-secondary focus:ring-0"
      />
    </div>
  );
}
