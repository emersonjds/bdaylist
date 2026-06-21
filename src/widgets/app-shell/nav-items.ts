import { Home, Gift, Users, User } from "lucide-react";

export interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: typeof Home;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: "home", href: "/dashboard", label: "Início", icon: Home },
  { id: "gifts", href: "/dashboard/gifts", label: "Presentes", icon: Gift },
  { id: "guests", href: "/dashboard/guests", label: "Convidados", icon: Users },
  { id: "profile", href: "/dashboard/profile", label: "Perfil", icon: User },
] as const;
