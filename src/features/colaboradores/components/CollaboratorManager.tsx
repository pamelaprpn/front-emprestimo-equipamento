"use client";

import { useState } from "react";
import CollaboratorForm from "@/features/colaboradores/components/CollaboratorForm";
import CollaboratorTable from "@/features/colaboradores/components/CollaboratorTable";
import CollaboratorToolbar from "@/features/colaboradores/components/CollaboratorToolbar";
import { collaboratorData } from "@/features/colaboradores/data/colaboradores-data";
import type {
  Collaborator,
  CollaboratorFormValues,
  CollaboratorStatus,
} from "@/features/colaboradores/types";

type CollaboratorFormState =
  | { mode: "create" }
  | { mode: "edit"; collaborator: Collaborator }
  | null;

export default function CollaboratorManager() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => [
    ...collaboratorData,
  ]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    CollaboratorStatus | "Todos"
  >("Todos");
  const [formState, setFormState] = useState<CollaboratorFormState>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

  const filteredCollaborators = collaborators.filter((collaborator) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      collaborator.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
      collaborator.registrationNumber
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedSearch) ||
      collaborator.email.toLocaleLowerCase("pt-BR").includes(normalizedSearch);
    const matchesStatus =
      statusFilter === "Todos" || collaborator.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function openCreateForm() {
    setFeedback(null);
    setFormState({ mode: "create" });
  }

  function openEditForm(collaborator: Collaborator) {
    setFeedback(null);
    setFormState({ mode: "edit", collaborator });
  }

  function closeForm() {
    setFormState(null);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("Todos");
  }

  function hasDuplicateRegistration(registrationNumber: string) {
    const normalizedRegistration = registrationNumber
      .trim()
      .toLocaleLowerCase("pt-BR");
    const editingId =
      formState?.mode === "edit" ? formState.collaborator.id : null;

    return collaborators.some(
      (collaborator) =>
        collaborator.id !== editingId &&
        collaborator.registrationNumber
          .trim()
          .toLocaleLowerCase("pt-BR") === normalizedRegistration,
    );
  }

  function saveCollaborator(
    values: CollaboratorFormValues,
  ): string | null {
    if (!formState) {
      return null;
    }

    if (hasDuplicateRegistration(values.registrationNumber)) {
      return "Já existe um colaborador com essa matrícula.";
    }

    if (formState.mode === "edit") {
      setCollaborators((currentCollaborators) =>
        currentCollaborators.map((collaborator) =>
          collaborator.id === formState.collaborator.id
            ? { ...collaborator, ...values }
            : collaborator,
        ),
      );
      setFeedback(`Colaborador "${values.name}" atualizado com sucesso.`);
    } else {
      setCollaborators((currentCollaborators) => [
        ...currentCollaborators,
        { id: crypto.randomUUID(), ...values },
      ]);
      setFeedback(`Colaborador "${values.name}" cadastrado com sucesso.`);
    }

    closeForm();
    return null;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Colaboradores
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Consulte e gerencie os colaboradores cadastrados.
        </p>
      </header>

      {feedback && (
        <p
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          {feedback}
        </p>
      )}

      <CollaboratorToolbar
        onAddCollaborator={openCreateForm}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        search={search}
        status={statusFilter}
      />

      <CollaboratorTable
        collaborators={filteredCollaborators}
        isFiltered={search.trim().length > 0 || statusFilter !== "Todos"}
        onAddCollaborator={openCreateForm}
        onClearFilters={clearFilters}
        onEdit={openEditForm}
      />

      {formState && (
        <CollaboratorForm
          initialCollaborator={
            formState.mode === "edit" ? formState.collaborator : null
          }
          isRegistrationDuplicate={hasDuplicateRegistration}
          key={
            formState.mode === "edit"
              ? formState.collaborator.id
              : "new-collaborator"
          }
          onCancel={closeForm}
          onSubmit={saveCollaborator}
        />
      )}
    </div>
  );
}
