// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import { useTranslation, Trans } from "react-i18next";
import { rgba } from "~/renderer/styles/helpers";
import Button from "~/renderer/components/Button";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import TextBase from "~/renderer/components/Text";
import { getAccountName } from "@ledgerhq/live-common/lib/account";
import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import SummarySection from "./SummarySection";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";

import type { SwapSelectorStateType } from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  color: ${p => p.theme.colors.palette.primary.main};
  column-gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 4px;
  align-items: center;
`;

const Text: ThemedComponent<{}> = styled(TextBase).attrs(() => ({
  ff: "Inter",
  fontSize: "0.875rem",
  fontWeight: 500,
  lineHeight: "1.4",
}))`
  &:first-letter {
    text-transform: uppercase;
  }
`;

const TextWrappper = styled.div`
  max-width: 11.875rem;
`;

const ButtonAddAccount = styled(Button).attrs(() => ({
  primary: true,
  small: true,
}))`
  height: 40px;
`;

const AccountSection = ({
  account,
  currency,
}: {
  account: $PropertyType<SwapSelectorStateType, "account">,
  currency: TokenCurrency | CryptoCurrency,
}) => {
  const { t } = useTranslation();
  const accountName = getAccountName(account);

  return (
    <SummarySection>
      <SummaryLabel label={t("swap2.form.details.label.target")} />
      <SummaryValue value={accountName} handleChange={() => {}}>
        {currency ? <CryptoCurrencyIcon circle currency={currency} size={16} /> : null}
      </SummaryValue>
    </SummarySection>
  );
};

const AddAccountSection = ({
  currency,
}: {
  currency: $NonMaybeType<$PropertyType<SwapSelectorStateType, "currency">>,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClick = () => dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency }));

  return (
    <Container>
      <TextWrappper>
        <Text>
          <Trans values={{ name: currency.name }} i18nKey="swap2.form.details.noAccount" />
        </Text>
      </TextWrappper>
      <ButtonAddAccount onClick={handleClick}>
        {t("swap2.form.details.noAccountCTA")}
      </ButtonAddAccount>
    </Container>
  );
};

const PlaceholderSection = () => {
  const { t } = useTranslation();

  return (
    <SummarySection>
      <SummaryLabel label={t("swap2.form.details.label.target")} />
      <SummaryValue />
    </SummarySection>
  );
};

type SectionTargetProps = {
  account: $PropertyType<SwapSelectorStateType, "account">,
  currency: $PropertyType<SwapSelectorStateType, "currency">,
};
const SectionTarget = ({ account, currency }: SectionTargetProps) => {
  if (!currency) return <PlaceholderSection />;
  if (!account) return <AddAccountSection currency={currency} />;

  return <AccountSection account={account} currency={currency} />;
};

export default SectionTarget;
