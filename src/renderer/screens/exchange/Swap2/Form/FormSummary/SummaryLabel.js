// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import Tooltip from "~/renderer/components/Tooltip";
import IconInfoCircle from "~/renderer/icons/InfoCircle";

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

/* This component fetch the current label and the optional details from the section's
 ** context and render them if possible.
 */
const SummaryLabel = ({ label, details }: { label: string, details?: string }) => {
  return (
    <Container>
      <Label>{label}</Label>
      {details ? <Details details={details} /> : null}
    </Container>
  );
};

export default SummaryLabel;
