import { api } from "@/lib/api";
import { adaptEquipmentResponseDTO } from "@/features/equipamentos/adapters/equipment-adapter";
import type {
  EquipmentCreateRequestDTO,
  EquipmentResponseDTO,
  EquipmentUpdateRequestDTO,
} from "@/features/equipamentos/dto";
import type { Equipment } from "@/features/equipamentos/types";

export const equipmentService = {
  async create(
    equipment: EquipmentCreateRequestDTO,
  ): Promise<EquipmentResponseDTO> {
    const { data } = await api.post<EquipmentResponseDTO>(
      "/equipamentos",
      equipment,
    );

    return data;
  },

  async update(
    id: string,
    equipment: EquipmentUpdateRequestDTO,
  ): Promise<EquipmentResponseDTO> {
    const { data } = await api.put<EquipmentResponseDTO>(
      `/equipamentos/${encodeURIComponent(id)}`,
      equipment,
    );

    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete<void>(`/equipamentos/${encodeURIComponent(id)}`);
  },

  async getAll(): Promise<Equipment[]> {
    const { data } = await api.get<EquipmentResponseDTO[]>("/equipamentos");

    return data.map(adaptEquipmentResponseDTO);
  },
};
