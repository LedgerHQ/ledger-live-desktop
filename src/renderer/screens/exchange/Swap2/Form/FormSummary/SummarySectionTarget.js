// @flow
import React, { useContext, useState } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import SummarySection from "./SummarySection";
import TextBase from "~/renderer/components/Text";
import { FormSummaryContext } from "./FormSummary";
import { rgba } from "~/renderer/styles/helpers";
import { useTranslation } from "react-i18next";
import Button from "~/renderer/components/Button";
import IconInfoCircle from "~/renderer/icons/InfoCircle";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  color: ${p => p.theme.colors.palette.primary.main};
  column-gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 4px;
`;

const Text: ThemedComponent<{}> = styled(TextBase).attrs(() => ({
  ff: "Inter",
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: "1.5",
}))`
  &:first-letter {
    text-transform: uppercase;
  }
`;

const TextWrappper: ThemedComponent<{}> = styled.div`
  flex-grow: 1;
`;

const NoAccountSection = ({ value }: { value?: string }) => {
  const { t } = useTranslation();

  // SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
  const handleClick = () => {};

  return (
    <Container>
      <IconInfoCircle size={24} />
      <TextWrappper>
        <Text>{t("swap2.form.details.noAccount", { target: value })}</Text>
      </TextWrappper>
      <Button primary small onClick={handleClick}>
        {t("swap2.form.details.noAccountCTA")}
      </Button>
    </Container>
  );
};

/* This section component override the default section component to handle particular
 ** case from target section. Default section component is rendered except when the user
 ** has no account associates with the target value. In this particular case, the particular
 ** target section is rendered.
 */
type SummarySectionProps = { children: React$Node };
const SummarySectionTarget = ({ children }: SummarySectionProps) => {
  const { value } = useContext(FormSummaryContext).target;
  // SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
  // Added this weird line to randomly display the "no account" state
  const [isAccountAvailable] = useState(Math.random() >= 0.5);

  if (isAccountAvailable) return <SummarySection section="target">{children}</SummarySection>;

  return <NoAccountSection value={value} />;
};

export default SummarySectionTarget;
