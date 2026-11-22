"use client";

import axios from "axios";
import { useRef, useState } from "react";
import { useCollaborators } from "@/features/colaboradores/hooks/useCollaborators";
import { useEquipments } from "@/features/equipamentos/hooks/useEquipments";
import LoanForm from "@/features/emprestimos/components/LoanForm";
import LoanReturnConfirmation from "@/features/emprestimos/components/LoanReturnConfirmation";
import { useLoans } from "@/features/emprestimos/hooks/useLoans";
import { useCreateLoan } from "@/features/emprestimos/hooks/useCreateLoan";
import { useReturnLoan } from "@/features/emprestimos/hooks/useReturnLoan";
import type {
  LoanCreationValues,
  LoanDisplayStatus,
} from "@/features/emprestimos/types";
import LoanTable, {
  type LoanTableItem,
} from "@/features/emprestimos/components/LoanTable";
import LoanToolbar, {
  type LoanStatusFilter,
} from "@/features/emprestimos/components/LoanToolbar";

type LoanApiErrorPayload = {
  mensagem?: unknown;
};

function getCreateLoanErrorMessage(error: unknown): string {
  if (axios.isAxiosError<LoanApiErrorPayload>(error)) {
    const apiMessage = error.response?.data?.mensagem;
    if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
      return apiMessage;
    }

    if (!error.response) {
      return "Não foi possível conectar à API. Verifique a conexão e tente novamente.";
    }
  }

  return "Não foi possível registrar o empréstimo. Tente novamente.";
}

function getReturnLoanErrorMessage(error: unknown): string {
  if (axios.isAxiosError<LoanApiErrorPayload>(error)) {
    const apiMessage = error.response?.data?.mensagem;
    if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
      return apiMessage;
    }

    if (!error.response) {
      return "Não foi possível conectar à API. Verifique a conexão e tente novamente.";
    }
  }

  return "Não foi possível registrar a devolução. Tente novamente.";
}

