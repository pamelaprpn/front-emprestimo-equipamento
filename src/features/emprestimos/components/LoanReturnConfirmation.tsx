import { X } from "lucide-react";
import { useEffect, useRef, type MouseEvent } from "react";

type LoanReturnConfirmationProps = {
  equipmentName: string;
  collaboratorName: string;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function LoanReturnConfirmation({
  equipmentName,
  collaboratorName,
  error,
  onConfirm,
  onCancel,
}: LoanReturnConfirmationProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const onCancelRef = useRef(onCancel);

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
        aria-describedby="loan-return-confirmation-description"
        aria-labelledby="loan-return-confirmation-title"
        aria-modal="true"
        className="my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6"
        ref={dialogRef}
        role="alertdialog"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              className="text-lg font-semibold text-slate-900"
              id="loan-return-confirmation-title"
            >
              Confirmar devolução
            </h2>
            <p
              className="mt-2 text-sm leading-6 text-slate-600"
              id="loan-return-confirmation-description"
            >
              Deseja registrar a devolução de {equipmentName} para{" "}
              {collaboratorName}? A data efetiva será a data de hoje.
            </p>
          </div>
          <button
            aria-label="Cancelar devolução"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            onClick={onCancel}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        {error && (
          <p
            className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700"
            id="loan-return-confirmation-error"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            data-dialog-initial-focus
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            onClick={onConfirm}
            type="button"
          >
            Confirmar devolução
          </button>
        </div>
      </section>
    </div>
  );
}
