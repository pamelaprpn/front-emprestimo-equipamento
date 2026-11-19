import {
  AlertCircle,
  ArrowLeftRight,
  Package,
  PackageCheck,
} from "lucide-react";
import type {
  DashboardStat,
  InventoryCategory,
  RecentLoan,
} from "@/features/dashboard/types";

export const dashboardStats = [
  {
    id: "equipment-total",
    title: "Total de equipamentos",
    value: 128,
    icon: Package,
  },
  {
    id: "equipment-available",
    title: "Disponíveis",
    value: 76,
    icon: PackageCheck,
  },
  {
    id: "equipment-loaned",
    title: "Emprestados",
    value: 42,
    icon: ArrowLeftRight,
  },
  {
    id: "equipment-overdue",
    title: "Atrasados",
    value: 10,
    icon: AlertCircle,
  },
] satisfies readonly DashboardStat[];

export const recentLoans = [
  {
    id: "demo-loan-01",
    equipment: "Notebook de demonstração 01",
    collaborator: "Colaborador de demonstração 01",
    date: "19 nov. 2026",
    status: "Em andamento",
  },
  {
    id: "demo-loan-02",
    equipment: "Projetor de demonstração 01",
    collaborator: "Colaborador de demonstração 02",
    date: "18 nov. 2026",
    status: "Atrasado",
  },
  {
    id: "demo-loan-03",
    equipment: "Monitor de demonstração 01",
    collaborator: "Colaborador de demonstração 03",
    date: "17 nov. 2026",
    status: "Devolvido",
  },
  {
    id: "demo-loan-04",
    equipment: "Tablet de demonstração 01",
    collaborator: "Colaborador de demonstração 04",
    date: "16 nov. 2026",
    status: "Em andamento",
  },
] satisfies readonly RecentLoan[];

export const inventoryCategories = [
  { id: "computers", name: "Computadores", quantity: 48 },
  { id: "monitors", name: "Monitores", quantity: 24 },
  { id: "peripherals", name: "Periféricos", quantity: 36 },
  { id: "accessories", name: "Acessórios", quantity: 20 },
] satisfies readonly InventoryCategory[];
