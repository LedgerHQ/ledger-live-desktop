// @flow
import React, { useCallback } from "react";
import invariant from "invariant";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Trans } from "react-i18next";

import { getMainAccount, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { canDelegate, COSMOS_MIN_SAFE } from "@ledgerhq/live-common/lib/families/cosmos/logic";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box/Box";
import IconChartLine from "~/renderer/icons/ChartLine";
import ToolTip from "~/renderer/components/Tooltip";
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
  const dispatch = useDispatch();
  const mainAccount = getMainAccount(account, parentAccount);
  const locale = useSelector(localeSelector);

  const { cosmosResources } = mainAccount;
  invariant(cosmosResources, "cosmos account expected");
  const { delegations } = cosmosResources;
  const unit = getAccountUnit(account);
  const earnRewardEnabled = canDelegate(mainAccount);

  const onClick = useCallback(() => {
    dispatch(
      openModal("MODAL_COSMOS_REWARDS_INFO", {
        account,
      }),
    );
  }, [dispatch, account]);

  const minSafeAmount = formatCurrencyUnit(unit, COSMOS_MIN_SAFE, { showCode: true, locale });

  if (parentAccount || delegations.length > 0) return null;

  return (
    <ToolTip
      content={
        !earnRewardEnabled ? (
          <Trans
            i18nKey="cosmos.delegation.minSafeWarning"
            values={{
              amount: minSafeAmount,
            }}
          />
        ) : null
      }
    >
      <ButtonBase primary disabled={!earnRewardEnabled} onClick={onClick}>
        <Box horizontal flow={1} alignItems="center">
          <IconChartLine size={12} />
          <Box fontSize={3}>
            <Trans i18nKey="delegation.title" />
          </Box>
        </Box>
      </ButtonBase>
    </ToolTip>
  );
};

export default AccountHeaderActions;
