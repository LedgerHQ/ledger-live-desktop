// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 20px;
`;

type SummarySectionProps = { children: React$Node };
const SummarySection = ({ children }: SummarySectionProps) => <Container>{children}</Container>;

export default SummarySection;
