"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface FaqItem {
  id: string;
  pergunta: string;
  resposta: string;
}

interface FaqProps {
  items: FaqItem[];
}

export function Faq({ items }: FaqProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-outline-variant bg-white transition-all"
          >
            <button
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between p-6 text-left text-sm font-bold text-on-surface"
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span>{item.pergunta}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-base text-on-surface-variant">{item.resposta}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
