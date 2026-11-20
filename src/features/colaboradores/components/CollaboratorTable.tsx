import { PackageOpen, Pencil } from "lucide-react";
import StatusBadge, {
  type StatusBadgeVariant,
} from "@/components/ui/StatusBadge";
import type {
  Collaborator,
  CollaboratorStatus,
} from "@/features/colaboradores/types";

type CollaboratorTableProps = {
  collaborators: readonly Collaborator[];
  isFiltered: boolean;
  onEdit: (collaborator: Collaborator) => void;
  onAddCollaborator: () => void;
  onClearFilters: () => void;
};

const statusVariants: Record<CollaboratorStatus, StatusBadgeVariant> = {
  Ativo: "success",
  Inativo: "neutral",
};

export default function CollaboratorTable({
  collaborators,
  isFiltered,
  onEdit,
  onAddCollaborator,
  onClearFilters,
}: CollaboratorTableProps) {
  if (collaborators.length === 0) {
    return (
      <section className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <PackageOpen aria-hidden="true" size={22} />
        </span>
        <h2 className="mt-4 text-base font-semibold text-slate-900">
          {isFiltered
            ? "Nenhum colaborador encontrado"
            : "Nenhum colaborador cadastrado"}
        </h2>
        <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
          {isFiltered
            ? "Tente ajustar a busca ou o filtro aplicado."
            : "Cadastre o primeiro colaborador para começar a organizar os empréstimos."}
        </p>
        {isFiltered ? (
          <button
            className="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            onClick={onClearFilters}
            type="button"
          >
            Limpar busca e filtro
          </button>
        ) : (
          <button
            className="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            onClick={onAddCollaborator}
            type="button"
          >
            Cadastrar colaborador
          </button>
        )}
      </section>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="-mx-px overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3.5" scope="col">
                Nome
              </th>
              <th className="px-5 py-3.5" scope="col">
                Matrícula
              </th>
              <th className="px-5 py-3.5" scope="col">
                E-mail
              </th>
              <th className="px-5 py-3.5" scope="col">
                Departamento
              </th>
              <th className="px-5 py-3.5" scope="col">
                Telefone
              </th>
              <th className="px-5 py-3.5" scope="col">
                Status
              </th>
              <th className="px-5 py-3.5 text-right" scope="col">
                Ação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {collaborators.map((collaborator) => (
              <tr
                className="transition-colors hover:bg-slate-50/70"
                key={collaborator.id}
              >
                <td className="px-5 py-4 font-medium text-slate-900">
                  {collaborator.name}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {collaborator.registrationNumber}
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {collaborator.email}
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {collaborator.department}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {collaborator.phone || "—"}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge variant={statusVariants[collaborator.status]}>
                    {collaborator.status}
                  </StatusBadge>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    aria-label={`Editar ${collaborator.name}`}
                    className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    onClick={() => onEdit(collaborator)}
                    type="button"
                  >
                    <Pencil aria-hidden="true" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
        {collaborators.length}{" "}
        {collaborators.length === 1 ? "colaborador" : "colaboradores"}
      </p>
    </div>
  );
}
