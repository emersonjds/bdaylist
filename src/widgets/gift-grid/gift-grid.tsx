import type { ReactNode } from "react";

interface GiftGridProps {
  children: ReactNode;
}

export function GiftGrid({ children }: GiftGridProps) {
  return <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
