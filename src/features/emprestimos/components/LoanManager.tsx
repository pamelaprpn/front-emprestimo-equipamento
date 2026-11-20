"use client";

import { useState } from "react";
import { useAppData } from "@/components/providers/AppDataProvider";
import type { LoanCreationValues } from "@/features/emprestimos/types";
import { getLoanDisplayStatus } from "@/features/emprestimos/utils/loan-rules";
import LoanForm from "@/features/emprestimos/components/LoanForm";
import LoanReturnConfirmation from "@/features/emprestimos/components/LoanReturnConfirmation";
import LoanTable, {
  type LoanTableItem,
} from "@/features/emprestimos/components/LoanTable";
import LoanToolbar, {
  type LoanStatusFilter,
} from "@/features/emprestimos/components/LoanToolbar";

export default function LoanManager() {
  const {
    loans,
    equipment,
    collaborators,
    createLoan,
    returnLoan,
  } = useAppData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LoanStatusFilter>("Todos");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loanToReturn, setLoanToReturn] = useState<LoanTableItem | null>(null);
  const [returnError, setReturnError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const availableEquipment = equipment.filter(
    (item) => item.status === "Disponível",
  );
  const activeCollaborators = collaborators.filter(
    (collaborator) => collaborator.status === "Ativo",
  );

  const equipmentById = new Map(
    equipment.map((item) => [item.id, item] as const),
  );
  const collaboratorById = new Map(
    collaborators.map((collaborator) => [
      collaborator.id,
      collaborator,
    ] as const),
  );

  const loanRows: LoanTableItem[] = loans.map((loan) => {
    const relatedEquipment = equipmentById.get(loan.equipmentId);
    const relatedCollaborator = collaboratorById.get(loan.collaboratorId);

    return {
      id: loan.id,
      equipmentName: relatedEquipment?.name ?? "Equipamento não encontrado",
      assetNumber: relatedEquipment?.assetNumber ?? "—",
      collaboratorName:
        relatedCollaborator?.name ?? "Colaborador não encontrado",
      loanDate: loan.loanDate,
      expectedReturnDate: loan.expectedReturnDate,
      status: getLoanDisplayStatus(loan),
      canReturn: loan.status === "Em andamento",
    };
  });

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

  function clearFilters() {
    setSearch("");
    setStatusFilter("Todos");
  }

  function openForm() {
    setFeedback(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
  }

  function openReturnConfirmation(loan: LoanTableItem) {
    setFeedback(null);
    setReturnError(null);
    setLoanToReturn(loan);
  }

  function closeReturnConfirmation() {
    setLoanToReturn(null);
    setReturnError(null);
  }

  function confirmReturn() {
    if (!loanToReturn) {
      return;
    }

    const result = returnLoan(loanToReturn.id);
    if (!result.ok) {
      setReturnError(result.error);
      return;
    }

    setFeedback(
      `Devolução de "${loanToReturn.equipmentName}" registrada com sucesso.`,
    );
    closeReturnConfirmation();
  }

  function submitLoan(values: LoanCreationValues): string | null {
    const result = createLoan(values);
    if (!result.ok) {
      return result.error;
    }

    setFeedback("Empréstimo registrado com sucesso.");
    closeForm();
    return null;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Empréstimos
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Consulte os empréstimos e acompanhe as devoluções previstas.
        </p>
      </header>

      {feedback && (
        <p
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          {feedback}
        </p>
      )}

      <LoanToolbar
        onNewLoan={openForm}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        search={search}
        status={statusFilter}
      />

      <LoanTable
        isFiltered={search.trim().length > 0 || statusFilter !== "Todos"}
        loans={filteredLoans}
        onClearFilters={clearFilters}
        onReturn={openReturnConfirmation}
      />

      {loanToReturn && (
        <LoanReturnConfirmation
          collaboratorName={loanToReturn.collaboratorName}
          equipmentName={loanToReturn.equipmentName}
          error={returnError}
          onCancel={closeReturnConfirmation}
          onConfirm={confirmReturn}
        />
      )}

      {isFormOpen && (
        <LoanForm
          collaborators={activeCollaborators}
          equipment={availableEquipment}
          onCancel={closeForm}
          onSubmit={submitLoan}
        />
      )}
    </div>
  );
}
