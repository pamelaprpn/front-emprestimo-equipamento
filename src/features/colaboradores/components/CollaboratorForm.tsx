import { X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { collaboratorStatuses } from "@/features/colaboradores/data/colaboradores-data";
import type {
  Collaborator,
  CollaboratorFormValues,
} from "@/features/colaboradores/types";

type CollaboratorFormProps = {
  initialCollaborator: Collaborator | null;
  isRegistrationDuplicate: (registrationNumber: string) => boolean;
  isEmailDuplicate: (email: string) => boolean;
  onSubmit: (values: CollaboratorFormValues) => string | null;
  onCancel: () => void;
};

type CollaboratorFormError = {
  field: keyof CollaboratorFormValues | "form";
  kind: "duplicate" | "email" | "invalid" | "operation" | "required";
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInitialValues(
  collaborator: Collaborator | null,
): CollaboratorFormValues {
  if (collaborator) {
    const {
      name,
      registrationNumber,
      email,
      department,
      phone,
      status,
    } = collaborator;

    return {
      name,
      registrationNumber,
      email,
      department,
      phone: phone ?? "",
      status,
    };
  }

  return {
    name: "",
    registrationNumber: "",
    email: "",
    department: "",
    phone: "",
    status: collaboratorStatuses[0],
  };
}

export default function CollaboratorForm({
  initialCollaborator,
  isRegistrationDuplicate,
  isEmailDuplicate,
  onSubmit,
  onCancel,
}: CollaboratorFormProps) {
  const [values, setValues] = useState<CollaboratorFormValues>(() =>
    getInitialValues(initialCollaborator),
  );
  const [formError, setFormError] =
    useState<CollaboratorFormError | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const onCancelRef = useRef(onCancel);
  const isEditing = initialCollaborator !== null;

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

  function updateField<Key extends keyof CollaboratorFormValues>(
    field: Key,
    value: CollaboratorFormValues[Key],
  ) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setFormError((currentError) => {
      if (!currentError) {
        return currentError;
      }

      if (currentError.field === "form") {
        return null;
      }

      if (currentError.field !== field) {
        return currentError;
      }

      const fieldValue = typeof value === "string" ? value : "";

      if (
        currentError.kind === "duplicate" &&
        field === "registrationNumber"
      ) {
        return isRegistrationDuplicate(fieldValue) ? currentError : null;
      }

      if (currentError.kind === "duplicate" && field === "email") {
        return isEmailDuplicate(fieldValue) ? currentError : null;
      }

      if (currentError.kind === "required") {
        return fieldValue.trim() ? null : currentError;
      }

      if (currentError.kind === "email" && field === "email") {
        return emailPattern.test(fieldValue.trim()) ? null : currentError;
      }

      return null;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedValues: CollaboratorFormValues = {
      ...values,
      name: values.name.trim(),
      registrationNumber: values.registrationNumber.trim(),
      email: values.email.trim(),
      department: values.department.trim(),
      phone: values.phone?.trim() ?? "",
    };
    const requiredFields = [
      { field: "name", label: "Nome", value: normalizedValues.name },
      {
        field: "registrationNumber",
        label: "Matrícula",
        value: normalizedValues.registrationNumber,
      },
      { field: "email", label: "E-mail", value: normalizedValues.email },
      {
        field: "department",
        label: "Departamento",
        value: normalizedValues.department,
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

    if (!emailPattern.test(normalizedValues.email)) {
      setFormError({
        field: "email",
        kind: "email",
        message: "Informe um e-mail válido.",
      });
      return;
    }

    if (
      isRegistrationDuplicate(normalizedValues.registrationNumber)
    ) {
      setFormError({
        field: "registrationNumber",
        kind: "duplicate",
        message: "Já existe um colaborador com essa matrícula.",
      });
      return;
    }

    if (isEmailDuplicate(normalizedValues.email)) {
      setFormError({
        field: "email",
        kind: "duplicate",
        message: "Já existe um colaborador com esse e-mail.",
      });
      return;
    }

    const submissionError = onSubmit(normalizedValues);
    setFormError(
      submissionError
        ? {
            field: "form",
            kind: "operation",
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
        aria-labelledby="collaborator-form-title"
        aria-describedby="collaborator-form-description"
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
              id="collaborator-form-title"
            >
              {isEditing ? "Editar colaborador" : "Novo colaborador"}
            </h2>
            <p
              className="mt-1 text-sm text-slate-500"
              id="collaborator-form-description"
            >
              Informe os dados do colaborador.
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

        <form className="mt-5 space-y-4" noValidate onSubmit={handleSubmit}>
          {formError && (
            <p
              className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700"
              id="collaborator-form-error"
              role="alert"
            >
              {formError.message}
            </p>
          )}

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="collaborator-name"
            >
              Nome
            </label>
            <input
              aria-describedby={
                formError?.field === "name"
                  ? "collaborator-form-error"
                  : undefined
              }
              aria-invalid={formError?.field === "name" || undefined}
              autoComplete="name"
              className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              data-dialog-initial-focus
              id="collaborator-name"
              onChange={(event) => updateField("name", event.target.value)}
              required
              value={values.name}
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="collaborator-registration-number"
            >
              Matrícula
            </label>
            <input
              aria-describedby={
                formError?.field === "registrationNumber"
                  ? "collaborator-form-error"
                  : undefined
              }
              aria-invalid={
                formError?.field === "registrationNumber" || undefined
              }
              autoComplete="off"
              className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              id="collaborator-registration-number"
              onChange={(event) =>
                updateField("registrationNumber", event.target.value)
              }
              required
              value={values.registrationNumber}
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="collaborator-email"
            >
              E-mail
            </label>
            <input
              aria-describedby={
                formError?.field === "email"
                  ? "collaborator-form-error"
                  : undefined
              }
              aria-invalid={formError?.field === "email" || undefined}
              autoComplete="email"
              className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              id="collaborator-email"
              onChange={(event) => updateField("email", event.target.value)}
              required
              type="email"
              value={values.email}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-slate-700"
                htmlFor="collaborator-department"
              >
                Departamento
              </label>
              <input
                aria-describedby={
                  formError?.field === "department"
                    ? "collaborator-form-error"
                    : undefined
                }
                aria-invalid={formError?.field === "department" || undefined}
                autoComplete="organization"
                className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                id="collaborator-department"
                onChange={(event) =>
                  updateField("department", event.target.value)
                }
                required
                value={values.department}
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-slate-700"
                htmlFor="collaborator-phone"
              >
                Telefone <span className="font-normal text-slate-500">(opcional)</span>
              </label>
              <input
                autoComplete="tel"
                className="h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                id="collaborator-phone"
                onChange={(event) => updateField("phone", event.target.value)}
                type="tel"
                value={values.phone ?? ""}
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="collaborator-status"
            >
              Status
            </label>
            <select
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              id="collaborator-status"
              onChange={(event) => {
                const selectedStatus = collaboratorStatuses.find(
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
              {collaboratorStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
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
              {isEditing ? "Salvar alterações" : "Cadastrar colaborador"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
