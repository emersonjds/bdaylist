"use client";

import { LogIn } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useAuth } from "./use-auth";

interface LoginCTAProps {
  title?: string;
  description?: string;
}

export function LoginCTA({
  title = "Acesse sua conta",
  description = "Entre com sua conta Google para gerenciar sua lista de presentes.",
}: LoginCTAProps) {
  const { signInWithGoogle } = useAuth();

  return (
    <Card className="flex flex-col items-center gap-6 p-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-extrabold text-on-surface">{title}</h2>
        <p className="text-on-surface-variant">{description}</p>
      </div>
      <Button onClick={() => void signInWithGoogle()} size="lg">
        <LogIn className="h-5 w-5" />
        Entrar com Google
      </Button>
    </Card>
  );
}
