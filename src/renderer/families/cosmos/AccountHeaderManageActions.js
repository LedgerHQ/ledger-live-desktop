// @flow
import React, { useCallback } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";

import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { canDelegate } from "@ledgerhq/live-common/lib/families/cosmos/logic";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { openModal } from "~/renderer/actions/modals";
import IconChartLine from "~/renderer/icons/ChartLine";

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountHeaderActions = ({ account, parentAccount }: Props) => {
  const dispatch = useDispatch();
  const mainAccount = getMainAccount(account, parentAccount);

  const { cosmosResources } = mainAccount;
  invariant(cosmosResources, "cosmos account expected");
  const { delegations } = cosmosResources;
  const earnRewardEnabled = canDelegate(mainAccount);

  const onClick = useCallback(() => {
    dispatch(
      openModal("MODAL_COSMOS_REWARDS_INFO", {
        account,
      }),
    );
  }, [dispatch, account]);

  if (parentAccount || delegations.length > 0 || !earnRewardEnabled) return null;

  return [
    {
      key: "cosmos",
      onClick: onClick,
      icon: IconChartLine,
      label: <Trans i18nKey="delegation.title" />,
    },
  ];
};

export default AccountHeaderActions;
