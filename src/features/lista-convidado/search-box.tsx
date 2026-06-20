"use client";

import { Search } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar presente..."
        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-outline-variant focus:border-secondary focus:ring-0 transition-colors bg-surface-container-lowest"
      />
    </div>
  );
}
