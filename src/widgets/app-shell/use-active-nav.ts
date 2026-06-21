import type { NavItem } from "./nav-items";

// "Início" só ativa no path exato; as demais ativam também em sub-rotas.
export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
