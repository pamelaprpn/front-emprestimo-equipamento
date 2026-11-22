import type { CollaboratorResponseDTO } from "@/features/colaboradores/dto";
import type { ApiCollaborator } from "@/features/colaboradores/types";

export function adaptCollaboratorResponseDTO(
  dto: CollaboratorResponseDTO,
): ApiCollaborator {
  return {
    id: String(dto.id),
    name: dto.nome,
    email: dto.email,
    cargo: dto.cargo,
  };
}
