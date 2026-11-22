"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { equipmentsQueryKey } from "@/features/equipamentos/hooks/useEquipments";
import {
  allLoansQueryKey,
  overdueLoansQueryKey,
} from "@/features/emprestimos/hooks/useLoans";
import { loanService } from "@/features/emprestimos/services/loan-service";

export function useReturnLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => loanService.returnLoan(id),
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
