import { PackageOpen } from "lucide-react";
import StatusBadge, {
  type StatusBadgeVariant,
} from "@/components/ui/StatusBadge";
import type { LoanDisplayStatus } from "@/features/emprestimos/types";

export type LoanTableItem = {
  id: string;
  equipmentName: string;
  assetNumber: string;
  collaboratorName: string;
  loanDate: string;
  expectedReturnDate: string;
  status: LoanDisplayStatus;
  canReturn: boolean;
};

type LoanTableProps = {
  loans: readonly LoanTableItem[];
  isFiltered: boolean;
  onClearFilters: () => void;
  onReturn: (loan: LoanTableItem) => void;
};

const statusVariants: Record<LoanDisplayStatus, StatusBadgeVariant> = {
  "Em andamento": "success",
  Atrasado: "warning",
  Devolvido: "neutral",
};

function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

export default function LoanTable({
  loans,
  isFiltered,
  onClearFilters,
  onReturn,
}: LoanTableProps) {
  if (loans.length === 0) {
    return (
      <section className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <PackageOpen aria-hidden="true" size={22} />
        </span>
        <h2 className="mt-4 text-base font-semibold text-slate-900">
          {isFiltered
            ? "Nenhum empréstimo encontrado"
            : "Nenhum empréstimo cadastrado"}
        </h2>
        <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
          {isFiltered
            ? "Tente ajustar a busca ou os filtros aplicados."
            : "Os empréstimos registrados aparecerão nesta lista."}
        </p>
        {isFiltered && (
          <button
            className="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            onClick={onClearFilters}
            type="button"
          >
            Limpar busca e filtros
          </button>
        )}
      </section>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="-mx-px overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3.5" scope="col">
                Equipamento
              </th>
              <th className="px-5 py-3.5" scope="col">
                Patrimônio
              </th>
              <th className="px-5 py-3.5" scope="col">
                Colaborador
              </th>
              <th className="px-5 py-3.5" scope="col">
                Data do empréstimo
              </th>
              <th className="px-5 py-3.5" scope="col">
                Devolução prevista
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
            {loans.map((loan) => (
              <tr
                className="transition-colors hover:bg-slate-50/70"
                key={loan.id}
              >
                <td className="px-5 py-4 font-medium text-slate-900">
                  {loan.equipmentName}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  {loan.assetNumber}
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {loan.collaboratorName}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  <time dateTime={loan.loanDate}>
                    {formatDate(loan.loanDate)}
                  </time>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                  <time dateTime={loan.expectedReturnDate}>
                    {formatDate(loan.expectedReturnDate)}
                  </time>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge variant={statusVariants[loan.status]}>
                    {loan.status}
                  </StatusBadge>
                </td>
                <td className="px-5 py-4 text-right">
                  {loan.canReturn ? (
                    <button
                      aria-label={`Registrar devolução de ${loan.equipmentName}`}
                      className="whitespace-nowrap rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                      onClick={() => onReturn(loan)}
                      type="button"
                    >
                      Registrar devolução
                    </button>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
        {loans.length} {loans.length === 1 ? "empréstimo" : "empréstimos"}
      </p>
    </div>
  );
}
