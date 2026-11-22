import { PackageOpen, Pencil } from "lucide-react";
import StatusBadge, {
  type StatusBadgeVariant,
} from "@/components/ui/StatusBadge";
import type {
  Equipment,
  EquipmentStatus,
} from "@/features/equipamentos/types";

type EquipmentTableProps = {
  equipment: readonly Equipment[];
  isFiltered: boolean;
  onEdit?: (equipment: Equipment) => void;
  onAddEquipment?: () => void;
  onClearFilters: () => void;
  readOnly?: boolean;
};

const statusVariants: Record<EquipmentStatus, StatusBadgeVariant> = {
  Disponível: "success",
  Emprestado: "neutral",
};

export default function EquipmentTable({
  equipment,
  isFiltered,
  onEdit,
  onAddEquipment,
  onClearFilters,
  readOnly = false,
}: EquipmentTableProps) {
  if (equipment.length === 0) {
    return (
      <section className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <PackageOpen aria-hidden="true" size={22} />
        </span>
        <h2 className="mt-4 text-base font-semibold text-slate-900">
          {isFiltered
            ? "Nenhum equipamento encontrado"
            : "Nenhum equipamento cadastrado"}
        </h2>
        <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
          {isFiltered
            ? "Tente ajustar a busca ou os filtros aplicados."
            : readOnly
              ? "A API não retornou equipamentos."
              : "Cadastre o primeiro equipamento para começar a organizar seu inventário."}
        </p>
        {isFiltered ? (
          <button
            className="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            onClick={onClearFilters}
            type="button"
          >
            Limpar busca e filtros
          </button>
        ) : !readOnly && onAddEquipment ? (
          <button
            className="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            onClick={onAddEquipment}
            type="button"
          >
            Cadastrar equipamento
          </button>
        ) : null}
      </section>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="-mx-px overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3.5" scope="col">
                Equipamento
              </th>
              <th className="px-5 py-3.5" scope="col">
                Patrimônio
              </th>
              <th className="px-5 py-3.5" scope="col">
                Categoria
              </th>
              <th className="px-5 py-3.5" scope="col">
                Status
              </th>
              {!readOnly && (
                <th className="px-5 py-3.5 text-right" scope="col">
                  Ação
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipment.map((item) => (
              <tr className="transition-colors hover:bg-slate-50/70" key={item.id}>
                <td className="px-5 py-4 font-medium text-slate-900">
                  {item.name}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {item.assetNumber}
                </td>
                <td className="px-5 py-4 text-slate-600">{item.category}</td>
                <td className="px-5 py-4">
                  <StatusBadge variant={statusVariants[item.status]}>
                    {item.status}
                  </StatusBadge>
                </td>
                {!readOnly && (
                  <td className="px-5 py-4 text-right">
                    {onEdit && (
                      <button
                        aria-label={`Editar ${item.name}`}
                        className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                        onClick={() => onEdit(item)}
                        type="button"
                      >
                        <Pencil aria-hidden="true" size={16} />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
        {equipment.length} {equipment.length === 1 ? "equipamento" : "equipamentos"}
      </p>
    </div>
  );
}
