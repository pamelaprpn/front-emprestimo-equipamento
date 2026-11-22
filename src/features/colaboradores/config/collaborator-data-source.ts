export type CollaboratorDataSource = "local" | "api";

function getCollaboratorDataSource(
  value: string | undefined,
): CollaboratorDataSource {
  if (value === undefined) {
    return "local";
  }

  if (value === "local" || value === "api") {
    return value;
  }

  throw new Error(
    'NEXT_PUBLIC_COLLABORATOR_SOURCE deve ser "local" ou "api".',
  );
}

export const collaboratorDataSource = getCollaboratorDataSource(
  process.env.NEXT_PUBLIC_COLLABORATOR_SOURCE,
);
