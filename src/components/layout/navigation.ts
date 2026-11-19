import {
  ArrowRightLeft,
  LayoutDashboard,
  Package,
  Users,
  type LucideIcon,
} from "lucide-react";

type AppRoute = "/" | "/equipamentos" | "/colaboradores" | "/emprestimos";

export type NavigationItem = {
  href: AppRoute;
  label: string;
  icon: LucideIcon;
};

export const navigationItems = [
  { href: "/", label: "Visão geral", icon: LayoutDashboard },
  { href: "/equipamentos", label: "Equipamentos", icon: Package },
  { href: "/colaboradores", label: "Colaboradores", icon: Users },
  { href: "/emprestimos", label: "Empréstimos", icon: ArrowRightLeft },
] satisfies readonly NavigationItem[];

export function isNavigationItemActive(
  pathname: string | null,
  item: NavigationItem,
) {
  if (pathname === null) {
    return false;
  }

  if (item.href === "/") {
    return pathname === "/";
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getCurrentNavigationItem(pathname: string | null) {
  return navigationItems.find((item) =>
    isNavigationItemActive(pathname, item),
  );
}
