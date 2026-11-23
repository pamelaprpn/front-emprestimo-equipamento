"use client";

import {
  AlertCircle,
  ArrowLeftRight,
  Package,
  PackageCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAppData } from "@/components/providers/AppDataProvider";
import type { Collaborator } from "@/features/colaboradores/types";
import { collaboratorDataSource } from "@/features/colaboradores/config/collaborator-data-source";
import { useCollaborators } from "@/features/colaboradores/hooks/useCollaborators";
import CategoryInventory from "@/features/dashboard/components/CategoryInventory";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import RecentLoans from "@/features/dashboard/components/RecentLoans";
import type {
  DashboardStat,
  InventoryCategory,
  LoanStatus,
} from "@/features/dashboard/types";
import { equipmentDataSource } from "@/features/equipamentos/config/equipment-data-source";
import { useEquipments } from "@/features/equipamentos/hooks/useEquipments";
import type { Equipment } from "@/features/equipamentos/types";
import { loanDataSource } from "@/features/emprestimos/config/loan-data-source";
import { useLoans } from "@/features/emprestimos/hooks/useLoans";
import type { ApiLoan, Loan } from "@/features/emprestimos/types";
import { getLoanDisplayStatus } from "@/features/emprestimos/utils/loan-rules";

const recentLoansLimit = 4;

type DashboardLoan = {
  id: string;
  equipmentId: string;
  collaboratorId: string;
  loanDate: string;
  actualReturnDate: string | null;
  status: LoanStatus;
};

type DashboardCollaborator = Pick<Collaborator, "id" | "name">;

type DashboardQuery<Value> = {
  data: readonly Value[] | undefined;
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => Promise<unknown>;
};

type DashboardLoansQuery = DashboardQuery<DashboardLoan> & {
  overdueCount: number | undefined;
};

type EquipmentSourceProps = {
  local: readonly Readonly<Equipment>[];
  children: (query: DashboardQuery<Equipment>) => ReactNode;
};

type CollaboratorSourceProps = {
  local: readonly Readonly<Collaborator>[];
  children: (query: DashboardQuery<DashboardCollaborator>) => ReactNode;
};

type LoanSourceProps = {
  local: readonly Readonly<Loan>[];
  children: (query: DashboardLoansQuery) => ReactNode;
};

function createLocalQuery<Value>(
  data: readonly Value[],
): DashboardQuery<Value> {
  return {
    data,
    isPending: false,
    isError: false,
    isFetching: false,
    refetch: async () => undefined,
  };
}

function ApiEquipmentSource({
  children,
}: {
  children: EquipmentSourceProps["children"];
}) {
  const query = useEquipments();

  return children({
    data: query.data,
    isPending: query.isPending,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: () => query.refetch(),
  });
}

function EquipmentSource({ local, children }: EquipmentSourceProps) {
  return equipmentDataSource === "api" ? (
    <ApiEquipmentSource>{children}</ApiEquipmentSource>
  ) : (
    children(createLocalQuery(local))
  );
}

function ApiCollaboratorSource({
  children,
}: {
  children: CollaboratorSourceProps["children"];
}) {
  const query = useCollaborators();

  return children({
    data: query.data,
    isPending: query.isPending,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: () => query.refetch(),
  });
}

function CollaboratorSource({ local, children }: CollaboratorSourceProps) {
  return collaboratorDataSource === "api" ? (
    <ApiCollaboratorSource>{children}</ApiCollaboratorSource>
  ) : (
    children(createLocalQuery(local))
  );
}

function getLocalLoanQuery(
  loans: readonly Readonly<Loan>[],
): DashboardLoansQuery {
  const data = loans.map((loan) => ({
    id: loan.id,
    equipmentId: loan.equipmentId,
    collaboratorId: loan.collaboratorId,
    loanDate: loan.loanDate,
    actualReturnDate: loan.actualReturnDate,
    status: getLoanDisplayStatus(loan),
  }));

  return {
    ...createLocalQuery(data),
    overdueCount: data.filter((loan) => loan.status === "Atrasado").length,
  };
}

function ApiLoanSource({
  children,
}: {
  children: LoanSourceProps["children"];
}) {
  const loansQuery = useLoans();
  const overdueLoansQuery = useLoans(true);
  const overdueLoanIds = new Set(
    overdueLoansQuery.data?.map((loan) => loan.id) ?? [],
  );
  const data = loansQuery.data?.map((loan: ApiLoan) => ({
    id: loan.id,
    equipmentId: loan.equipmentId,
    collaboratorId: loan.collaboratorId,
    loanDate: loan.loanDate,
    actualReturnDate: loan.actualReturnDate,
    status:
      loan.actualReturnDate !== null
        ? "Devolvido"
        : overdueLoanIds.has(loan.id)
          ? "Atrasado"
          : "Em andamento",
  })) satisfies DashboardLoan[] | undefined;

  return children({
    data,
    overdueCount: overdueLoansQuery.data?.length,
    isPending: loansQuery.isPending || overdueLoansQuery.isPending,
    isError: loansQuery.isError || overdueLoansQuery.isError,
    isFetching: loansQuery.isFetching || overdueLoansQuery.isFetching,
    refetch: async () => {
      await Promise.all([loansQuery.refetch(), overdueLoansQuery.refetch()]);
    },
  });
}

