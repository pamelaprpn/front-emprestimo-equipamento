import type { Collaborator } from "@/features/colaboradores/types";
import type { Equipment } from "@/features/equipamentos/types";
import type {
  Loan,
  LoanCreationValues,
  LoanDates,
  LoanDisplayStatus,
} from "@/features/emprestimos/types";

export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isValidLocalDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setHours(12, 0, 0, 0);
  date.setFullYear(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isActiveLoan(
  loan: Loan,
): loan is Extract<Loan, { status: "Em andamento" }> {
  return loan.status === "Em andamento";
}

export function getLoanDates(loanDate = getLocalDateString()): LoanDates {
  const [year, month, day] = loanDate.split("-").map(Number);
  const expectedReturn = new Date(0);
  expectedReturn.setHours(12, 0, 0, 0);
  expectedReturn.setFullYear(year, month - 1, day + 14);

  return {
    loanDate,
    expectedReturnDate: getLocalDateString(expectedReturn),
  };
}

export function hasActiveLoanForEquipment(
  loans: readonly Loan[],
  equipmentId: string,
): boolean {
  return loans.some(
    (loan) => loan.equipmentId === equipmentId && isActiveLoan(loan),
  );
}

export function hasOverdueLoanForCollaborator(
  loans: readonly Loan[],
  collaboratorId: string,
  today: string,
): boolean {
  return loans.some(
    (loan) =>
      loan.collaboratorId === collaboratorId &&
      isActiveLoan(loan) &&
      loan.expectedReturnDate < today,
  );
}

export function getLoanDisplayStatus(
  loan: Loan,
  today = getLocalDateString(),
): LoanDisplayStatus {
  if (loan.status === "Devolvido") {
    return "Devolvido";
  }

  return loan.expectedReturnDate < today ? "Atrasado" : "Em andamento";
}

export function validateLoanCreation(
  equipment: Equipment | undefined,
  collaborator: Collaborator | undefined,
  loans: readonly Loan[],
  values: LoanCreationValues,
  today: string,
): string | null {
  if (!equipment) {
    return "Selecione um equipamento válido.";
  }

  if (equipment.status !== "Disponível") {
    if (equipment.status === "Emprestado") {
      return "Esse equipamento já está emprestado.";
    }

    return "Somente equipamentos disponíveis podem ser emprestados.";
  }

  if (hasActiveLoanForEquipment(loans, equipment.id)) {
    return "Esse equipamento já possui um empréstimo ativo.";
  }

  if (!collaborator) {
    return "Selecione um colaborador válido.";
  }

  if (collaborator.status !== "Ativo") {
    return "Somente colaboradores ativos podem receber empréstimos.";
  }

  if (hasOverdueLoanForCollaborator(loans, collaborator.id, today)) {
    return "O colaborador possui um empréstimo atrasado e não pode receber outro equipamento.";
  }

  return null;
}
