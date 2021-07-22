// @flow
import React, { useContext } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { FormSummaryContext } from "./FormSummary";
import type { FormSummarySections } from "./types";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const FormSummarySectionContext = React.createContext<{
  section: FormSummarySections,
  value?: string,
  handleChange?: Function,
  Icon?: Function,
}>({});

/* This section component is in charge to construct section's context by fetching
 ** values from one key of the form context. Data fetched from this component
 ** will be consume by the SummaryLabel and SummaryValue components. In addition to
 ** that, it renders the row component
 */
type SummarySectionProps = { children: React$Node, section: FormSummarySections };
const SummarySection = ({ children, section }: SummarySectionProps) => {
  const { value, handleChange, Icon } = useContext(FormSummaryContext)[section];

  return (
    <Container>
      <FormSummarySectionContext.Provider value={{ value, handleChange, section, Icon }}>
        {children}
      </FormSummarySectionContext.Provider>
    </Container>
  );
};

export default SummarySection;
