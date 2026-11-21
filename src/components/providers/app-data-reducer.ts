import type {
  Collaborator,
  CollaboratorFormValues,
} from "../../features/colaboradores/types";
import { collaboratorData } from "../../features/colaboradores/data/colaboradores-data";
import type {
  Equipment,
  EquipmentFormValues,
} from "../../features/equipamentos/types";
import { equipmentData } from "../../features/equipamentos/data/equipamentos-data";
import type {
  Loan,
  LoanCreationValues,
  LoanDates,
} from "../../features/emprestimos/types";
import { loanData } from "../../features/emprestimos/data/emprestimos-data";
import {
  hasActiveLoanForEquipment,
  isActiveLoan,
  isValidLocalDate,
  validateLoanCreation,
} from "../../features/emprestimos/utils/loan-rules";

export type OperationResult<Value> =
  | { ok: true; value: Readonly<Value> }
  | { ok: false; error: string };

export type AppDataState = {
  equipment: readonly Readonly<Equipment>[];
  collaborators: readonly Readonly<Collaborator>[];
  loans: readonly Readonly<Loan>[];
};

export type CreateEquipmentAction = {
  type: "create-equipment";
  id: string;
  values: EquipmentFormValues;
};

export type UpdateEquipmentAction = {
  type: "update-equipment";
  id: string;
  values: EquipmentFormValues;
};

export type CreateCollaboratorAction = {
  type: "create-collaborator";
  id: string;
  values: CollaboratorFormValues;
};

export type UpdateCollaboratorAction = {
  type: "update-collaborator";
  id: string;
  values: CollaboratorFormValues;
};

export type CreateLoanAction = {
  type: "create-loan";
  id: string;
  values: LoanCreationValues;
  today: string;
  dates: LoanDates;
};

export type ReturnLoanAction = {
  type: "return-loan";
  loanId: string;
  actualReturnDate: string;
};

export type AppDataAction =
  | CreateEquipmentAction
  | UpdateEquipmentAction
  | CreateCollaboratorAction
  | UpdateCollaboratorAction
  | CreateLoanAction
  | ReturnLoanAction;

export type AppDataTransition<Value> = {
  state: AppDataState;
  result: OperationResult<Value>;
};

function successTransition<Value extends object>(
  state: AppDataState,
  value: Value,
): AppDataTransition<Value> {
  return {
    state,
    result: { ok: true, value: { ...value } },
  };
}

