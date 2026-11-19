import type { LucideIcon } from "lucide-react";

export type DashboardStat = {
  id: string;
  title: string;
  value: number;
  icon: LucideIcon;
};

export type LoanStatus = "Em andamento" | "Atrasado" | "Devolvido";

export type RecentLoan = {
  id: string;
  equipment: string;
  collaborator: string;
  date: string;
  status: LoanStatus;
};

export type InventoryCategory = {
  id: string;
  name: string;
  quantity: number;
};
