"use client";

import { useQuery } from "@tanstack/react-query";
import { loanService } from "@/features/emprestimos/services/loan-service";

export const loansQueryKey = ["loans"] as const;
export const allLoansQueryKey = [...loansQueryKey, "list", "all"] as const;
export const overdueLoansQueryKey = [
  ...loansQueryKey,
  "list",
  "overdue",
] as const;
export const loanQueryKey = (id: string) =>
  [...loansQueryKey, "detail", id] as const;

export function useLoans(atrasados?: boolean) {
  const isOverdueQuery = atrasados === true;
  const query = useQuery({
    queryKey: isOverdueQuery ? overdueLoansQueryKey : allLoansQueryKey,
    queryFn: () => loanService.getAll(isOverdueQuery ? true : undefined),
  });

  return {
    ...query,
    isEmpty: query.isSuccess && query.data.length === 0,
  };
}
