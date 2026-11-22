"use client";

import { useQuery } from "@tanstack/react-query";
import { collaboratorService } from "@/features/colaboradores/services/collaborator-service";

export const collaboratorsQueryKey = ["collaborators"] as const;

export function useCollaborators() {
  const query = useQuery({
    queryKey: collaboratorsQueryKey,
    queryFn: () => collaboratorService.getAll(),
  });

  return {
    ...query,
    isEmpty: query.isSuccess && query.data.length === 0,
  };
}
