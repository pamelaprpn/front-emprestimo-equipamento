import { Plus, Search } from "lucide-react";
import { collaboratorStatuses } from "@/features/colaboradores/data/colaboradores-data";
import type { CollaboratorStatus } from "@/features/colaboradores/types";

function isCollaboratorFilter(
  value: string,
): value is CollaboratorStatus | "Todos" {
  return (
    value === "Todos" ||
    collaboratorStatuses.some((status) => status === value)
  );
}

type CollaboratorToolbarProps = {
  search: string;
  status: CollaboratorStatus | "Todos";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CollaboratorStatus | "Todos") => void;
  onAddCollaborator: () => void;
};

export default function CollaboratorToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onAddCollaborator,
}: CollaboratorToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:p-5">
      <div className="min-w-0 flex-1">
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="collaborator-search"
        >
          Buscar colaborador
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
            id="collaborator-search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Nome, matrícula ou e-mail"
            type="search"
            value={search}
          />
        </div>
      </div>

      <div className="sm:w-52">
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="collaborator-status-filter"
        >
          Status
        </label>
        <select
          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="collaborator-status-filter"
          onChange={(event) => {
            const value = event.target.value;
            if (isCollaboratorFilter(value)) {
              onStatusChange(value);
            }
          }}
          value={status}
        >
          <option value="Todos">Todos</option>
          <option value="Ativo">Ativos</option>
          <option value="Inativo">Inativos</option>
        </select>
      </div>

      <button
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        onClick={onAddCollaborator}
        type="button"
      >
        <Plus aria-hidden="true" size={17} />
        Novo colaborador
      </button>
    </div>
  );
}
