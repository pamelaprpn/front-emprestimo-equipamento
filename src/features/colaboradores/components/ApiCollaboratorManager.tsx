"use client";

import axios from "axios";
import { PackageOpen, Plus } from "lucide-react";
import { useState } from "react";
import ApiCollaboratorForm from "@/features/colaboradores/components/ApiCollaboratorForm";
import { useCollaborators } from "@/features/colaboradores/hooks/useCollaborators";
import { useCreateCollaborator } from "@/features/colaboradores/hooks/useCreateCollaborator";

type CollaboratorApiErrorPayload = {
  detail?: unknown;
  message?: unknown;
  mensagem?: unknown;
};

function getCreateErrorMessage(error: unknown): string {
  if (axios.isAxiosError<CollaboratorApiErrorPayload>(error)) {
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

  return "Não foi possível cadastrar o colaborador. Tente novamente.";
}

export default function ApiCollaboratorManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const query = useCollaborators();
  const createCollaborator = useCreateCollaborator();
  const collaborators = query.data ?? [];

  function openCreateForm() {
    setFeedback(null);
    createCollaborator.reset();
    setIsFormOpen(true);
  }

  function closeForm() {
    if (!createCollaborator.isPending) {
      setIsFormOpen(false);
    }
  }

  async function submitCollaborator(values: {
    name: string;
    email: string;
    cargo: string;
  }): Promise<string | null> {
    try {
      const createdCollaborator = await createCollaborator.mutateAsync({
        nome: values.name,
        email: values.email,
        cargo: values.cargo,
      });

      setFeedback(
        `Colaborador "${createdCollaborator.nome}" cadastrado com sucesso.`,
      );
      setIsFormOpen(false);
      return null;
    } catch (error: unknown) {
      return getCreateErrorMessage(error);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Colaboradores
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Consulte os colaboradores cadastrados na API.
          </p>
        </div>
        <button
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          onClick={openCreateForm}
          type="button"
        >
          <Plus aria-hidden="true" size={17} />
          Novo colaborador
        </button>
      </header>

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

      {isFormOpen && (
        <ApiCollaboratorForm
          isSubmitting={createCollaborator.isPending}
          onCancel={closeForm}
          onSubmit={submitCollaborator}
        />
      )}
    </div>
  );
}
