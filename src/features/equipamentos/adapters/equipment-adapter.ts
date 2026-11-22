import type { equipmentCategories } from "@/features/equipamentos/data/equipamentos-data";
import type { Equipment } from "@/features/equipamentos/types";
import type {
  EquipmentCreateRequestDTO,
  EquipmentResponseDTO,
} from "@/features/equipamentos/dto";

type EquipmentCategory = (typeof equipmentCategories)[number];
type ApiEquipmentCategory = "Computador" | "Monitor" | "Periférico";

export const apiEquipmentCategories = [
  "Computador",
  "Monitor",
  "Periférico",
] as const satisfies readonly EquipmentCategory[];

const categoryByApiType = {
  NOTEBOOK: "Computador",
  MONITOR: "Monitor",
  HEADSET: "Periférico",
} satisfies Record<EquipmentResponseDTO["tipo"], EquipmentCategory>;

const apiTypeByCategory = {
  Computador: "NOTEBOOK",
  Monitor: "MONITOR",
  Periférico: "HEADSET",
} satisfies Record<ApiEquipmentCategory, EquipmentCreateRequestDTO["tipo"]>;

function isApiEquipmentCategory(
  category: string,
): category is ApiEquipmentCategory {
  return apiEquipmentCategories.some(
    (apiCategory) => apiCategory === category,
  );
}

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

export function mapEquipmentCategoryToApiType(
  category: string,
): EquipmentCreateRequestDTO["tipo"] | undefined {
  if (!isApiEquipmentCategory(category)) {
    return undefined;
  }

  return apiTypeByCategory[category];
}
