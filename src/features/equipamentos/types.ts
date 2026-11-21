export type EquipmentStatus = "Disponível" | "Emprestado";

export type Equipment = {
  id: string;
  name: string;
  assetNumber: string;
  category: string;
  status: EquipmentStatus;
};

export type EquipmentFormValues = Omit<Equipment, "id">;