export default function ApiLoanManager() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LoanStatusFilter>("Todos");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loanToReturn, setLoanToReturn] = useState<LoanTableItem | null>(null);
  const [returnError, setReturnError] = useState<string | null>(null);
  const returnSubmissionInProgressRef = useRef(false);
  const loansQuery = useLoans();
  const overdueLoansQuery = useLoans(true);
  const equipmentQuery = useEquipments();
  const collaboratorsQuery = useCollaborators();
  const createLoan = useCreateLoan();
  const returnLoanMutation = useReturnLoan();
  const queries = [
    loansQuery,
    overdueLoansQuery,
    equipmentQuery,
    collaboratorsQuery,
  ];
  const hasError = queries.some((query) => query.isError);
  const isPending = queries.some((query) => query.isPending);
  const isFetching = queries.some((query) => query.isFetching);
  const overdueLoanIds = new Set(
    overdueLoansQuery.data?.map((loan) => loan.id) ?? [],
  );
  const equipmentById = new Map(
    (equipmentQuery.data ?? []).map((equipment) => [equipment.id, equipment]),
  );
  const collaboratorById = new Map(
    (collaboratorsQuery.data ?? []).map((collaborator) => [
      collaborator.id,
      collaborator,
    ]),
  );
  const loanRows: LoanTableItem[] = (loansQuery.data ?? []).map((loan) => {
    const equipment = equipmentById.get(loan.equipmentId);
    const collaborator = collaboratorById.get(loan.collaboratorId);
    const status: LoanDisplayStatus =
      loan.actualReturnDate !== null
        ? "Devolvido"
        : overdueLoanIds.has(loan.id)
          ? "Atrasado"
          : "Em andamento";

    return {
      id: loan.id,
      equipmentName: equipment?.name ?? "Equipamento não encontrado",
      assetNumber: equipment?.assetNumber ?? "—",
      collaboratorName: collaborator?.name ?? "Colaborador não encontrado",
      loanDate: loan.loanDate,
      expectedReturnDate: loan.expectedReturnDate,
      status,
      canReturn: loan.actualReturnDate === null,
    };
  });
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const filteredLoans = loanRows.filter((loan) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        loan.collaboratorName,
        loan.equipmentName,
        loan.assetNumber,
      ].some((value) =>
        value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
      );
    const matchesStatus =
      statusFilter === "Todos" || loan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const availableEquipment = (equipmentQuery.data ?? []).filter(
    (equipment) => equipment.status === "Disponível",
  );

  function clearFilters() {
    setSearch("");
    setStatusFilter("Todos");
  }

  function retryQueries() {
    void Promise.all(queries.map((query) => query.refetch()));
  }

  function openForm() {
    setFeedback(null);
    createLoan.reset();
    setIsFormOpen(true);
  }

  function openReturnConfirmation(loan: LoanTableItem) {
    if (!loan.canReturn) {
      return;
    }

    setFeedback(null);
    setReturnError(null);
    returnLoanMutation.reset();
    setLoanToReturn(loan);
  }

  function closeReturnConfirmation() {
    if (
      !returnLoanMutation.isPending &&
      !returnSubmissionInProgressRef.current
    ) {
      setLoanToReturn(null);
      setReturnError(null);
    }
  }

  async function confirmReturn() {
    if (
      !loanToReturn?.canReturn ||
      returnLoanMutation.isPending ||
      returnSubmissionInProgressRef.current
    ) {
      return;
    }

    returnSubmissionInProgressRef.current = true;
    try {
      await returnLoanMutation.mutateAsync(loanToReturn.id);
      setFeedback(
        `Devolução de "${loanToReturn.equipmentName}" registrada com sucesso.`,
      );
      setLoanToReturn(null);
      setReturnError(null);
    } catch (error: unknown) {
      setReturnError(getReturnLoanErrorMessage(error));
    } finally {
      returnSubmissionInProgressRef.current = false;
    }
  }

  function closeForm() {
    if (!createLoan.isPending) {
      setIsFormOpen(false);
    }
  }

  async function submitLoan(
    values: LoanCreationValues,
  ): Promise<string | null> {
    try {
      await createLoan.mutateAsync({
        equipamentoId: values.equipmentId,
        colaboradorId: values.collaboratorId,
      });
      setFeedback("Empréstimo registrado com sucesso.");
      setIsFormOpen(false);
      return null;
    } catch (error: unknown) {
      return getCreateLoanErrorMessage(error);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Empréstimos
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Consulte os empréstimos cadastrados na API.
        </p>
      </header>

      <LoanToolbar
        onNewLoan={!hasError && !isPending ? openForm : undefined}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        search={search}
        status={statusFilter}
      />

      {feedback && (
        <p
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          {feedback}
        </p>
      )}

      {hasError ? (
        <section
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p>Não foi possível carregar todos os dados dos empréstimos da API.</p>
          <button
            className="w-fit rounded-lg px-3 py-2 font-medium text-rose-800 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isFetching}
            onClick={retryQueries}
            type="button"
          >
            {isFetching ? "Tentando novamente..." : "Tentar novamente"}
          </button>
        </section>
      ) : isPending ? (
        <section
          aria-busy="true"
          className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-10 text-sm text-slate-600"
          role="status"
        >
          Carregando empréstimos...
        </section>
      ) : (
        <>
          {isFetching && (
            <p className="text-sm text-slate-500" role="status">
              Atualizando empréstimos...
            </p>
          )}
          <LoanTable
            isFiltered={search.trim().length > 0 || statusFilter !== "Todos"}
            loans={filteredLoans}
            onClearFilters={clearFilters}
            onReturn={openReturnConfirmation}
          />
        </>
      )}

      {isFormOpen && (
        <LoanForm
          collaboratorEmptyLabel="Nenhum colaborador retornado pela API"
          collaborators={collaboratorsQuery.data ?? []}
          equipment={availableEquipment}
          isSubmitting={createLoan.isPending}
          onCancel={closeForm}
          onSubmit={submitLoan}
        />
      )}

      {loanToReturn && (
        <LoanReturnConfirmation
          collaboratorName={loanToReturn.collaboratorName}
          error={returnError}
          equipmentName={loanToReturn.equipmentName}
          isPending={returnLoanMutation.isPending}
          onCancel={closeReturnConfirmation}
          onConfirm={confirmReturn}
        />
      )}
    </div>
  );
}
