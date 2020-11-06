// @flow

import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { makeCompoundSummaryForAccount } from "@ledgerhq/live-common/lib/compound/logic";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { listCurrentRates } from "@ledgerhq/live-common/lib/families/ethereum/modules/compound";
import { useDiscreetMode } from "~/renderer/components/Discreet";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account, TokenAccount, TokenCurrency } from "@ledgerhq/live-common/lib/types";

import Box from "~/renderer/components/Box/Box";
import Text from "~/renderer/components/Text";
import InfoCircle from "~/renderer/icons/InfoCircle";
import ToolTip from "~/renderer/components/Tooltip";
import { localeSelector } from "~/renderer/reducers/settings";

const Wrapper: ThemedComponent<*> = styled(Box).attrs(() => ({
  horizontal: true,
  mt: 4,
  p: 5,
  pb: 0,
}))`
  border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
`;

const BalanceDetail = styled(Box).attrs(() => ({
  flex: 1.25,
  vertical: true,
  alignItems: "start",
}))``;

const TitleWrapper = styled(Box).attrs(() => ({ horizontal: true, alignItems: "center", mb: 1 }))``;

const Title = styled(Text).attrs(() => ({
  fontSize: 4,
  ff: "Inter|Medium",
  color: "palette.text.shade60",
}))`
  line-height: ${p => p.theme.space[4]}px;
  margin-right: ${p => p.theme.space[1]}px;
`;

const AmountValue = styled(Text).attrs(() => ({
  fontSize: 6,
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
}))``;

type Props = {
  account: TokenAccount,
  parentAccount: Account,
  countervalue: any,
  ctoken: TokenCurrency,
};

const AccountBalanceSummaryFooter = ({ account, parentAccount, countervalue, ctoken }: Props) => {
  const discreet = useDiscreetMode();
  const locale = useSelector(localeSelector);
  if (!account.compoundBalance) return null;

  const summary = makeCompoundSummaryForAccount(account, parentAccount);

  if (!summary) return null;

  const { accruedInterests, totalSupplied, allTimeEarned } = summary;

  const formatConfig = {
    disableRounding: false,
    alwaysShowSign: false,
    showCode: true,
    discreet,
    locale,
  };

  const unit = getAccountUnit(account);

  const formattedAccruedInterests = formatCurrencyUnit(unit, accruedInterests, formatConfig);
  const formattedTotalSupplied = formatCurrencyUnit(unit, totalSupplied, formatConfig);
  const formattedAllTimeEarned = formatCurrencyUnit(unit, allTimeEarned, formatConfig);
  const rates = listCurrentRates();

  const rate = rates.find(r => r.ctoken.id === ctoken.id);

  return (
    <Wrapper>
      <BalanceDetail>
        <ToolTip content={<Trans i18nKey="lend.account.amountSuppliedTooltip" />}>
          <TitleWrapper>
            <Title>
              <Trans i18nKey="lend.account.amountSupplied" />
            </Title>
            <InfoCircle size={13} />
          </TitleWrapper>
        </ToolTip>
        <AmountValue>{formattedTotalSupplied || "–"}</AmountValue>
      </BalanceDetail>
      <BalanceDetail>
        <ToolTip content={<Trans i18nKey="lend.account.currencyAPYTooltip" />}>
          <TitleWrapper>
            <Title>
              <Trans i18nKey="lend.account.currencyAPY" />
            </Title>
            <InfoCircle size={13} />
          </TitleWrapper>
        </ToolTip>
        <AmountValue>{rate?.supplyAPY || "-"}</AmountValue>
      </BalanceDetail>
      <BalanceDetail>
        <ToolTip content={<Trans i18nKey="lend.account.accruedInterestsTooltip" />}>
          <TitleWrapper>
            <Title>
              <Trans i18nKey="lend.account.accruedInterests" />
            </Title>
            <InfoCircle size={13} />
          </TitleWrapper>
        </ToolTip>
        <AmountValue>{formattedAccruedInterests || "–"}</AmountValue>
      </BalanceDetail>
      <BalanceDetail>
        <ToolTip content={<Trans i18nKey="lend.account.interestEarnedTooltip" />}>
          <TitleWrapper>
            <Title>
              <Trans i18nKey="lend.account.interestEarned" />
            </Title>
            <InfoCircle size={13} />
          </TitleWrapper>
        </ToolTip>
        <AmountValue>{formattedAllTimeEarned || "–"}</AmountValue>
      </BalanceDetail>
    </Wrapper>
  );
};

export default AccountBalanceSummaryFooter;
