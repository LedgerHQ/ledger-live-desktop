// @flow

import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { Trans } from "react-i18next";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { localeSelector } from "~/renderer/reducers/settings";

import Discreet, { useDiscreetMode } from "~/renderer/components/Discreet";

import Box from "~/renderer/components/Box/Box";
import Text from "~/renderer/components/Text";
import InfoCircle from "~/renderer/icons/InfoCircle";
import ToolTip from "~/renderer/components/Tooltip";

const Wrapper: ThemedComponent<*> = styled(Box).attrs(() => ({
  horizontal: true,
  mt: 4,
  p: 5,
  pb: 0,
}))`
  border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
`;

const BalanceDetail = styled(Box).attrs(() => ({
  flex: "0.25 0 auto",
  vertical: true,
  alignItems: "start",
}))`
  &:nth-child(n + 3) {
    flex: 0.75;
  }
`;

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
  account: any,
  countervalue: any,
};

const AccountBalanceSummaryFooter = ({ account, countervalue }: Props) => {
  const discreet = useDiscreetMode();
  const locale = useSelector(localeSelector);
  if (!account.polkadotResources) return null;

  const { spendableBalance: _spendableBalance, polkadotResources } = account;
  const {
    lockedBalance: _lockedBalance,
    unlockingBalance: _unlockingBalance,
    unlockedBalance: _unlockedBalance,
  } = polkadotResources;

  const unit = getAccountUnit(account);

  const formatConfig = {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
    discreet,
    locale,
  };

  const spendableBalance = formatCurrencyUnit(unit, _spendableBalance, formatConfig);

  // NOTE: All balances are including the next one...
  // So we exclude each other for better understanding and ensure sum of all balances
  // is equal to the total balance.

  // Exclude the unlocking part from the locked balance
  const lockedBalance = formatCurrencyUnit(
    unit,
    _lockedBalance.minus(_unlockingBalance),
    formatConfig,
  );

  // Exclude the unlocked part from the locked balance
  const unlockingBalance = formatCurrencyUnit(
    unit,
    _unlockingBalance.minus(_unlockedBalance),
    formatConfig,
  );

  const unlockedBalance = formatCurrencyUnit(unit, _unlockedBalance, formatConfig);

  return (
    <Wrapper>
      <BalanceDetail>
        <ToolTip content={<Trans i18nKey="account.availableBalanceTooltip" />}>
          <TitleWrapper>
            <Title>
              <Trans i18nKey="account.availableBalance" />
            </Title>
            <InfoCircle size={13} />
          </TitleWrapper>
        </ToolTip>
        <AmountValue>
          <Discreet>{spendableBalance}</Discreet>
        </AmountValue>
      </BalanceDetail>
      {_lockedBalance.gt(0) && (
        <BalanceDetail>
          <ToolTip content={<Trans i18nKey="polkadot.lockedTooltip" />}>
            <TitleWrapper>
              <Title>
                <Trans i18nKey="polkadot.lockedBalance" />
              </Title>
              <InfoCircle size={13} />
            </TitleWrapper>
          </ToolTip>
          <AmountValue>
            <Discreet>{lockedBalance}</Discreet>
          </AmountValue>
        </BalanceDetail>
      )}
      {_unlockingBalance.gt(0) && (
        <BalanceDetail>
          <ToolTip content={<Trans i18nKey="polkadot.unlockingTooltip" />}>
            <TitleWrapper>
              <Title>
                <Trans i18nKey="polkadot.unlockingBalance" />
              </Title>
              <InfoCircle size={13} />
            </TitleWrapper>
          </ToolTip>
          <AmountValue>
            <Discreet>{unlockingBalance}</Discreet>
          </AmountValue>
        </BalanceDetail>
      )}
      {_unlockedBalance.gt(0) && (
        <BalanceDetail>
          <ToolTip content={<Trans i18nKey="polkadot.unlockedTooltip" />}>
            <TitleWrapper>
              <Title>
                <Trans i18nKey="polkadot.unlockedBalance" />
              </Title>
              <InfoCircle size={13} />
            </TitleWrapper>
          </ToolTip>
          <AmountValue>
            <Discreet>{unlockedBalance}</Discreet>
          </AmountValue>
        </BalanceDetail>
      )}
    </Wrapper>
  );
};

export default AccountBalanceSummaryFooter;
