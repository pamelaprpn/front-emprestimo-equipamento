import type { ReactNode } from "react";

export type StatusBadgeVariant = "success" | "warning" | "neutral";

type StatusBadgeProps = {
  children: ReactNode;
  variant: StatusBadgeVariant;
};

const variantClasses: Record<StatusBadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export default function StatusBadge({ children, variant }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
