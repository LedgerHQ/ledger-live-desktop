// @flow
import React from "react";
import SectionProvider from "./SectionProvider";
import SectionRate from "./SectionRate";
import SectionFees from "./SectionFees";
import SectionTarget from "./SectionTarget";
import type { FormSummaryProps } from "./types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";

const Form: ThemedComponent<{}> = styled.section`
  display: grid;
  row-gap: 1.375rem;
  color: white;
`;

const SwapFormSummary = (props: FormSummaryProps) => (
  <Form>
    <SectionProvider />
    <SectionRate />
    <SectionFees />
    <SectionTarget />
  </Form>
);

export default SwapFormSummary;
