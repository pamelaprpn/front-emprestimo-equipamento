import { api } from "@/lib/api";
import { adaptLoanResponseDTO } from "@/features/emprestimos/adapters/loan-adapter";
import type { LoanResponseDTO } from "@/features/emprestimos/dto";
import type { ApiLoan } from "@/features/emprestimos/types";

export const loanService = {
  async create(
    equipamentoId: string,
    colaboradorId: string,
  ): Promise<ApiLoan> {
    const { data } = await api.post<LoanResponseDTO>(
      "/emprestimos",
      undefined,
      {
        params: { equipamentoId, colaboradorId },
      },
    );

    return adaptLoanResponseDTO(data);
  },

  async returnLoan(id: string): Promise<ApiLoan> {
    const { data } = await api.put<LoanResponseDTO>(
      `/emprestimos/${encodeURIComponent(id)}/devolucao`,
      undefined,
    );

    return adaptLoanResponseDTO(data);
  },

  async getAll(atrasados?: boolean): Promise<ApiLoan[]> {
    const config =
      atrasados === true ? { params: { atrasados: true } } : undefined;
    const { data } = await api.get<LoanResponseDTO[]>("/emprestimos", config);

    return data.map(adaptLoanResponseDTO);
  },

  async getById(id: string): Promise<ApiLoan> {
    const { data } = await api.get<LoanResponseDTO>(
      `/emprestimos/${encodeURIComponent(id)}`,
    );

    return adaptLoanResponseDTO(data);
  },
};
