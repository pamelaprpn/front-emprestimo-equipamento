import { Plus, Search } from "lucide-react";
import type { LoanDisplayStatus } from "@/features/emprestimos/types";

export type LoanStatusFilter = LoanDisplayStatus | "Todos";

const loanFilters: readonly { value: LoanStatusFilter; label: string }[] = [
  { value: "Todos", label: "Todos" },
  { value: "Em andamento", label: "Em andamento" },
  { value: "Atrasado", label: "Atrasados" },
  { value: "Devolvido", label: "Devolvidos" },
];

type LoanToolbarProps = {
  search: string;
  status: LoanStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: LoanStatusFilter) => void;
  onNewLoan: () => void;
};

function isLoanStatusFilter(value: string): value is LoanStatusFilter {
  return loanFilters.some((filter) => filter.value === value);
}

export default function LoanToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onNewLoan,
}: LoanToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:p-5">
      <div className="min-w-0 flex-1">
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="loan-search"
        >
          Buscar empréstimo
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
            id="loan-search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Colaborador, equipamento ou patrimônio"
            type="search"
            value={search}
          />
        </div>
      </div>

      <div className="sm:w-56">
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="loan-status-filter"
        >
          Status
        </label>
        <select
          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          id="loan-status-filter"
          onChange={(event) => {
            const value = event.target.value;
            if (isLoanStatusFilter(value)) {
              onStatusChange(value);
            }
          }}
          value={status}
        >
          {loanFilters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      <button
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        onClick={onNewLoan}
        type="button"
      >
        <Plus aria-hidden="true" size={17} />
        Novo empréstimo
      </button>
    </div>
  );
}
