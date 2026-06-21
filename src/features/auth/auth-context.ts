"use client";

import { createContext } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