function normalizeIdentifier(value: string): string {
  return value.trim().toLocaleLowerCase("pt-BR");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function hasDuplicateAssetNumber(
  state: AppDataState,
  assetNumber: string,
  excludedId?: string,
): boolean {
  const normalizedAssetNumber = normalizeIdentifier(assetNumber);
  return state.equipment.some(
    (item) =>
      item.id !== excludedId &&
      normalizeIdentifier(item.assetNumber) === normalizedAssetNumber,
  );
}

function hasDuplicateRegistration(
  state: AppDataState,
  registrationNumber: string,
  excludedId?: string,
): boolean {
  const normalizedRegistration = normalizeIdentifier(registrationNumber);
  return state.collaborators.some(
    (collaborator) =>
      collaborator.id !== excludedId &&
      normalizeIdentifier(collaborator.registrationNumber) ===
        normalizedRegistration,
  );
}

function hasDuplicateEmail(
  state: AppDataState,
  email: string,
  excludedId?: string,
): boolean {
  const normalizedEmail = normalizeIdentifier(email);
  return state.collaborators.some(
    (collaborator) =>
      collaborator.id !== excludedId &&
      normalizeIdentifier(collaborator.email) === normalizedEmail,
  );
}

function transitionCreateEquipment(
  state: AppDataState,
  action: CreateEquipmentAction,
): AppDataTransition<Equipment> {
  const normalizedValues: EquipmentFormValues = {
    ...action.values,
    name: action.values.name.trim(),
    assetNumber: action.values.assetNumber.trim(),
    category: action.values.category.trim(),
    status: "Disponível",
  };

  if (hasDuplicateAssetNumber(state, normalizedValues.assetNumber)) {
    return {
      state,
      result: {
        ok: false,
        error: "Já existe um equipamento com esse número de patrimônio.",
      },
    };
  }

  const createdEquipment: Equipment = {
    id: action.id,
    ...normalizedValues,
  };

  return successTransition(
    {
      ...state,
      equipment: [...state.equipment, createdEquipment],
    },
    createdEquipment,
  );
}

function transitionUpdateEquipment(
  state: AppDataState,
  action: UpdateEquipmentAction,
): AppDataTransition<Equipment> {
  const currentEquipment = state.equipment.find(
    (item) => item.id === action.id,
  );
  if (!currentEquipment) {
    return {
      state,
      result: { ok: false, error: "Equipamento não encontrado." },
    };
  }

  const normalizedValues = {
    ...action.values,
    name: action.values.name.trim(),
    assetNumber: action.values.assetNumber.trim(),
    category: action.values.category.trim(),
  };

  if (hasDuplicateAssetNumber(state, normalizedValues.assetNumber, action.id)) {
    return {
      state,
      result: {
        ok: false,
        error: "Já existe um equipamento com esse número de patrimônio.",
      },
    };
  }

  if (
    hasActiveLoanForEquipment(state.loans, action.id) &&
    normalizedValues.status !== "Emprestado"
  ) {
    return {
      state,
      result: {
        ok: false,
        error: "O status deve permanecer Emprestado enquanto houver empréstimo ativo.",
      },
    };
  }

  if (
    normalizedValues.status === "Emprestado" &&
    currentEquipment.status !== "Emprestado"
  ) {
    return {
      state,
      result: {
        ok: false,
        error: "O status Emprestado só pode ser definido ao criar um empréstimo.",
      },
    };
  }

  if (
    currentEquipment.status === "Emprestado" &&
    normalizedValues.status === "Disponível"
  ) {
    return {
      state,
      result: {
        ok: false,
        error: "O status Disponível só pode ser definido ao registrar uma devolução.",
      },
    };
  }

  const updatedEquipment: Equipment = {
    ...currentEquipment,
    ...normalizedValues,
  };

  return successTransition(
    {
      ...state,
      equipment: state.equipment.map((item) =>
        item.id === action.id ? updatedEquipment : item,
      ),
    },
    updatedEquipment,
  );
}

function transitionCreateCollaborator(
  state: AppDataState,
  action: CreateCollaboratorAction,
): AppDataTransition<Collaborator> {
  const normalizedValues = {
    ...action.values,
    name: action.values.name.trim(),
    registrationNumber: action.values.registrationNumber.trim(),
    email: action.values.email.trim(),
    department: action.values.department.trim(),
    phone: action.values.phone?.trim() ?? "",
  };

  if (hasDuplicateRegistration(state, normalizedValues.registrationNumber)) {
    return {
      state,
      result: {
        ok: false,
        error: "Já existe um colaborador com essa matrícula.",
      },
    };
  }

  if (hasDuplicateEmail(state, normalizedValues.email)) {
    return {
      state,
      result: {
        ok: false,
        error: "Já existe um colaborador com esse e-mail.",
      },
    };
  }

  if (!isValidEmail(normalizedValues.email)) {
    return {
      state,
      result: { ok: false, error: "Informe um e-mail válido." },
    };
  }

  const createdCollaborator: Collaborator = {
    id: action.id,
    ...normalizedValues,
  };

  return successTransition(
    {
      ...state,
      collaborators: [...state.collaborators, createdCollaborator],
    },
    createdCollaborator,
  );
}

function transitionUpdateCollaborator(
  state: AppDataState,
  action: UpdateCollaboratorAction,
): AppDataTransition<Collaborator> {
  const currentCollaborator = state.collaborators.find(
    (item) => item.id === action.id,
  );
  if (!currentCollaborator) {
    return {
      state,
      result: { ok: false, error: "Colaborador não encontrado." },
    };
  }

  const normalizedValues = {
    ...action.values,
    name: action.values.name.trim(),
    registrationNumber: action.values.registrationNumber.trim(),
    email: action.values.email.trim(),
    department: action.values.department.trim(),
    phone: action.values.phone?.trim() ?? "",
  };

  if (
    hasDuplicateRegistration(
      state,
      normalizedValues.registrationNumber,
      action.id,
    )
  ) {
    return {
      state,
      result: {
        ok: false,
        error: "Já existe um colaborador com essa matrícula.",
      },
    };
  }

  if (hasDuplicateEmail(state, normalizedValues.email, action.id)) {
    return {
      state,
      result: {
        ok: false,
        error: "Já existe um colaborador com esse e-mail.",
      },
    };
  }

  if (!isValidEmail(normalizedValues.email)) {
    return {
      state,
      result: { ok: false, error: "Informe um e-mail válido." },
    };
  }

  const updatedCollaborator: Collaborator = {
    ...currentCollaborator,
    ...normalizedValues,
  };

  return successTransition(
    {
      ...state,
      collaborators: state.collaborators.map((item) =>
        item.id === action.id ? updatedCollaborator : item,
      ),
    },
    updatedCollaborator,
  );
}

function transitionCreateLoan(
  state: AppDataState,
  action: CreateLoanAction,
): AppDataTransition<Loan> {
  const selectedEquipment = state.equipment.find(
    (item) => item.id === action.values.equipmentId,
  );
  const selectedCollaborator = state.collaborators.find(
    (item) => item.id === action.values.collaboratorId,
  );
  const validationError = validateLoanCreation(
    selectedEquipment,
    selectedCollaborator,
    state.loans,
    action.values,
    action.today,
  );

  if (validationError) {
    return { state, result: { ok: false, error: validationError } };
  }

  const createdLoan: Loan = {
    id: action.id,
    ...action.values,
    ...action.dates,
    actualReturnDate: null,
    status: "Em andamento",
  };

  return successTransition(
    {
      ...state,
      loans: [...state.loans, createdLoan],
      equipment: state.equipment.map((item) =>
        item.id === createdLoan.equipmentId
          ? { ...item, status: "Emprestado" }
          : item,
      ),
    },
    createdLoan,
  );
}

function transitionReturnLoan(
  state: AppDataState,
  action: ReturnLoanAction,
): AppDataTransition<Loan> {
  const currentLoan = state.loans.find((loan) => loan.id === action.loanId);
  if (!currentLoan) {
    return {
      state,
      result: { ok: false, error: "Empréstimo não encontrado." },
    };
  }

  if (!isActiveLoan(currentLoan)) {
    return {
      state,
      result: {
        ok: false,
        error: "Este empréstimo já foi devolvido ou não está ativo.",
      },
    };
  }

  if (!isValidLocalDate(action.actualReturnDate)) {
    return {
      state,
      result: {
        ok: false,
        error: "Informe uma data válida para a devolução.",
      },
    };
  }

  const equipment = state.equipment.find(
    (item) => item.id === currentLoan.equipmentId,
  );
  if (!equipment) {
    return {
      state,
      result: {
        ok: false,
        error: "O equipamento relacionado ao empréstimo não foi encontrado.",
      },
    };
  }

  if (
    state.loans.some(
      (loan) =>
        loan.id !== currentLoan.id &&
        loan.equipmentId === currentLoan.equipmentId &&
        isActiveLoan(loan),
    )
  ) {
    return {
      state,
      result: {
        ok: false,
        error: "O equipamento possui outro empréstimo ativo.",
      },
    };
  }

  const returnedLoan: Loan = {
    ...currentLoan,
    actualReturnDate: action.actualReturnDate,
    status: "Devolvido",
  };

  return successTransition(
    {
      ...state,
      loans: state.loans.map((loan) =>
        loan.id === action.loanId ? returnedLoan : loan,
      ),
      equipment: state.equipment.map((item) =>
        item.id === currentLoan.equipmentId
          ? { ...item, status: "Disponível" }
          : item,
      ),
    },
    returnedLoan,
  );
}

export function createInitialAppDataState(): AppDataState {
  return {
    equipment: equipmentData.map((item) => ({ ...item })),
    collaborators: collaboratorData.map((item) => ({ ...item })),
    loans: loanData.map((item) => ({ ...item })),
  };
}

export function transitionAppData(
  state: AppDataState,
  action: CreateEquipmentAction,
): AppDataTransition<Equipment>;
export function transitionAppData(
  state: AppDataState,
  action: UpdateEquipmentAction,
): AppDataTransition<Equipment>;
export function transitionAppData(
  state: AppDataState,
  action: CreateCollaboratorAction,
): AppDataTransition<Collaborator>;
export function transitionAppData(
  state: AppDataState,
  action: UpdateCollaboratorAction,
): AppDataTransition<Collaborator>;
export function transitionAppData(
  state: AppDataState,
  action: CreateLoanAction,
): AppDataTransition<Loan>;
export function transitionAppData(
  state: AppDataState,
  action: ReturnLoanAction,
): AppDataTransition<Loan>;
export function transitionAppData(
  state: AppDataState,
  action: AppDataAction,
): AppDataTransition<Equipment | Collaborator | Loan>;
export function transitionAppData(
  state: AppDataState,
  action: AppDataAction,
): AppDataTransition<Equipment | Collaborator | Loan> {
  switch (action.type) {
    case "create-equipment":
      return transitionCreateEquipment(state, action);
    case "update-equipment":
      return transitionUpdateEquipment(state, action);
    case "create-collaborator":
      return transitionCreateCollaborator(state, action);
    case "update-collaborator":
      return transitionUpdateCollaborator(state, action);
    case "create-loan":
      return transitionCreateLoan(state, action);
    case "return-loan":
      return transitionReturnLoan(state, action);
  }
}

export function appDataReducer(
  state: AppDataState,
  action: AppDataAction,
): AppDataState {
  return transitionAppData(state, action).state;
}
