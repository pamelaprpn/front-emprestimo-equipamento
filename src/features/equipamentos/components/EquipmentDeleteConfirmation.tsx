import { X } from "lucide-react";
import { useEffect, useRef, type MouseEvent } from "react";
import type { Equipment } from "@/features/equipamentos/types";

type EquipmentDeleteConfirmationProps = {
  equipment: Equipment;
  error: string | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function EquipmentDeleteConfirmation({
  equipment,
  error,
  isDeleting,
  onConfirm,
  onCancel,
}: EquipmentDeleteConfirmationProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const onCancelRef = useRef(onCancel);
  const isDeletingRef = useRef(isDeleting);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    isDeletingRef.current = isDeleting;
  }, [isDeleting]);

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
        if (!isDeletingRef.current) {
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

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isDeleting) {
      onCancel();
    }
  }

  function handleCancel() {
    if (!isDeleting) {
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
        aria-describedby="equipment-delete-confirmation-description"
        aria-labelledby="equipment-delete-confirmation-title"
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
              id="equipment-delete-confirmation-title"
            >
              Excluir equipamento
            </h2>
            <p
              className="mt-2 text-sm leading-6 text-slate-600"
              id="equipment-delete-confirmation-description"
            >
              Confirma a exclusão de {equipment.name} (patrimônio{" "}
              {equipment.assetNumber})? Equipamentos com qualquer histórico de
              empréstimos não podem ser excluídos.
            </p>
          </div>
          <button
            aria-label="Cancelar exclusão"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isDeleting}
            onClick={handleCancel}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        {error && (
          <p
            className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700"
            id="equipment-delete-confirmation-error"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            data-dialog-initial-focus
            disabled={isDeleting}
            onClick={handleCancel}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="h-10 rounded-xl bg-rose-700 px-4 text-sm font-medium text-white transition hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
          </button>
        </div>
      </section>
    </div>
  );
}
