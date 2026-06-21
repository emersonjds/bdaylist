"use client";

import { useEffect, useState, type ReactNode } from "react";

interface MswProviderProps {
  children: ReactNode;
}

export function MswProvider({ children }: MswProviderProps) {
  // Sem backend real (Supabase) ainda: o mock é a fonte de dados para testar a
  // ferramenta. Liga por padrão em dev; em produção só quando explicitamente pedido.
  const mockingEnabled =
    process.env.NEXT_PUBLIC_API_MOCKING !== "disabled" &&
    (process.env.NEXT_PUBLIC_API_MOCKING === "enabled" ||
      process.env.NODE_ENV === "development");

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
