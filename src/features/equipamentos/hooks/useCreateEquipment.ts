"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EquipmentCreateRequestDTO } from "@/features/equipamentos/dto";
import { equipmentService } from "@/features/equipamentos/services/equipment-service";
import { equipmentsQueryKey } from "@/features/equipamentos/hooks/useEquipments";

export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (equipment: EquipmentCreateRequestDTO) =>
      equipmentService.create(equipment),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: equipmentsQueryKey }),
  });
}
