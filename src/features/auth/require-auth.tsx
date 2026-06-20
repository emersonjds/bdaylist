"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "./use-auth";
import { LoginCTA } from "./login-cta";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <LoginCTA />
      </div>
    );
  }

  return <>{children}</>;
}
