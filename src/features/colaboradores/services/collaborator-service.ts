import { api } from "@/lib/api";
import { adaptCollaboratorResponseDTO } from "@/features/colaboradores/adapters/collaborator-adapter";
import type {
  CollaboratorCreateRequestDTO,
  CollaboratorResponseDTO,
} from "@/features/colaboradores/dto";
import type { ApiCollaborator } from "@/features/colaboradores/types";

export const collaboratorService = {
  async create(
    collaborator: CollaboratorCreateRequestDTO,
  ): Promise<CollaboratorResponseDTO> {
    const { data } = await api.post<CollaboratorResponseDTO>(
      "/colaboradores",
      collaborator,
    );

    return data;
  },

  async getAll(): Promise<ApiCollaborator[]> {
    const { data } =
      await api.get<CollaboratorResponseDTO[]>("/colaboradores");

    return data.map(adaptCollaboratorResponseDTO);
  },

  async getById(id: string): Promise<ApiCollaborator> {
    const { data } = await api.get<CollaboratorResponseDTO>(
      `/colaboradores/${encodeURIComponent(id)}`,
    );

    return adaptCollaboratorResponseDTO(data);
  },
};
