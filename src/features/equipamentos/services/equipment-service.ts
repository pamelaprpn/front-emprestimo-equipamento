import { api } from "@/lib/api";
import { adaptEquipmentResponseDTO } from "@/features/equipamentos/adapters/equipment-adapter";
import type { EquipmentResponseDTO } from "@/features/equipamentos/dto";
import type { Equipment } from "@/features/equipamentos/types";

export const equipmentService = {
  async getAll(): Promise<Equipment[]> {
    const { data } = await api.get<EquipmentResponseDTO[]>("/equipamentos");

    return data.map(adaptEquipmentResponseDTO);
  },
};
