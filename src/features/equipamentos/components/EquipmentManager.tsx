"use client";

import { useState } from "react";
import EquipmentForm from "@/features/equipamentos/components/EquipmentForm";
import EquipmentTable from "@/features/equipamentos/components/EquipmentTable";
import EquipmentToolbar from "@/features/equipamentos/components/EquipmentToolbar";
import { equipmentData } from "@/features/equipamentos/data/equipamentos-data";
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
  const [equipment, setEquipment] = useState<Equipment[]>(() => [
    ...equipmentData,
  ]);
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

  function hasDuplicateAssetNumber(assetNumber: string) {
    const normalizedAssetNumber = assetNumber
      .trim()
      .toLocaleLowerCase("pt-BR");
    const editingId =
      formState?.mode === "edit" ? formState.equipment.id : null;

    return equipment.some(
      (item) =>
        item.id !== editingId &&
        item.assetNumber.trim().toLocaleLowerCase("pt-BR") ===
          normalizedAssetNumber,
    );
  }

  function saveEquipment(values: EquipmentFormValues): string | null {
    if (!formState) {
      return null;
    }

    if (hasDuplicateAssetNumber(values.assetNumber)) {
      return "Já existe um equipamento com esse número de patrimônio.";
    }

    if (formState.mode === "edit") {
      setEquipment((currentEquipment) =>
        currentEquipment.map((item) =>
          item.id === formState.equipment.id
            ? { ...item, ...values }
            : item,
        ),
      );
      setFeedback(`Equipamento "${values.name}" atualizado com sucesso.`);
    } else {
      setEquipment((currentEquipment) => [
        ...currentEquipment,
        { id: crypto.randomUUID(), ...values },
      ]);
      setFeedback(`Equipamento "${values.name}" cadastrado com sucesso.`);
    }

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
          isAssetNumberDuplicate={hasDuplicateAssetNumber}
          onCancel={closeForm}
          onSubmit={saveEquipment}
        />
      )}
    </div>
  );
}
