"use client";

import { useQuery } from "@tanstack/react-query";
import { equipmentService } from "@/features/equipamentos/services/equipment-service";

export const equipmentsQueryKey = ["equipments"] as const;

export function useEquipments() {
  return useQuery({
    queryKey: equipmentsQueryKey,
    queryFn: () => equipmentService.getAll(),
  });
}
