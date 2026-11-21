"use client";

import {
  createContext,
  useContext,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type {
  Collaborator,
  CollaboratorFormValues,
} from "@/features/colaboradores/types";
import type {
  Equipment,
  EquipmentFormValues,
} from "@/features/equipamentos/types";
import type { Loan, LoanCreationValues } from "@/features/emprestimos/types";
import {
  getLocalDateString,
  getLoanDates,
} from "@/features/emprestimos/utils/loan-rules";
import {
  appDataReducer,
  createInitialAppDataState,
  transitionAppData,
  type AppDataAction,
  type AppDataState,
  type AppDataTransition,
  type CreateCollaboratorAction,
  type CreateEquipmentAction,
  type CreateLoanAction,
  type OperationResult,
  type ReturnLoanAction,
  type UpdateCollaboratorAction,
  type UpdateEquipmentAction,
} from "./app-data-reducer";

export type { OperationResult } from "./app-data-reducer";

type AppDataContextValue = {
  equipment: readonly Readonly<Equipment>[];
  collaborators: readonly Readonly<Collaborator>[];
  loans: readonly Readonly<Loan>[];
  hasDuplicateAssetNumber: (
    assetNumber: string,
    excludedId?: string,
  ) => boolean;
  hasDuplicateRegistration: (
    registrationNumber: string,
    excludedId?: string,
  ) => boolean;
  hasDuplicateEmail: (email: string, excludedId?: string) => boolean;
  createEquipment: (
    values: EquipmentFormValues,
  ) => OperationResult<Equipment>;
  updateEquipment: (
    id: string,
    values: EquipmentFormValues,
  ) => OperationResult<Equipment>;
  createCollaborator: (
    values: CollaboratorFormValues,
  ) => OperationResult<Collaborator>;
  updateCollaborator: (
    id: string,
    values: CollaboratorFormValues,
  ) => OperationResult<Collaborator>;
  createLoan: (values: LoanCreationValues) => OperationResult<Loan>;
  returnLoan: (loanId: string) => OperationResult<Loan>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

function normalizeIdentifier(value: string): string {
  return value.trim().toLocaleLowerCase("pt-BR");
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    appDataReducer,
    undefined,
    createInitialAppDataState,
  );
  const currentStateRef = useRef<AppDataState>(state);

  function commitAction<Value>(
    action: AppDataAction,
    transition: AppDataTransition<Value>,
  ): OperationResult<Value> {
    if (!transition.result.ok) {
      return transition.result;
    }

    currentStateRef.current = transition.state;
    dispatch(action);
    return transition.result;
  }

  function hasDuplicateAssetNumber(
    assetNumber: string,
    excludedId?: string,
  ): boolean {
    const normalizedAssetNumber = normalizeIdentifier(assetNumber);
    return currentStateRef.current.equipment.some(
      (item) =>
        item.id !== excludedId &&
        normalizeIdentifier(item.assetNumber) === normalizedAssetNumber,
    );
  }

  function hasDuplicateRegistration(
    registrationNumber: string,
    excludedId?: string,
  ): boolean {
    const normalizedRegistration = normalizeIdentifier(registrationNumber);
    return currentStateRef.current.collaborators.some(
      (collaborator) =>
        collaborator.id !== excludedId &&
        normalizeIdentifier(collaborator.registrationNumber) ===
          normalizedRegistration,
    );
  }

  function hasDuplicateEmail(email: string, excludedId?: string): boolean {
    const normalizedEmail = normalizeIdentifier(email);
    return currentStateRef.current.collaborators.some(
      (collaborator) =>
        collaborator.id !== excludedId &&
        normalizeIdentifier(collaborator.email) === normalizedEmail,
    );
  }

  function createEquipment(
    values: EquipmentFormValues,
  ): OperationResult<Equipment> {
    const action = {
      type: "create-equipment",
      id: crypto.randomUUID(),
      values: { ...values },
    } satisfies CreateEquipmentAction;

    return commitAction(
      action,
      transitionAppData(currentStateRef.current, action),
    );
  }

  function updateEquipment(
    id: string,
    values: EquipmentFormValues,
  ): OperationResult<Equipment> {
    const action = {
      type: "update-equipment",
      id,
      values: { ...values },
    } satisfies UpdateEquipmentAction;

    return commitAction(
      action,
      transitionAppData(currentStateRef.current, action),
    );
  }

  function createCollaborator(
    values: CollaboratorFormValues,
  ): OperationResult<Collaborator> {
    const action = {
      type: "create-collaborator",
      id: crypto.randomUUID(),
      values: { ...values },
    } satisfies CreateCollaboratorAction;

    return commitAction(
      action,
      transitionAppData(currentStateRef.current, action),
    );
  }

  function updateCollaborator(
    id: string,
    values: CollaboratorFormValues,
  ): OperationResult<Collaborator> {
    const action = {
      type: "update-collaborator",
      id,
      values: { ...values },
    } satisfies UpdateCollaboratorAction;

    return commitAction(
      action,
      transitionAppData(currentStateRef.current, action),
    );
  }

  function createLoan(values: LoanCreationValues): OperationResult<Loan> {
    const today = getLocalDateString();
    const action = {
      type: "create-loan",
      id: crypto.randomUUID(),
      values: { ...values },
      today,
      dates: getLoanDates(today),
    } satisfies CreateLoanAction;

    return commitAction(
      action,
      transitionAppData(currentStateRef.current, action),
    );
  }

  function returnLoan(loanId: string): OperationResult<Loan> {
    const action = {
      type: "return-loan",
      loanId,
      actualReturnDate: getLocalDateString(),
    } satisfies ReturnLoanAction;

    return commitAction(
      action,
      transitionAppData(currentStateRef.current, action),
    );
  }

  const value: AppDataContextValue = {
    equipment: state.equipment,
    collaborators: state.collaborators,
    loans: state.loans,
    hasDuplicateAssetNumber,
    hasDuplicateRegistration,
    hasDuplicateEmail,
    createEquipment,
    updateEquipment,
    createCollaborator,
    updateCollaborator,
    createLoan,
    returnLoan,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData deve ser usado dentro de AppDataProvider.");
  }

  return context;
}
