"use client";

import axios from "axios";
import { useState } from "react";
import EquipmentForm from "@/features/equipamentos/components/EquipmentForm";
import EquipmentTable from "@/features/equipamentos/components/EquipmentTable";
import EquipmentToolbar from "@/features/equipamentos/components/EquipmentToolbar";
import EquipmentDeleteConfirmation from "@/features/equipamentos/components/EquipmentDeleteConfirmation";
import {
  apiEquipmentCategories,
  mapEquipmentCategoryToApiType,
} from "@/features/equipamentos/adapters/equipment-adapter";
import { useCreateEquipment } from "@/features/equipamentos/hooks/useCreateEquipment";
import { useDeleteEquipment } from "@/features/equipamentos/hooks/useDeleteEquipment";
import { useUpdateEquipment } from "@/features/equipamentos/hooks/useUpdateEquipment";
import { useEquipments } from "@/features/equipamentos/hooks/useEquipments";
import type {
  Equipment,
  EquipmentFormValues,
  EquipmentStatus,
} from "@/features/equipamentos/types";

type EquipmentApiErrorPayload = {
  detail?: unknown;
  message?: unknown;
  mensagem?: unknown;
};

function getMutationErrorMessage(
  error: unknown,
  action: "cadastrar" | "atualizar" | "excluir",
): string {
  if (axios.isAxiosError<EquipmentApiErrorPayload>(error)) {
    const apiMessage = [
      error.response?.data?.mensagem,
      error.response?.data?.message,
      error.response?.data?.detail,
    ].find(
      (message): message is string =>
        typeof message === "string" && message.trim().length > 0,
    );

    if (apiMessage) {
      return apiMessage;
    }

    if (!error.response) {
      return "Não foi possível conectar à API. Verifique a conexão e tente novamente.";
    }
  }

  return `Não foi possível ${action} o equipamento. Tente novamente.`;
}

type EquipmentFormState =
  | { mode: "create" }
  | { mode: "edit"; equipment: Equipment }
  | null;

export default function ApiEquipmentManager() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | "Todos">(
    "Todos",
  );
  const [formState, setFormState] = useState<EquipmentFormState>(null);
  const [equipmentToDelete, setEquipmentToDelete] =
    useState<Equipment | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const query = useEquipments();
  const createEquipment = useCreateEquipment();
  const deleteEquipment = useDeleteEquipment();
  const updateEquipment = useUpdateEquipment();
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const equipment = query.data ?? [];
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      item.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
      item.assetNumber.toLocaleLowerCase("pt-BR").includes(normalizedSearch);
    const matchesStatus =
      statusFilter === "Todos" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function clearFilters() {
    setSearch("");
    setStatusFilter("Todos");
  }

  function openCreateForm() {
    setFeedback(null);
    createEquipment.reset();
    updateEquipment.reset();
    setFormState({ mode: "create" });
  }

  function openEditForm(equipmentToEdit: Equipment) {
    setFeedback(null);
    createEquipment.reset();
    updateEquipment.reset();
    setFormState({ mode: "edit", equipment: equipmentToEdit });
  }

  function closeForm() {
    setFormState(null);
  }

  function openDeleteConfirmation(equipmentToDelete: Equipment) {
    setFeedback(null);
    setDeleteError(null);
    deleteEquipment.reset();
    setEquipmentToDelete(equipmentToDelete);
  }

  function closeDeleteConfirmation() {
    if (!deleteEquipment.isPending) {
      setEquipmentToDelete(null);
      setDeleteError(null);
    }
  }

  async function confirmDelete() {
    if (!equipmentToDelete || deleteEquipment.isPending) {
      return;
    }

    setDeleteError(null);

    try {
      await deleteEquipment.mutateAsync(equipmentToDelete.id);
      setFeedback(
        `Equipamento "${equipmentToDelete.name}" excluído com sucesso.`,
      );
      setEquipmentToDelete(null);
    } catch (error: unknown) {
      setDeleteError(getMutationErrorMessage(error, "excluir"));
    }
  }

  async function submitEquipment(
    values: EquipmentFormValues,
  ): Promise<string | null> {
    const action = formState?.mode === "edit" ? "atualizar" : "cadastrar";
    const tipo = mapEquipmentCategoryToApiType(values.category);
    if (!tipo) {
      return `A categoria "${values.category}" não é aceita pela API.`;
    }

    try {
      if (formState?.mode === "edit") {
        const updatedEquipment = await updateEquipment.mutateAsync({
          id: formState.equipment.id,
          equipment: { nome: values.name, tipo },
        });

        setFeedback(
          `Equipamento "${updatedEquipment.nome}" atualizado com sucesso.`,
        );
      } else {
        const createdEquipment = await createEquipment.mutateAsync({
          patrimonio: values.assetNumber,
          nome: values.name,
          tipo,
        });

        setFeedback(
          `Equipamento "${createdEquipment.nome}" cadastrado com sucesso.`,
        );
      }

      closeForm();
      return null;
    } catch (error: unknown) {
      return getMutationErrorMessage(error, action);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Equipamentos
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Consulte os equipamentos cadastrados na API.
        </p>
      </header>

      <EquipmentToolbar
        onAddEquipment={openCreateForm}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        search={search}
        status={statusFilter}
      />

      {feedback && (
        <p
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          role="status"
        >
          {feedback}
        </p>
      )}

      {query.isError && (
        <section
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p>
            {query.data !== undefined
              ? "Não foi possível atualizar a lista de equipamentos da API. Os dados exibidos podem estar desatualizados."
              : "Não foi possível carregar os equipamentos da API."}
          </p>
          <button
            className="w-fit rounded-lg px-3 py-2 font-medium text-rose-800 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
            type="button"
          >
            {query.isFetching ? "Tentando novamente..." : "Tentar novamente"}
          </button>
        </section>
      )}

      {query.isPending ? (
        <section
          aria-busy="true"
          className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-10 text-sm text-slate-600"
          role="status"
        >
          Carregando equipamentos...
        </section>
      ) : query.isError && query.data === undefined ? null : (
        <>
          {query.isFetching && query.data !== undefined && (
            <p className="text-sm text-slate-500" role="status">
              Atualizando equipamentos...
            </p>
          )}
          <EquipmentTable
            equipment={filteredEquipment}
            isFiltered={search.trim().length > 0 || statusFilter !== "Todos"}
            onAddEquipment={openCreateForm}
            onClearFilters={clearFilters}
            onDelete={openDeleteConfirmation}
            onEdit={openEditForm}
          />
        </>
      )}

      {formState && (
        <EquipmentForm
          categoryOptions={apiEquipmentCategories}
          initialEquipment={
            formState.mode === "edit" ? formState.equipment : null
          }
          isAssetNumberReadOnly={formState.mode === "edit"}
          isStatusEditable={formState.mode !== "edit"}
          isStatusLocked={false}
          isSubmitting={
            formState.mode === "edit"
              ? updateEquipment.isPending
              : createEquipment.isPending
          }
          key={
            formState.mode === "edit"
              ? `edit-${formState.equipment.id}`
              : "create"
          }
          onCancel={closeForm}
          onSubmit={submitEquipment}
        />
      )}

      {equipmentToDelete && (
        <EquipmentDeleteConfirmation
          equipment={equipmentToDelete}
          error={deleteError}
          isDeleting={deleteEquipment.isPending}
          onCancel={closeDeleteConfirmation}
          onConfirm={() => void confirmDelete()}
        />
      )}
    </div>
  );
}
