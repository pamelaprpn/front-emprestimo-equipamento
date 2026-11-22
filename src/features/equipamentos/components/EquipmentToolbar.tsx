import { Plus, Search } from "lucide-react";
import { equipmentStatuses } from "@/features/equipamentos/data/equipamentos-data";
import type { EquipmentStatus } from "@/features/equipamentos/types";

function isEquipmentFilter(value: string): value is EquipmentStatus | "Todos" {
  return value === "Todos" || equipmentStatuses.some((status) => status === value);
}

type EquipmentToolbarProps = {
  search: string;
  status: EquipmentStatus | "Todos";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: EquipmentStatus | "Todos") => void;
  onAddEquipment?: () => void;
  showAddEquipment?: boolean;
};

export default function EquipmentToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onAddEquipment,
  showAddEquipment = true,
}: EquipmentToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:p-5">
      <div className="min-w-0 flex-1">
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="equipment-search"
        >
          Buscar equipamento
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            autoComplete="off"
            className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            id="equipment-search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Nome ou número de patrimônio"
            type="search"
            value={search}
          />
        </div>
      </div>

      <div className="sm:w-52">
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="equipment-status-filter"
        >
          Status
        </label>
        <select
          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="equipment-status-filter"
          onChange={(event) => {
            const value = event.target.value;
            if (isEquipmentFilter(value)) {
              onStatusChange(value);
            }
          }}
          value={status}
        >
          <option value="Todos">Todos os status</option>
          {equipmentStatuses.map((equipmentStatus) => (
            <option key={equipmentStatus} value={equipmentStatus}>
              {equipmentStatus}
            </option>
          ))}
        </select>
      </div>

      {showAddEquipment && onAddEquipment && (
        <button
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          onClick={onAddEquipment}
          type="button"
        >
          <Plus aria-hidden="true" size={17} />
          Novo equipamento
        </button>
      )}
    </div>
  );
}
