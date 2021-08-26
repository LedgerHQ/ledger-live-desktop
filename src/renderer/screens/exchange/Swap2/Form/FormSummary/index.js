// @flow
import React from "react";
import SectionProvider from "./SectionProvider";
import SectionRate from "./SectionRate";
import SectionFees from "./SectionFees";
import SectionTarget from "./SectionTarget";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import type { SwapSelectorStateType } from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";

const Form: ThemedComponent<{}> = styled.section`
  display: grid;
  row-gap: 1.375rem;
  color: white;
`;

type SwapFormSummaryProps = {
  targetAccount: $PropertyType<SwapSelectorStateType, "account">,
  targetCurrency: $PropertyType<SwapSelectorStateType, "currency">,
};
const SwapFormSummary = ({ targetAccount, targetCurrency }: SwapFormSummaryProps) => (
  <Form>
    <SectionProvider />
    <SectionRate />
    <SectionFees />
    <SectionTarget account={targetAccount} currency={targetCurrency} />
  </Form>
);

export default SwapFormSummary;
