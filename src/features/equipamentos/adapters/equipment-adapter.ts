import type { equipmentCategories } from "@/features/equipamentos/data/equipamentos-data";
import type { Equipment } from "@/features/equipamentos/types";
import type { EquipmentResponseDTO } from "@/features/equipamentos/dto";

type EquipmentCategory = (typeof equipmentCategories)[number];

const categoryByApiType = {
  NOTEBOOK: "Computador",
  MONITOR: "Monitor",
  HEADSET: "Periférico",
} satisfies Record<EquipmentResponseDTO["tipo"], EquipmentCategory>;

export function adaptEquipmentResponseDTO(
  dto: EquipmentResponseDTO,
): Equipment {
  return {
    id: String(dto.id),
    name: dto.nome,
    assetNumber: dto.patrimonio,
    category: categoryByApiType[dto.tipo],
    status: dto.disponivel ? "Disponível" : "Emprestado",
  };
}
