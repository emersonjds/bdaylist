import { apiSend } from "@/shared/lib/http";
import type { AuthUser } from "./auth-context";

const DEMO_USER: AuthUser = {
  id: "host-1",
  name: "Rodrigo",
  email: "rodrigo@example.com",
  avatarUrl: "",
};

/**
 * Google sign-in entrypoint.
 * Currently calls the mock endpoint; replace the body with:
 * `supabase.auth.signInWithOAuth({ provider: "google" })` when ready.
 *
 * If the call fails (no real backend yet), falls back to a demo user
 * so the tool can still be exercised end-to-end.
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
