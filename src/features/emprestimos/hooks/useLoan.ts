"use client";

import { useQuery } from "@tanstack/react-query";
import { loanService } from "@/features/emprestimos/services/loan-service";
import { loanQueryKey } from "@/features/emprestimos/hooks/useLoans";

export function useLoan(id: string) {
  return useQuery({
    queryKey: loanQueryKey(id),
    queryFn: () => loanService.getById(id),
    enabled: id.trim().length > 0,
  });
}
