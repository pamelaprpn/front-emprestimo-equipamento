export type EquipmentDataSource = "local" | "api";

function getEquipmentDataSource(
  value: string | undefined,
): EquipmentDataSource {
  if (value === undefined) {
    return "local";
  }

  if (value === "local" || value === "api") {
    return value;
  }

  throw new Error(
    'NEXT_PUBLIC_EQUIPMENT_SOURCE deve ser "local" ou "api".',
  );
}

export const equipmentDataSource = getEquipmentDataSource(
  process.env.NEXT_PUBLIC_EQUIPMENT_SOURCE,
);
