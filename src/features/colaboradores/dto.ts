export type CollaboratorResponseDTO = {
  id: number;
  nome: string;
  email: string;
  cargo: string;
};

export type CollaboratorCreateRequestDTO = Pick<
  CollaboratorResponseDTO,
  "nome" | "email" | "cargo"
>;
