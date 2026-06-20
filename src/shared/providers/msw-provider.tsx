"use client";

import { useEffect, useState, type ReactNode } from "react";

interface MswProviderProps {
  children: ReactNode;
}

export function MswProvider({ children }: MswProviderProps) {
  const mockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

  const [ready, setReady] = useState(!mockingEnabled);

  useEffect(() => {
    if (!mockingEnabled) return;

    let active = true;

    import("@/mocks/browser")
      .then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }))
      .then(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, [mockingEnabled]);

  if (!ready) return <div aria-busy="true" aria-label="Carregando..." />;

  return <>{children}</>;
}
