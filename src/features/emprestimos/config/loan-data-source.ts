export type LoanDataSource = "local" | "api";

function getLoanDataSource(value: string | undefined): LoanDataSource {
  if (value === undefined) {
    return "local";
  }

  if (value === "local" || value === "api") {
    return value;
  }

  throw new Error('NEXT_PUBLIC_LOAN_SOURCE deve ser "local" ou "api".');
}

export const loanDataSource = getLoanDataSource(
  process.env.NEXT_PUBLIC_LOAN_SOURCE,
);
