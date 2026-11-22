"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { equipmentsQueryKey } from "@/features/equipamentos/hooks/useEquipments";
import {
  allLoansQueryKey,
  overdueLoansQueryKey,
} from "@/features/emprestimos/hooks/useLoans";
import { loanService } from "@/features/emprestimos/services/loan-service";

type CreateLoanVariables = {
  equipamentoId: string;
  colaboradorId: string;
};

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ equipamentoId, colaboradorId }: CreateLoanVariables) =>
      loanService.create(equipamentoId, colaboradorId),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(
          { queryKey: allLoansQueryKey },
          { throwOnError: false },
        ),
        queryClient.invalidateQueries(
          { queryKey: overdueLoansQueryKey },
          { throwOnError: false },
        ),
        queryClient.invalidateQueries(
          { queryKey: equipmentsQueryKey },
          { throwOnError: false },
        ),
      ]),
  });
}
