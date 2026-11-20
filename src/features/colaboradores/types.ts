export type CollaboratorStatus = "Ativo" | "Inativo";

export type Collaborator = {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  department: string;
  phone?: string;
  status: CollaboratorStatus;
};

export type CollaboratorFormValues = Omit<Collaborator, "id">;
