export type EquipmentResponseDTO = {
  id: number;
  patrimonio: string;
  nome: string;
  tipo: "NOTEBOOK" | "MONITOR" | "HEADSET";
  disponivel: boolean;
};

export type EquipmentCreateRequestDTO = Pick<
  EquipmentResponseDTO,
  "patrimonio" | "nome" | "tipo"
>;

export type EquipmentUpdateRequestDTO = Pick<
  EquipmentResponseDTO,
  "nome" | "tipo"
>;
