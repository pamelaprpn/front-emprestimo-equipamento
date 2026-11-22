import type { LoanResponseDTO } from "@/features/emprestimos/dto";
import type { ApiLoan } from "@/features/emprestimos/types";

export function adaptLoanResponseDTO(dto: LoanResponseDTO): ApiLoan {
  return {
    id: String(dto.id),
    equipmentId: String(dto.equipamentoId),
    collaboratorId: String(dto.colaboradorId),
    loanDate: dto.dataEmprestimo,
    expectedReturnDate: dto.dataPrevistaDevolucao,
    actualReturnDate: dto.dataDevolucao,
  };
}
