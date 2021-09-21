// @flow
import React, { useEffect, useState } from "react";
import SectionProvider from "./SectionProvider";
import SectionRate from "./SectionRate";
import SectionFees from "./SectionFees";
import SectionTarget from "./SectionTarget";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import type { SwapTransactionType } from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";
import type { SectionProviderProps } from "./SectionProvider";

const Form: ThemedComponent<{}> = styled.section.attrs(({ ready }) => ({
  style: ready ? { opacity: 1, maxHeight: "100vh", overflow: "auto" } : {},
}))`
  display: grid;
  row-gap: 1.375rem;
  color: white;
  transition: max-height 800ms cubic-bezier(0.47, 0, 0.75, 0.72),
    opacity 400ms 400ms cubic-bezier(0.47, 0, 0.75, 0.72);
  transform-origin: top;
  height: auto;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
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
  const hasRates = ratesState?.value.length > 0;
  const refetchRates = swapTransaction.swap.refetchRates;

  const [hasFetchedRates, setHasFetchedRates] = useState(hasRates);

  useEffect(() => setHasFetchedRates(v => (!v ? hasRates : v)), [hasRates]);

  return (
    <Form ready={hasFetchedRates}>
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
        hasRates={hasRates}
      />
      <SectionTarget
        account={toAccount}
        currency={toCurrency}
        setToAccount={setToAccount}
        targetAccounts={targetAccounts}
        hasRates={hasRates}
      />
    </Form>
  );
};

export default React.memo<SwapFormSummaryProps>(SwapFormSummary);
