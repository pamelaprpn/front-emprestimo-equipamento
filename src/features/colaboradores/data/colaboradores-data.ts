import type {
  Collaborator,
  CollaboratorStatus,
} from "@/features/colaboradores/types";

export const collaboratorStatuses = [
  "Ativo",
  "Inativo",
] satisfies readonly CollaboratorStatus[];

export const collaboratorData = [
  {
    id: "collaborator-001",
    name: "Ana Costa",
    registrationNumber: "MAT-001",
    email: "ana.costa@example.test",
    department: "Tecnologia",
    phone: "+55 11 90000-0001",
    status: "Ativo",
  },
  {
    id: "collaborator-002",
    name: "Bruno Mendes",
    registrationNumber: "MAT-002",
    email: "bruno.mendes@example.test",
    department: "Financeiro",
    phone: "+55 11 90000-0002",
    status: "Ativo",
  },
  {
    id: "collaborator-003",
    name: "Camila Rocha",
    registrationNumber: "MAT-003",
    email: "camila.rocha@example.test",
    department: "Recursos Humanos",
    phone: "",
    status: "Inativo",
  },
  {
    id: "collaborator-004",
    name: "Diego Martins",
    registrationNumber: "MAT-004",
    email: "diego.martins@example.test",
    department: "Operações",
    phone: "+55 11 90000-0004",
    status: "Ativo",
  },
] satisfies readonly Collaborator[];
