import StatCard from "@/components/ui/StatCard";
import type { DashboardStat } from "@/features/dashboard/types";

type DashboardStatsProps = {
  stats: readonly DashboardStat[];
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <section
      aria-label="Resumo de equipamentos"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => (
        <StatCard
          icon={stat.icon}
          key={stat.id}
          title={stat.title}
          value={stat.value}
        />
      ))}
    </section>
  );
}
