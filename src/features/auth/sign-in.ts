import { apiSend } from "@/shared/lib/http";
import type { AuthUser } from "./auth-context";

const DEMO_USER: AuthUser = {
  id: "host-1",
  nome: "Rodrigo",
  email: "rodrigo@example.com",
  avatarUrl: "",
};

/**
 * Entrypoint de autenticação com Google.
 * Hoje chama o endpoint mock; no futuro, substitua o corpo por:
 * `supabase.auth.signInWithOAuth({ provider: "google" })`
 *
 * Ainda não há login Google/backend real: se a chamada falhar, entra com um
 * usuário de demonstração para não bloquear o teste da ferramenta.
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  try {
    const data = await apiSend<{ user: AuthUser }>("/api/auth/google", {
      method: "POST",
    });
    return data.user;
  } catch {
    return DEMO_USER;
  }
}
