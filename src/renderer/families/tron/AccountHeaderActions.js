// @flow
import React, { useCallback } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { Trans } from "react-i18next";

import { BigNumber } from "bignumber.js";

import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account } from "@ledgerhq/live-common/lib/types";

import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box/Box";
import IconChartLine from "~/renderer/icons/ChartLine";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { openModal } from "~/renderer/actions/modals";
import ToolTip from "~/renderer/components/Tooltip";

const ButtonBase: ThemedComponent<*> = styled(Button)`
  height: 34px;
  padding-top: 0;
  padding-bottom: 0;
`;

type Props = {
  account: Account,
  parentAccount: ?Account,
};

const AccountHeaderActions = ({ account, parentAccount }: Props) => {
  const dispatch = useDispatch();

  /** @TODO get this from common */
  const unit = getAccountUnit(account);
  const minAmount = 10 ** unit.magnitude;

  const formattedMinAmount = formatCurrencyUnit(account.unit, BigNumber(minAmount), {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
  });

  const { tronResources, spendableBalance } = account;
  const tronPower = tronResources ? tronResources.tronPower : 0;
  const earnRewardDisabled =
    tronPower === 0 && (!spendableBalance || !spendableBalance.gt(minAmount));

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
        openModal("MODAL_REWARDS_INFO", {
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
            <CryptoCurrencyIcon inactive currency={account.currency} size={16} />
          ) : (
            <IconChartLine size={16} />
          )}
          <Box>
            <Trans i18nKey={tronPower > 0 ? "tron.voting.manageTP" : "delegation.title"} />
          </Box>
        </Box>
      </ButtonBase>
    </ToolTip>
  );
};

export default AccountHeaderActions;
