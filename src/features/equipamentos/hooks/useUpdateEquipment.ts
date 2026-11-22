"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EquipmentUpdateRequestDTO } from "@/features/equipamentos/dto";
import { equipmentService } from "@/features/equipamentos/services/equipment-service";
import { equipmentsQueryKey } from "@/features/equipamentos/hooks/useEquipments";

type UpdateEquipmentVariables = {
  id: string;
  equipment: EquipmentUpdateRequestDTO;
};

export function useUpdateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, equipment }: UpdateEquipmentVariables) =>
      equipmentService.update(id, equipment),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: equipmentsQueryKey }),
  });
}
