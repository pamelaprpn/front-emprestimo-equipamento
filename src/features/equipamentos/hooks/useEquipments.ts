"use client";

import { useQuery } from "@tanstack/react-query";
import { equipmentService } from "@/features/equipamentos/services/equipment-service";

export function useEquipments() {
  return useQuery({
    queryKey: ["equipments"],
    queryFn: () => equipmentService.getAll(),
  });
}
