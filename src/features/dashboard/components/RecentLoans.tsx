import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import StatusBadge, {
  type StatusBadgeVariant,
} from "@/components/ui/StatusBadge";
import type {
  LoanStatus,
  RecentLoan as RecentLoanItem,
} from "@/features/dashboard/types";

type RecentLoansProps = {
  loans: readonly RecentLoanItem[];
};

const statusVariants: Record<LoanStatus, StatusBadgeVariant> = {
  "Em andamento": "success",
  Atrasado: "warning",
  Devolvido: "neutral",
};

export default function RecentLoans({ loans }: RecentLoansProps) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Empréstimos recentes
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Registros mais recentes
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-950"
          href="/emprestimos"
          prefetch={false}
        >
          Ver empréstimos
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
      <div className="-mx-5 mt-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
            <tr>
              <th className="pb-3 pr-4">Equipamento</th>
              <th className="pb-3 pr-4">Colaborador</th>
              <th className="pb-3 pr-4">Data</th>
              <th className="pb-3">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loans.length === 0 ? (
              <tr>
                <td
                  className="py-8 text-center text-sm text-slate-500"
                  colSpan={4}
                >
                  Nenhum empréstimo cadastrado.
                </td>
              </tr>
            ) : (
              loans.map((loan) => (
                <tr className="align-middle" key={loan.id}>
                  <td className="py-4 pr-4 font-medium text-slate-800">
                    {loan.equipment}
                  </td>
                  <td className="py-4 pr-4 text-slate-600">
                    <Link
                      className="hover:text-slate-900 hover:underline"
                      href="/colaboradores"
                      prefetch={false}
                    >
                      {loan.collaborator}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap py-4 pr-4 text-slate-600">
                    {loan.date}
                  </td>
                  <td className="py-4">
                    <StatusBadge variant={statusVariants[loan.status]}>
                      {loan.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
