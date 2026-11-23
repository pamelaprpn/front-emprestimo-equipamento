"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CollaboratorCreateRequestDTO } from "@/features/colaboradores/dto";
import { collaboratorsQueryKey } from "@/features/colaboradores/hooks/useCollaborators";
import { collaboratorService } from "@/features/colaboradores/services/collaborator-service";

export function useCreateCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collaborator: CollaboratorCreateRequestDTO) =>
      collaboratorService.create(collaborator),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: collaboratorsQueryKey }),
  });
}
