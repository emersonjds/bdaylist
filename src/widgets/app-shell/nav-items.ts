import { Home, Gift, Users, User } from "lucide-react";

export interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: typeof Home;
}

// Gifts/guests/profile ainda vivem no painel único; manter o href em /dashboard
// evita 404 até cada tela existir. Trocar pelos paths reais quando criados.
export const NAV_ITEMS: readonly NavItem[] = [
  { id: "home", href: "/dashboard", label: "Início", icon: Home },
  { id: "gifts", href: "/dashboard", label: "Presentes", icon: Gift },
  { id: "guests", href: "/dashboard", label: "Convidados", icon: Users },
  { id: "profile", href: "/dashboard", label: "Perfil", icon: User },
] as const;
