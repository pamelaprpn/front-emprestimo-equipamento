"use client";

import { X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";

type CollaboratorFormValues = {
  name: string;
  email: string;
  cargo: string;
};

type ApiCollaboratorFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: CollaboratorFormValues) => Promise<string | null>;
  onCancel: () => void;
};

type FormError = {
  field: keyof CollaboratorFormValues | "form";
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClassName =
  "h-11 w-full rounded-xl border border-slate-300 px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

export default function ApiCollaboratorForm({
  isSubmitting,
  onSubmit,
  onCancel,
}: ApiCollaboratorFormProps) {
  const [values, setValues] = useState<CollaboratorFormValues>({
    name: "",
    email: "",
    cargo: "",
  });
  const [formError, setFormError] = useState<FormError | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const onCancelRef = useRef(onCancel);
  const submissionInProgressRef = useRef(false);

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
        if (!submissionInProgressRef.current) {
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || submissionInProgressRef.current) {
      return;
    }

    const normalizedValues = {
      name: values.name.trim(),
      email: values.email.trim(),
      cargo: values.cargo.trim(),
    };
    const emptyField = (
      ["name", "email", "cargo"] as const
    ).find((field) => !normalizedValues[field]);

    if (emptyField) {
      setFormError({
        field: emptyField,
        message: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    if (!emailPattern.test(normalizedValues.email)) {
      setFormError({
        field: "email",
        message: "Informe um e-mail válido.",
      });
      return;
    }

    submissionInProgressRef.current = true;
    setFormError(null);

    try {
      const submissionError = await onSubmit(normalizedValues);
      if (submissionError) {
        setFormError({ field: "form", message: submissionError });
      }
    } catch {
      setFormError({
        field: "form",
        message: "Não foi possível cadastrar o colaborador. Tente novamente.",
      });
    } finally {
      submissionInProgressRef.current = false;
    }
  }

  function updateField(field: keyof CollaboratorFormValues, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
    setFormError(null);
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <section
        aria-labelledby="api-collaborator-form-title"
        aria-describedby="api-collaborator-form-description"
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
              id="api-collaborator-form-title"
            >
              Novo colaborador
            </h2>
            <p
              className="mt-1 text-sm text-slate-500"
              id="api-collaborator-form-description"
            >
              Informe os dados do colaborador.
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
              id="api-collaborator-form-error"
              role="alert"
            >
              {formError.message}
            </p>
          )}

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="api-collaborator-name"
            >
              Nome
            </label>
            <input
              aria-describedby={
                formError?.field === "name" || formError?.field === "form"
                  ? "api-collaborator-form-error"
                  : undefined
              }
              aria-invalid={formError?.field === "name" || undefined}
              autoComplete="name"
              className={inputClassName}
              data-dialog-initial-focus
              disabled={isSubmitting}
              id="api-collaborator-name"
              onChange={(event) => updateField("name", event.target.value)}
              required
              value={values.name}
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="api-collaborator-email"
            >
              E-mail
            </label>
            <input
              aria-describedby={
                formError?.field === "email" || formError?.field === "form"
                  ? "api-collaborator-form-error"
                  : undefined
              }
              aria-invalid={formError?.field === "email" || undefined}
              autoComplete="email"
              className={inputClassName}
              disabled={isSubmitting}
              id="api-collaborator-email"
              onChange={(event) => updateField("email", event.target.value)}
              required
              type="email"
              value={values.email}
            />
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="api-collaborator-cargo"
            >
              Cargo
            </label>
            <input
              aria-describedby={
                formError?.field === "cargo" || formError?.field === "form"
                  ? "api-collaborator-form-error"
                  : undefined
              }
              aria-invalid={formError?.field === "cargo" || undefined}
              autoComplete="organization-title"
              className={inputClassName}
              disabled={isSubmitting}
              id="api-collaborator-cargo"
              onChange={(event) => updateField("cargo", event.target.value)}
              required
              value={values.cargo}
            />
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
              {isSubmitting ? "Cadastrando..." : "Cadastrar colaborador"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
