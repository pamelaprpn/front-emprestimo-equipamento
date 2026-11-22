export type EquipmentResponseDTO = {
  id: number;
  patrimonio: string;
  nome: string;
  tipo: "NOTEBOOK" | "MONITOR" | "HEADSET";
  disponivel: boolean;
};
