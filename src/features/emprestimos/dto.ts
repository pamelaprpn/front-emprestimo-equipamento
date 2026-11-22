export type LoanResponseDTO = {
  id: number;
  equipamentoId: number;
  colaboradorId: number;
  dataEmprestimo: string;
  dataPrevistaDevolucao: string;
  dataDevolucao: string | null;
};
