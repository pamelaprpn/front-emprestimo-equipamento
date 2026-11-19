"use client";

import { usePathname } from "next/navigation";
import { getCurrentNavigationItem } from "./navigation";

export default function Header() {
  const pathname = usePathname();
  const currentDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
  const pageTitle = getCurrentNavigationItem(pathname)?.label ?? "Página";

  return (
    <header className="sticky top-0 z-10 flex min-h-16 items-center border-b border-slate-200 bg-white px-5 py-3 sm:px-8 sm:py-0">
      <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1>
        <time
          className="text-xs capitalize text-slate-500 sm:text-sm"
          suppressHydrationWarning
        >
          {currentDate}
        </time>
      </div>
    </header>
  );
}
