import type { Equipment, EquipmentStatus } from "../types";

export const equipmentStatuses = [
  "Disponível",
  "Emprestado",
  "Manutenção",
] satisfies readonly EquipmentStatus[];

export const equipmentCategories = [
  "Computador",
  "Monitor",
  "Projetor",
  "Periférico",
  "Acessório",
] as const;

export const equipmentData = [
  {
    id: "equipment-001",
    name: "Notebook Dell Latitude",
    assetNumber: "PAT-0001",
    category: "Computador",
    status: "Disponível",
  },
  {
    id: "equipment-002",
    name: "Monitor LG UltraWide",
    assetNumber: "PAT-0002",
    category: "Monitor",
    status: "Emprestado",
  },
  {
    id: "equipment-003",
    name: "Projetor Epson PowerLite",
    assetNumber: "PAT-0003",
    category: "Projetor",
    status: "Manutenção",
  },
  {
    id: "equipment-004",
    name: "Teclado Logitech",
    assetNumber: "PAT-0004",
    category: "Periférico",
    status: "Disponível",
  },
] satisfies readonly Equipment[];
