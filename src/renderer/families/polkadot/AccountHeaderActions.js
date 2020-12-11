// @flow
import React, { useCallback } from "react";
import invariant from "invariant";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";

import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import type { Account } from "@ledgerhq/live-common/lib/types";
import {
  hasExternalController,
  hasExternalStash,
  hasPendingBond,
} from "@ledgerhq/live-common/lib/families/polkadot/logic";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ToolTip from "~/renderer/components/Tooltip";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box/Box";
import IconChartLine from "~/renderer/icons/ChartLine";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { openModal } from "~/renderer/actions/modals";
import useTheme from "~/renderer/hooks/useTheme";

const ButtonBase: ThemedComponent<*> = styled(Button)`
  height: 34px;
  padding-top: 0;
  padding-bottom: 0;
`;

type Props = {
  account: Account,
};

const AccountHeaderActions = ({ account }: Props) => {
  const contrastText = useTheme("colors.palette.primary.contrastText");
  const dispatch = useDispatch();
  const currency = getAccountCurrency(account);

  const { polkadotResources } = account;
  invariant(polkadotResources, "polkadot account expected");

  const hasBondedBalance = polkadotResources.lockedBalance && polkadotResources.lockedBalance.gt(0);
  const hasPendingBondOperation = hasPendingBond(account);

  const onClick = useCallback(() => {
    if (hasBondedBalance || hasPendingBondOperation) {
      dispatch(
        openModal("MODAL_POLKADOT_MANAGE", {
          account,
        }),
      );
    } else {
      dispatch(
        openModal("MODAL_POLKADOT_REWARDS_INFO", {
          account,
        }),
      );
    }
  }, [dispatch, account, hasBondedBalance, hasPendingBondOperation]);

  const _hasExternalController = hasExternalController(account);
  const _hasExternalStash = hasExternalStash(account);

  const manageEnabled = !(
    _hasExternalController ||
    _hasExternalStash ||
    (!hasBondedBalance && hasPendingBondOperation)
  );

  return (
    <ToolTip
      content={
        !manageEnabled ? (
          <Trans
            i18nKey={
              _hasExternalController
                ? "polkadot.nomination.externalControllerTooltip"
                : _hasExternalStash
                ? "polkadot.nomination.externalStashTooltip"
                : "polkadot.nomination.hasPendingBondOperation"
            }
          />
        ) : null
      }
    >
      <ButtonBase primary disabled={!manageEnabled} onClick={onClick}>
        <Box horizontal flow={1} alignItems="center">
          {hasBondedBalance ? (
            <CryptoCurrencyIcon overrideColor={contrastText} currency={currency} size={12} />
          ) : (
            <IconChartLine size={12} />
          )}
          <Box fontSize={3}>
            <Trans
              i18nKey={
                hasBondedBalance || hasPendingBondOperation
                  ? "polkadot.manage.title"
                  : "delegation.title"
              }
            />
          </Box>
        </Box>
      </ButtonBase>
    </ToolTip>
  );
};

export default AccountHeaderActions;
