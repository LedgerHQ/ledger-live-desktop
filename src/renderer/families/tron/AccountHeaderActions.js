// @flow
import React, { useCallback } from "react";
import invariant from "invariant";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
import {
  getAccountUnit,
  getAccountCurrency,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box/Box";
import IconChartLine from "~/renderer/icons/ChartLine";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { openModal } from "~/renderer/actions/modals";
import ToolTip from "~/renderer/components/Tooltip";
import useTheme from "~/renderer/hooks/useTheme";
import { localeSelector } from "~/renderer/reducers/settings";

const ButtonBase: ThemedComponent<*> = styled(Button)`
  height: 34px;
  padding-top: 0;
  padding-bottom: 0;
`;

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountHeaderActions = ({ account, parentAccount }: Props) => {
  const contrastText = useTheme("colors.palette.primary.contrastText");
  const dispatch = useDispatch();
  const unit = getAccountUnit(account);
  const currency = getAccountCurrency(account);
  const mainAccount = getMainAccount(account, parentAccount);
  const minAmount = 10 ** unit.magnitude;
  const locale = useSelector(localeSelector);

  const formattedMinAmount = formatCurrencyUnit(unit, BigNumber(minAmount), {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
    locale,
  });

  const { tronResources, spendableBalance } = mainAccount;
  invariant(tronResources, "tron account expected");
  const tronPower = tronResources.tronPower;
  const earnRewardDisabled = tronPower === 0 && spendableBalance.lt(minAmount);

  const onClick = useCallback(() => {
    if (tronPower > 0) {
      dispatch(
        openModal("MODAL_MANAGE_TRON", {
          parentAccount,
          account,
        }),
      );
    } else {
      dispatch(
        openModal("MODAL_TRON_REWARDS_INFO", {
          parentAccount,
          account,
        }),
      );
    }
  }, [dispatch, tronPower, account, parentAccount]);

  if (parentAccount) return null;

  return (
    <ToolTip
      content={
        earnRewardDisabled ? (
          <Trans i18nKey="tron.voting.warnEarnRewards" values={{ amount: formattedMinAmount }} />
        ) : null
      }
    >
      <ButtonBase primary disabled={earnRewardDisabled} onClick={onClick}>
        <Box horizontal flow={1} alignItems="center">
          {tronPower > 0 ? (
            <CryptoCurrencyIcon overrideColor={contrastText} currency={currency} size={12} />
          ) : (
            <IconChartLine size={12} />
          )}
          <Box fontSize={3}>
            <Trans i18nKey={tronPower > 0 ? "tron.voting.manageTP" : "delegation.title"} />
          </Box>
        </Box>
      </ButtonBase>
    </ToolTip>
  );
};

export default AccountHeaderActions;
