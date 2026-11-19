"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavigationItemActive, navigationItems } from "./navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white px-4 py-4 lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-64 lg:border-b-0 lg:border-r lg:px-6 lg:py-7">
      <Link
        className="flex items-center gap-3"
        href="/"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-semibold text-white">
          E
        </span>
        <span className="flex flex-col">
          <span className="text-base font-semibold tracking-tight text-slate-900">
            Equiply
          </span>
          <span className="text-xs text-slate-500">Gestão de ativos</span>
        </span>
      </Link>
      <nav
        aria-label="Navegação principal"
        className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:flex-1 lg:flex-col lg:overflow-x-visible lg:pb-0"
      >
        {navigationItems.map((item) => {
          const isActive = isNavigationItemActive(pathname, item);
          const Icon = item.icon;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
              href={item.href}
              key={item.href}
              prefetch={false}
            >
              <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 border-t border-slate-200 pt-4 lg:mt-auto">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600"
          >
            DE
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              Usuário de demonstração
            </p>
            <p className="text-xs text-slate-500">Dados temporários</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
