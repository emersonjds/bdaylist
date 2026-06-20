import { apiSend } from "@/shared/lib/http";
import type { AuthUser } from "./auth-context";

/**
 * Entrypoint de autenticação com Google.
 * Hoje chama o endpoint mock; no futuro, substitua o corpo por:
 * `supabase.auth.signInWithOAuth({ provider: "google" })`
 */
export async function signInWithGoogle(): Promise<AuthUser> {
  const data = await apiSend<{ user: AuthUser }>("/api/auth/google", {
    method: "POST",
  });
  return data.user;
}
