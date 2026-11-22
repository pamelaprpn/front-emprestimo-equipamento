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

export type ApiCollaborator = Pick<Collaborator, "id" | "name" | "email"> & {
  cargo: string;
};

export type CollaboratorFormValues = Omit<Collaborator, "id">;
