import { Info } from "lucide-react";
import CategoryInventory from "@/features/dashboard/components/CategoryInventory";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import RecentLoans from "@/features/dashboard/components/RecentLoans";
import {
  dashboardStats,
  inventoryCategories,
  recentLoans,
} from "@/features/dashboard/data/dashboard-data";

export default function Home() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            className="text-2xl font-semibold tracking-tight text-slate-900"
            id="dashboard-title"
          >
            Visão geral
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Acompanhe os equipamentos e empréstimos em um só lugar.
          </p>
        </div>
        <p
          className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800"
          role="note"
        >
          <Info aria-hidden="true" size={15} />
          Dados fictícios para demonstração
        </p>
      </header>

      <DashboardStats stats={dashboardStats} />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <RecentLoans loans={recentLoans} />
        <CategoryInventory categories={inventoryCategories} />
      </div>
    </div>
  );
}
