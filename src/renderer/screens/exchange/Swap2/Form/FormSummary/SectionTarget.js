// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import { useTranslation } from "react-i18next";
import { rgba } from "~/renderer/styles/helpers";
import Button from "~/renderer/components/Button";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import TextBase from "~/renderer/components/Text";
import IconInfoCircle from "~/renderer/icons/InfoCircle";
import { getAccountCurrency, getAccountName } from "@ledgerhq/live-common/lib/account";
import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { useSelector } from "react-redux";
import SummarySection from "./SummarySection";

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

const AccountSection = ({
  targetName,
  targetCurrency,
}: {
  targetName: string,
  targetCurrency: TokenCurrency | CryptoCurrency,
}) => {
  const { t } = useTranslation();

  return (
    <SummarySection>
      <SummaryLabel label={t("swap2.form.details.label.target")} />
      <SummaryValue value={targetName} handleChange={() => {}}>
        {targetCurrency ? <CryptoCurrencyIcon circle currency={targetCurrency} size={16} /> : null}
      </SummaryValue>
    </SummarySection>
  );
};

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

const SectionTarget = () => {
  const [targetAccount] = useSelector(accountsSelector);
  const targetName = getAccountName(targetAccount);
  const targetCurrency = getAccountCurrency(targetAccount);

  if (targetName && targetCurrency)
    return <AccountSection targetCurrency={targetCurrency} targetName={targetName} />;

  return <NoAccountSection value={targetName} />;
};

export default SectionTarget;
