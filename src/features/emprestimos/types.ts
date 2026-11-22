export type LoanStatus = "Em andamento" | "Devolvido";

export type LoanDisplayStatus = LoanStatus | "Atrasado";

type LoanDetails = {
  id: string;
  equipmentId: string;
  collaboratorId: string;
  loanDate: string;
  expectedReturnDate: string;
};

export type LoanDates = Pick<LoanDetails, "loanDate" | "expectedReturnDate">;

export type Loan =
  | (LoanDetails & {
      actualReturnDate: null;
      status: "Em andamento";
    })
  | (LoanDetails & {
      actualReturnDate: string;
      status: "Devolvido";
    });

export type ApiLoan = {
  id: string;
  equipmentId: string;
  collaboratorId: string;
  loanDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
};

export type LoanCreationValues = Pick<
  LoanDetails,
  "equipmentId" | "collaboratorId"
>;