function LoanSource({ local, children }: LoanSourceProps) {
  return loanDataSource === "api" ? (
    <ApiLoanSource>{children}</ApiLoanSource>
  ) : (
    children(getLocalLoanQuery(local))
  );
}

function formatLoanDate(value: string): string {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function DashboardContent({
  equipmentQuery,
  collaboratorQuery,
  loanQuery,
}: {
  equipmentQuery: DashboardQuery<Equipment>;
  collaboratorQuery: DashboardQuery<DashboardCollaborator>;
  loanQuery: DashboardLoansQuery;
}) {
  const queries = [equipmentQuery, collaboratorQuery, loanQuery];
  const dashboardData =
    equipmentQuery.data !== undefined &&
    collaboratorQuery.data !== undefined &&
    loanQuery.data !== undefined &&
    loanQuery.overdueCount !== undefined
      ? {
          equipment: equipmentQuery.data,
          collaborators: collaboratorQuery.data,
          loans: loanQuery.data,
          overdueCount: loanQuery.overdueCount,
        }
      : undefined;
  const hasError = queries.some((query) => query.isError);
  const isFetching = queries.some((query) => query.isFetching);

  function retryQueries() {
    for (const query of queries) {
      void query.refetch();
    }
  }

  if (!dashboardData) {
    if (hasError) {
      return (
        <section
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p>Não foi possível carregar todos os dados da Visão geral.</p>
          <button
            className="w-fit rounded-lg px-3 py-2 font-medium text-rose-800 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isFetching}
            onClick={retryQueries}
            type="button"
          >
            {isFetching ? "Tentando novamente..." : "Tentar novamente"}
          </button>
        </section>
      );
    }

    return (
      <section
        aria-busy="true"
        className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-10 text-sm text-slate-600"
        role="status"
      >
        Carregando dados da Visão geral...
      </section>
    );
  }

  const equipmentById = new Map(
    dashboardData.equipment.map((item) => [item.id, item]),
  );
  const collaboratorById = new Map(
    dashboardData.collaborators.map((item) => [item.id, item]),
  );
  const stats: DashboardStat[] = [
    {
      id: "equipment-total",
      title: "Total de equipamentos",
      value: dashboardData.equipment.length,
      icon: Package,
    },
    {
      id: "equipment-available",
      title: "Disponíveis",
      value: dashboardData.equipment.filter(
        (item) => item.status === "Disponível",
      ).length,
      icon: PackageCheck,
    },
    {
      id: "equipment-loaned",
      title: "Emprestados",
      value: dashboardData.equipment.filter(
        (item) => item.status === "Emprestado",
      ).length,
      icon: ArrowLeftRight,
    },
    {
      id: "equipment-overdue",
      title: "Atrasados",
      value: dashboardData.overdueCount,
      icon: AlertCircle,
    },
  ];
  const recentLoans = [...dashboardData.loans]
    .sort((left, right) => right.loanDate.localeCompare(left.loanDate))
    .slice(0, recentLoansLimit)
    .map((loan) => ({
      id: loan.id,
      equipment:
        equipmentById.get(loan.equipmentId)?.name ??
        "Equipamento não encontrado",
      collaborator:
        collaboratorById.get(loan.collaboratorId)?.name ??
        "Colaborador não encontrado",
      date: formatLoanDate(loan.loanDate),
      status: loan.status,
    }));
  const inventoryCounts = new Map<string, number>();
  for (const item of dashboardData.equipment) {
    const category = item.category.trim() || "Sem categoria";
    inventoryCounts.set(category, (inventoryCounts.get(category) ?? 0) + 1);
  }
  const categories: InventoryCategory[] = Array.from(
    inventoryCounts,
    ([name, quantity]) => ({ id: name, name, quantity }),
  ).sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));

  return (
    <div className="space-y-4">
      {hasError && (
        <section
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p>
            Não foi possível atualizar todos os dados. As informações exibidas
            podem estar desatualizadas.
          </p>
          <button
            className="w-fit rounded-lg px-3 py-2 font-medium text-rose-800 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isFetching}
            onClick={retryQueries}
            type="button"
          >
            {isFetching ? "Tentando novamente..." : "Tentar novamente"}
          </button>
        </section>
      )}
      {!hasError && isFetching && (
        <p className="text-sm text-slate-500" role="status">
          Atualizando dados da Visão geral...
        </p>
      )}

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <RecentLoans loans={recentLoans} />
        <CategoryInventory categories={categories} />
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const { equipment, collaborators, loans } = useAppData();

  return (
    <EquipmentSource local={equipment}>
      {(equipmentQuery) => (
        <CollaboratorSource local={collaborators}>
          {(collaboratorQuery) => (
            <LoanSource local={loans}>
              {(loanQuery) => (
                <DashboardContent
                  collaboratorQuery={collaboratorQuery}
                  equipmentQuery={equipmentQuery}
                  loanQuery={loanQuery}
                />
              )}
            </LoanSource>
          )}
        </CollaboratorSource>
      )}
    </EquipmentSource>
  );
}
