// @flow
import React, { useContext } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import Tooltip from "~/renderer/components/Tooltip";
import IconInfoCircle from "~/renderer/icons/InfoCircle";
import { useTranslation } from "react-i18next";
import { FormSummarySectionContext } from "./SummarySection";
import type { FormSummarySections } from "./types";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  align-items: end;
  column-gap: 0.25rem;
  color: ${p => p.theme.colors.palette.text.shade40};
`;

const Label: ThemedComponent<{}> = styled(Text).attrs(() => ({
  ff: "Inter",
  fontSize: "13px",
  fontWeight: 500,
  lineHeight: "1.4",
}))`
  &:first-letter {
    text-transform: uppercase;
  }
`;

type DetailsProps = { details?: string };
const Details = ({ details }: DetailsProps) => {
  if (!details) return null;

  return (
    <Tooltip content={details} placement="bottom">
      <IconInfoCircle size={16} />
    </Tooltip>
  );
};

type contentKeysType = { [key: FormSummarySections]: { labelKey: string, detailsKey?: string } };
const contentKeys: contentKeysType = {
  provider: {
    labelKey: "swap2.form.details.label.provider",
    detailsKey: "swap2.form.details.tooltip.provider",
  },
  rate: {
    labelKey: "swap2.form.details.label.rate",
    detailsKey: "swap2.form.details.tooltip.rate",
  },
  fees: {
    labelKey: "swap2.form.details.label.fees",
    detailsKey: "swap2.form.details.tooltip.fees",
  },
  target: {
    labelKey: "swap2.form.details.label.target",
  },
};

/* This component fetch the current label and the optional details from the section's
 ** context and render them if possible.
 */
const SummaryLabel = () => {
  const { t } = useTranslation();
  const { section } = useContext(FormSummarySectionContext);
  const { labelKey, detailsKey } = contentKeys[section];

  return (
    <Container>
      <Label>{t(labelKey)}</Label>
      {detailsKey ? <Details details={t(detailsKey)} /> : null}
    </Container>
  );
};

export default SummaryLabel;
