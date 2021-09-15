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
const SwapFormSummary = ({ swapTransaction, kycStatus, provider }: SwapFormSummaryProps) => (
  <Form>
    <SectionProvider provider={provider} status={kycStatus} />
    <SectionRate provider={provider} swapTransaction={swapTransaction} />
    <SectionFees provider={provider} swapTransaction={swapTransaction} />
    <SectionTarget
      account={swapTransaction.swap.to.parentAccount ?? swapTransaction.swap.to.account}
      currency={swapTransaction.swap.to.currency}
      setToAccount={swapTransaction.setToAccount}
    />
  </Form>
);

export default SwapFormSummary;
