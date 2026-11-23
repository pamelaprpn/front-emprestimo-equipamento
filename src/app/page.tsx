import DashboardClient from "@/features/dashboard/components/DashboardClient";

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
      </header>

      <DashboardClient />
    </div>
  );
}
