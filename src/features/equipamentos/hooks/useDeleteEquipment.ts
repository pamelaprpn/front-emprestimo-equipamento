"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { equipmentService } from "@/features/equipamentos/services/equipment-service";
import { equipmentsQueryKey } from "@/features/equipamentos/hooks/useEquipments";

export function useDeleteEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => equipmentService.delete(id),
    onSuccess: () =>
      queryClient.invalidateQueries(
        { queryKey: equipmentsQueryKey },
        { throwOnError: false },
      ),
  });
}
