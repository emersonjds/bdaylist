import type { NavItem } from "./nav-items";

// Enquanto gifts/guests/profile compartilham /dashboard, só "Início" representa
// a rota — sem isso os quatro itens acenderiam juntos. A segunda condição já
// cobre os paths reais quando cada tela existir.
export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/dashboard") {
    return pathname === "/dashboard" && item.id === "home";
  }
  return pathname.startsWith(item.href);
}
