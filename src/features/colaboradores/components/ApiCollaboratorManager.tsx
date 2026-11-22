"use client";

import { PackageOpen } from "lucide-react";
import { useCollaborators } from "@/features/colaboradores/hooks/useCollaborators";

export default function ApiCollaboratorManager() {
  const query = useCollaborators();
  const collaborators = query.data ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Colaboradores
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Consulte os colaboradores cadastrados na API.
        </p>
      </header>

      {query.isError && (
        <section
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p>
            {query.data !== undefined
              ? "Não foi possível atualizar a lista de colaboradores da API. Os dados exibidos podem estar desatualizados."
              : "Não foi possível carregar os colaboradores da API."}
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
          Carregando colaboradores...
        </section>
      ) : query.isError && query.data === undefined ? null : query.isEmpty ? (
        <section className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <PackageOpen aria-hidden="true" size={22} />
          </span>
          <h2 className="mt-4 text-base font-semibold text-slate-900">
            Nenhum colaborador cadastrado
          </h2>
          <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
            A API não retornou colaboradores.
          </p>
        </section>
      ) : (
        <>
          {query.isFetching && query.data !== undefined && (
            <p className="text-sm text-slate-500" role="status">
              Atualizando colaboradores...
            </p>
          )}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="-mx-px overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5" scope="col">
                      Nome
                    </th>
                    <th className="px-5 py-3.5" scope="col">
                      E-mail
                    </th>
                    <th className="px-5 py-3.5" scope="col">
                      Cargo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {collaborators.map((collaborator) => (
                    <tr
                      className="transition-colors hover:bg-slate-50/70"
                      key={collaborator.id}
                    >
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {collaborator.name}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {collaborator.email}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {collaborator.cargo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              {collaborators.length}{" "}
              {collaborators.length === 1 ? "colaborador" : "colaboradores"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
