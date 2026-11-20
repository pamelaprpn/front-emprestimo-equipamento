import { X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import {
  equipmentCategories,
  equipmentStatuses,
} from "@/features/equipamentos/data/equipamentos-data";
import type {
  Equipment,
  EquipmentFormValues,
} from "@/features/equipamentos/types";

type EquipmentFormProps = {
  initialEquipment: Equipment | null;
  isAssetNumberDuplicate: (assetNumber: string) => boolean;
  isStatusLocked: boolean;
  onSubmit: (values: EquipmentFormValues) => string | null;
  onCancel: () => void;
};

type EquipmentFormError = {
  field: keyof EquipmentFormValues;
  kind: "duplicate" | "invalid" | "required";
  message: string;
};

function getInitialValues(equipment: Equipment | null): EquipmentFormValues {
  if (equipment) {
    const { name, assetNumber, category, status } = equipment;
    return { name, assetNumber, category, status };
  }

  return {
    name: "",
    assetNumber: "",
    category: equipmentCategories[0],
    status: equipmentStatuses[0],
  };
}

export default function EquipmentForm({
  initialEquipment,
  isAssetNumberDuplicate,
  isStatusLocked,
  onSubmit,
  onCancel,
}: EquipmentFormProps) {
  const [values, setValues] = useState<EquipmentFormValues>(() =>
    getInitialValues(initialEquipment),
  );
  const [formError, setFormError] = useState<EquipmentFormError | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const onCancelRef = useRef(onCancel);
  const isEditing = initialEquipment !== null;
  const statusDescription = [
    formError?.field === "status" ? "equipment-form-error" : null,
    isStatusLocked ? "equipment-status-locked-description" : null,
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

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

    dialog?.querySelector<HTMLElement>("[data-dialog-initial-focus]")?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancelRef.current();
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

  function updateField<Key extends keyof EquipmentFormValues>(
    field: Key,
    value: EquipmentFormValues[Key],
  ) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setFormError((currentError) => {
      if (!currentError || currentError.field !== field) {
        return currentError;
      }

      if (currentError.kind === "duplicate" && field === "assetNumber") {
        return isAssetNumberDuplicate(value) ? currentError : null;
      }

      if (currentError.kind === "required") {
        return value.trim() ? null : currentError;
      }

      return null;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedValues = {
      ...values,
      name: values.name.trim(),
      assetNumber: values.assetNumber.trim(),
      category: values.category.trim(),
    };

    if (
      !normalizedValues.name ||
      !normalizedValues.assetNumber ||
      !normalizedValues.category
    ) {
      const emptyField = !normalizedValues.name
        ? "name"
        : !normalizedValues.assetNumber
          ? "assetNumber"
          : "category";
      const emptyFieldLabel = {
        assetNumber: "Número de patrimônio",
        category: "Categoria",
        name: "Nome",
      }[emptyField];

      setFormError({
        field: emptyField,
        kind: "required",
        message: `Preencha o campo obrigatório: ${emptyFieldLabel}.`,
      });
      return;
    }

    const submissionError = onSubmit(normalizedValues);
    setFormError(
      submissionError
        ? {
            field: "assetNumber",
            kind: "duplicate",
            message: submissionError,
          }
        : null,
    );
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <section
        aria-labelledby="equipment-form-title"
        aria-describedby="equipment-form-description"
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
              id="equipment-form-title"
            >
              {isEditing ? "Editar equipamento" : "Novo equipamento"}
            </h2>
            <p
              className="mt-1 text-sm text-slate-500"
              id="equipment-form-description"
            >
              Informe os dados do equipamento.
            </p>
          </div>
          <button
            aria-label="Fechar formulário"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            onClick={onCancel}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {formError && (
            <p
              className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700"
              id="equipment-form-error"
              role="alert"
            >
              {formError.message}
            </p>
          )}

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="equipment-name"
            >
              Nome
            </label>
            <input
              aria-describedby={
                formError?.field === "name"
                  ? "equipment-form-error"
                  : undefined
              }
              aria-invalid={formError?.field === "name" || undefined}
              className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              data-dialog-initial-focus
              id="equipment-name"
              onChange={(event) => updateField("name", event.target.value)}
              required
              value={values.name}
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="equipment-asset-number"
            >
              Número de patrimônio
            </label>
            <input
              aria-describedby={
                formError?.field === "assetNumber"
                  ? "equipment-form-error"
                  : undefined
              }
              aria-invalid={formError?.field === "assetNumber" || undefined}
              className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              id="equipment-asset-number"
              onChange={(event) =>
                updateField("assetNumber", event.target.value)
              }
              required
              value={values.assetNumber}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-slate-700"
                htmlFor="equipment-category"
              >
                Categoria
              </label>
              <select
                aria-describedby={
                  formError?.field === "category"
                    ? "equipment-form-error"
                    : undefined
                }
                aria-invalid={formError?.field === "category" || undefined}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                id="equipment-category"
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                required
                value={values.category}
              >
                {equipmentCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-slate-700"
                htmlFor="equipment-status"
              >
                Status
              </label>
              <select
                aria-describedby={statusDescription || undefined}
                aria-invalid={formError?.field === "status" || undefined}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
                disabled={isStatusLocked}
                id="equipment-status"
                onChange={(event) => {
                  const selectedStatus = equipmentStatuses.find(
                    (status) => status === event.target.value,
                  );
                  if (selectedStatus) {
                    updateField("status", selectedStatus);
                  } else {
                    setFormError({
                      field: "status",
                      kind: "invalid",
                      message: "Selecione um status válido.",
                    });
                  }
                }}
                value={values.status}
              >
                {equipmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {isStatusLocked && (
                <p
                  className="mt-1.5 text-xs text-slate-500"
                  id="equipment-status-locked-description"
                >
                  O status não pode ser alterado enquanto houver empréstimo
                  ativo.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              onClick={onCancel}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              type="submit"
            >
              {isEditing ? "Salvar alterações" : "Cadastrar equipamento"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
