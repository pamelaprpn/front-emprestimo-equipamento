import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: LucideIcon;
};

export default function StatCard({ title, value, icon: Icon }: StatCardProps) {
  const displayValue =
    typeof value === "number"
      ? new Intl.NumberFormat("pt-BR").format(value)
      : value;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
        {displayValue}
      </p>
    </article>
  );
}
