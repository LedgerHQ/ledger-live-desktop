// @flow
import React from "react";
import SectionProvider from "./SectionProvider";
import SectionRate from "./SectionRate";
import SectionFees from "./SectionFees";
import SectionTarget from "./SectionTarget";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import type { SwapTransactionType } from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";
import type { SectionProviderProps } from "./SectionProvider";

const Form: ThemedComponent<{}> = styled.section`
  display: grid;
  row-gap: 1.375rem;
  color: white;
`;

type SwapFormSummaryProps = {
  swapTransaction: SwapTransactionType,
  kycStatus?: $PropertyType<SectionProviderProps, "status">,
  provider?: string,
};
const SwapFormSummary = ({ swapTransaction, kycStatus, provider }: SwapFormSummaryProps) => {
  const {
    transaction,
    status,
    updateTransaction,
    setTransaction,
    setToAccount,
    swap: { targetAccounts },
  } = swapTransaction;
  const {
    currency: fromCurrency,
    account: fromAccount,
    parentAccount: fromParentAccount,
  } = swapTransaction.swap.from;
  const { currency: toCurrency, account: toAccount } = swapTransaction.swap.to;
  const ratesState = swapTransaction.swap.rates;
  const refetchRates = swapTransaction.swap.refetchRates;
  return (
    <Form>
      <SectionProvider provider={provider} status={kycStatus} />
      <SectionRate
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        ratesState={ratesState}
        refetchRates={refetchRates}
        provider={provider}
      />
      <SectionFees
        transaction={transaction}
        account={fromAccount}
        parentAccount={fromParentAccount}
        currency={fromCurrency}
        status={status}
        updateTransaction={updateTransaction}
        setTransaction={setTransaction}
        provider={provider}
      />
      <SectionTarget
        account={toAccount}
        currency={toCurrency}
        setToAccount={setToAccount}
        targetAccounts={targetAccounts}
      />
    </Form>
  );
};

export default React.memo<SwapFormSummaryProps>(SwapFormSummary);
