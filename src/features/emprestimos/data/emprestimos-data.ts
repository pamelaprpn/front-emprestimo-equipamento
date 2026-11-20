import type { Loan } from "@/features/emprestimos/types";

export const loanData = [
  {
    id: "loan-001",
    equipmentId: "equipment-002",
    collaboratorId: "collaborator-001",
    loanDate: "2026-11-18",
    expectedReturnDate: "2026-11-25",
    actualReturnDate: null,
    status: "Em andamento",
  },
] satisfies readonly Loan[];
