"use client";

import { useState } from "react";
import EquipmentTable from "@/features/equipamentos/components/EquipmentTable";
import EquipmentToolbar from "@/features/equipamentos/components/EquipmentToolbar";
import { useEquipments } from "@/features/equipamentos/hooks/useEquipments";
import type { EquipmentStatus } from "@/features/equipamentos/types";

export default function ApiEquipmentManager() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | "Todos">(
    "Todos",
  );
  const query = useEquipments();
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
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        search={search}
        showAddEquipment={false}
        status={statusFilter}
      />

      {query.isError && (
        <section
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p>Não foi possível carregar os equipamentos da API.</p>
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
            onClearFilters={clearFilters}
            readOnly
          />
        </>
      )}
    </div>
  );
}
