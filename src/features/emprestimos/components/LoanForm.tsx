import { X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import type { Collaborator } from "@/features/colaboradores/types";
import type { Equipment } from "@/features/equipamentos/types";
import type { LoanCreationValues } from "@/features/emprestimos/types";

type LoanFormCollaborator = Pick<Collaborator, "id" | "name"> & {
  email?: string;
  registrationNumber?: string;
};

type LoanFormProps = {
  equipment: readonly Readonly<Equipment>[];
  collaborators: readonly Readonly<LoanFormCollaborator>[];
  onSubmit: (
    values: LoanCreationValues,
  ) => string | null | Promise<string | null>;
  onCancel: () => void;
  collaboratorEmptyLabel?: string;
  isSubmitting?: boolean;
};

type LoanFormError = {
  field: keyof LoanCreationValues | "form";
  kind: "operation" | "required";
  message: string;
};

function getInitialValues(): LoanCreationValues {
  return {
    equipmentId: "",
    collaboratorId: "",
  };
}

export default function LoanForm({
  equipment,
  collaborators,
  onSubmit,
  onCancel,
  collaboratorEmptyLabel = "Nenhum colaborador ativo",
  isSubmitting = false,
}: LoanFormProps) {
  const [values, setValues] = useState<LoanCreationValues>(getInitialValues);
  const [formError, setFormError] = useState<LoanFormError | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const onCancelRef = useRef(onCancel);
  const submissionInProgressRef = useRef(false);
  const isSubmittingRef = useRef(isSubmitting);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  useEffect(() => {
    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const dialog = dialogRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusableElements = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      ).filter((element) => element.getAttribute("aria-hidden") !== "true");

    const initialFocusTarget =
      dialog?.querySelector<HTMLElement>(
        "[data-dialog-initial-focus]:not([disabled])",
      ) ?? getFocusableElements()[0];
    initialFocusTarget?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (
          !isSubmittingRef.current &&
          !submissionInProgressRef.current
        ) {
          onCancelRef.current();
        }
        return;
      }

      if (event.key !== "Tab" || !dialog) {
        return;
      }

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        dialog.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === firstElement ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === lastElement ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, []);

  function updateField<Key extends keyof LoanCreationValues>(
    field: Key,
    value: LoanCreationValues[Key],
  ) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setFormError((currentError) => {
      if (!currentError) {
        return null;
      }

      if (currentError.field === "form") {
        return null;
      }

      if (currentError.field === field && currentError.kind === "required") {
        return value.trim() ? null : currentError;
      }

      return currentError;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || submissionInProgressRef.current) {
      return;
    }

    const normalizedValues: LoanCreationValues = {
      ...values,
      equipmentId: values.equipmentId.trim(),
      collaboratorId: values.collaboratorId.trim(),
    };
    const requiredFields = [
      {
        field: "equipmentId",
        label: "Equipamento",
        value: normalizedValues.equipmentId,
      },
      {
        field: "collaboratorId",
        label: "Colaborador",
        value: normalizedValues.collaboratorId,
      },
    ] as const;
    const emptyField = requiredFields.find(({ value }) => !value);

    if (emptyField) {
      setFormError({
        field: emptyField.field,
        kind: "required",
        message: `Preencha o campo obrigatório: ${emptyField.label}.`,
      });
      return;
    }

    const submissionResult = onSubmit(normalizedValues);
    if (submissionResult instanceof Promise) {
      submissionInProgressRef.current = true;
      void submissionResult
        .then((submissionError) => {
          setFormError(
            submissionError
              ? {
                  field: "form",
                  kind: "operation",
                  message: submissionError,
                }
              : null,
          );
        })
        .catch((error: unknown) => {
          setFormError({
            field: "form",
            kind: "operation",
            message:
              error instanceof Error
                ? error.message
                : "Não foi possível registrar o empréstimo.",
          });
        })
        .finally(() => {
          submissionInProgressRef.current = false;
        });
      return;
    }

    setFormError(
      submissionResult
        ? {
            field: "form",
            kind: "operation",
            message: submissionResult,
          }
        : null,
    );
  }

  function handleCancel() {
    if (!isSubmitting && !submissionInProgressRef.current) {
      onCancel();
    }
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <section
        aria-labelledby="loan-form-title"
        aria-describedby="loan-form-description"
        aria-modal="true"
        className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl sm:p-6"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              className="text-lg font-semibold text-slate-900"
              id="loan-form-title"
            >
              Novo empréstimo
            </h2>
            <p
              className="mt-1 text-sm text-slate-500"
              id="loan-form-description"
            >
              Informe o equipamento e o colaborador. As datas serão definidas
              automaticamente.
            </p>
          </div>
          <button
            aria-label="Fechar formulário"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            onClick={handleCancel}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <form className="mt-5 space-y-4" noValidate onSubmit={handleSubmit}>
          {formError && (
            <p
              className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700"
              id="loan-form-error"
              role="alert"
            >
              {formError.message}
            </p>
          )}

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="loan-equipment"
            >
              Equipamento
            </label>
            <select
              aria-describedby={
                formError?.field === "equipmentId"
                  ? "loan-form-error"
                  : undefined
              }
              aria-invalid={formError?.field === "equipmentId" || undefined}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
              data-dialog-initial-focus
              disabled={isSubmitting || equipment.length === 0}
              id="loan-equipment"
              onChange={(event) =>
                updateField("equipmentId", event.target.value)
              }
              required
              value={values.equipmentId}
            >
              <option value="">
                {equipment.length === 0
                  ? "Nenhum equipamento disponível"
                  : "Selecione um equipamento"}
              </option>
              {equipment.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.assetNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="loan-collaborator"
            >
              Colaborador
            </label>
            <select
              aria-describedby={
                formError?.field === "collaboratorId"
                  ? "loan-form-error"
                  : undefined
              }
              aria-invalid={formError?.field === "collaboratorId" || undefined}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
              disabled={isSubmitting || collaborators.length === 0}
              id="loan-collaborator"
              onChange={(event) =>
                updateField("collaboratorId", event.target.value)
              }
              required
              value={values.collaboratorId}
            >
              <option value="">
                {collaborators.length === 0
                  ? collaboratorEmptyLabel
                  : "Selecione um colaborador"}
              </option>
              {collaborators.map((collaborator) => (
                <option key={collaborator.id} value={collaborator.id}>
                  {collaborator.name}
                  {(collaborator.registrationNumber || collaborator.email) &&
                    ` — ${collaborator.registrationNumber || collaborator.email}`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              onClick={handleCancel}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Registrando..." : "Registrar empréstimo"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
