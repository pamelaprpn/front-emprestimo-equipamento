import type { Collaborator } from "@/features/colaboradores/types";
import type { Equipment } from "@/features/equipamentos/types";
import type {
  Loan,
  LoanCreationValues,
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

export function hasActiveLoanForEquipment(
  loans: readonly Loan[],
  equipmentId: string,
): boolean {
  return loans.some(
    (loan) => loan.equipmentId === equipmentId && isActiveLoan(loan),
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
): string | null {
  if (!equipment) {
    return "Selecione um equipamento válido.";
  }

  if (equipment.status !== "Disponível") {
    if (equipment.status === "Manutenção") {
      return "Equipamentos em manutenção não podem ser emprestados.";
    }

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

  if (
    !isValidLocalDate(values.loanDate) ||
    !isValidLocalDate(values.expectedReturnDate)
  ) {
    return "Informe datas válidas para o empréstimo.";
  }

  if (values.expectedReturnDate < values.loanDate) {
    return "A data prevista para devolução não pode ser anterior à data do empréstimo.";
  }

  return null;
}
