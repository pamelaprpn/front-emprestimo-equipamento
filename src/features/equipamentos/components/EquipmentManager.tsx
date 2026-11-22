"use client";

import { useState } from "react";
import EquipmentForm from "@/features/equipamentos/components/EquipmentForm";
import EquipmentTable from "@/features/equipamentos/components/EquipmentTable";
import EquipmentToolbar from "@/features/equipamentos/components/EquipmentToolbar";
import ApiEquipmentManager from "@/features/equipamentos/components/ApiEquipmentManager";
import { useAppData } from "@/components/providers/AppDataProvider";
import { equipmentDataSource } from "@/features/equipamentos/config/equipment-data-source";
import { hasActiveLoanForEquipment } from "@/features/emprestimos/utils/loan-rules";
import type {
  Equipment,
  EquipmentFormValues,
  EquipmentStatus,
} from "@/features/equipamentos/types";

type EquipmentFormState =
  | { mode: "create" }
  | { mode: "edit"; equipment: Equipment }
  | null;

export default function EquipmentManager() {
  return equipmentDataSource === "api" ? (
    <ApiEquipmentManager />
  ) : (
    <LocalEquipmentManager />
  );
}

function LocalEquipmentManager() {
  const {
    equipment,
    loans,
    createEquipment,
    updateEquipment,
    hasDuplicateAssetNumber,
  } = useAppData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | "Todos">(
    "Todos",
  );
  const [formState, setFormState] = useState<EquipmentFormState>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      item.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
      item.assetNumber.toLocaleLowerCase("pt-BR").includes(normalizedSearch);
    const matchesStatus =
      statusFilter === "Todos" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function openCreateForm() {
    setFeedback(null);
    setFormState({ mode: "create" });
  }

  function openEditForm(item: Equipment) {
    setFeedback(null);
    setFormState({ mode: "edit", equipment: item });
  }

  function closeForm() {
    setFormState(null);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("Todos");
  }

  function saveEquipment(values: EquipmentFormValues): string | null {
    if (!formState) {
      return null;
    }

    const result =
      formState.mode === "edit"
        ? updateEquipment(formState.equipment.id, values)
        : createEquipment(values);
    if (!result.ok) {
      return result.error;
    }

    setFeedback(
      formState.mode === "edit"
        ? `Equipamento "${values.name}" atualizado com sucesso.`
        : `Equipamento "${values.name}" cadastrado com sucesso.`,
    );
    closeForm();
    return null;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Equipamentos
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Consulte e gerencie os equipamentos cadastrados.
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

      <EquipmentToolbar
        onAddEquipment={openCreateForm}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        search={search}
        status={statusFilter}
      />

      <EquipmentTable
        equipment={filteredEquipment}
        isFiltered={search.trim().length > 0 || statusFilter !== "Todos"}
        onAddEquipment={openCreateForm}
        onClearFilters={clearFilters}
        onEdit={openEditForm}
      />

      {formState && (
        <EquipmentForm
          initialEquipment={
            formState.mode === "edit" ? formState.equipment : null
          }
          key={
            formState.mode === "edit"
              ? formState.equipment.id
              : "new-equipment"
          }
          isAssetNumberDuplicate={(assetNumber) =>
            hasDuplicateAssetNumber(
              assetNumber,
              formState.mode === "edit"
                ? formState.equipment.id
                : undefined,
            )
          }
          isStatusLocked={
            formState.mode === "edit" &&
            hasActiveLoanForEquipment(loans, formState.equipment.id)
          }
          onCancel={closeForm}
          onSubmit={saveEquipment}
        />
      )}
    </div>
  );
}
