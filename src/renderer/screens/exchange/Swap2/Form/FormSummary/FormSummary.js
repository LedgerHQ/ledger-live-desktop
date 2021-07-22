// @flow
import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { FormSummaryProps, FormSummarySections } from "./types";
import SummarySection from "./SummarySection";
import SummaryLabel from "./SummaryLabel";
import { accountsSelector } from "~/renderer/reducers/accounts";
import SummaryValue from "./SummaryValue";
import SummarySectionTarget from "./SummarySectionTarget";
import { getAccountCurrency, getAccountName } from "@ledgerhq/live-common/lib/account";
import { getProviderIcon, getTargetIcon, RateIcon } from "./icons";

const Container: ThemedComponent<{}> = styled.section`
  display: grid;
  row-gap: 1.375rem;
  color: white;
`;

export const FormSummaryContext = React.createContext<{
  [key: FormSummarySections]: { value?: string, handleChange?: Function, Icon?: Function },
}>({});

/* This component is in charge to construct the global form context. Context values
 ** are segmented by section component then consumed by label/value components.
 */
const FormSummary = ({ children, ...props }: FormSummaryProps & { children: React$Node }) => {
  const [targetAccount] = useSelector(accountsSelector);
  const targetCurrency = getAccountCurrency(targetAccount);
  const targetName = getAccountName(targetAccount);

  const provider = useMemo(
    () => ({
      value: props.provider,
      handleChange: props.onProviderChange,
      Icon: getProviderIcon(props.provider),
    }),
    [props.provider, props.onProviderChange],
  );
  const fees = useMemo(
    () => ({
      value: props.fees,
      handleChange: props.onFeesChange,
    }),
    [props.fees, props.onFeesChange],
  );
  const rate = useMemo(() => ({ value: props.rate, Icon: RateIcon }), [props.rate]);
  const target = useMemo(
    () => ({
      value: targetName,
      handleChange: props.onTargetChange,
      Icon: getTargetIcon(targetCurrency),
    }),
    [targetName, targetCurrency, props.onTargetChange],
  );

  return (
    <Container>
      <FormSummaryContext.Provider value={{ provider, fees, target, rate }}>
        {children}
      </FormSummaryContext.Provider>
    </Container>
  );
};

FormSummary.Section = SummarySection;
FormSummary.SectionTarget = SummarySectionTarget;
FormSummary.Label = SummaryLabel;
FormSummary.Value = SummaryValue;

export default FormSummary;
