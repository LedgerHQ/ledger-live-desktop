// @flow
import React from "react";
import SectionProvider from "./SectionProvider";
import SectionRate from "./SectionRate";
import SectionFees from "./SectionFees";
import SectionTarget from "./SectionTarget";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import type { SwapTransactionType } from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";

const Form: ThemedComponent<{}> = styled.section`
  display: grid;
  row-gap: 1.375rem;
  color: white;
`;

type SwapFormSummaryProps = {
  swapTransaction: SwapTransactionType,
};
const SwapFormSummary = ({ swapTransaction }: SwapFormSummaryProps) => (
  <Form>
    <SectionProvider value="changelly" />
    <SectionRate swapTransaction={swapTransaction} />
    <SectionFees swapTransaction={swapTransaction} />
    <SectionTarget
      account={swapTransaction.swap.to.parentAccount ?? swapTransaction.swap.to.account}
      currency={swapTransaction.swap.to.currency}
    />
  </Form>
);

export default SwapFormSummary;
