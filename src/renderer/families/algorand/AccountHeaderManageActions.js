// @flow
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account/helpers";

import { openModal } from "~/renderer/actions/modals";
import IconCoins from "~/renderer/icons/Coins";

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountHeaderActions = ({ account, parentAccount }: Props) => {
  const dispatch = useDispatch();

  const balance = account.balance;
  const unit = getAccountUnit(account);
  const minRewardsBalance = 10 ** unit.magnitude;

  const onClick = useCallback(() => {
    dispatch(
      openModal("MODAL_ALGORAND_EARN_REWARDS_INFO", {
        account,
      }),
    );
  }, [dispatch, account]);

  if (parentAccount || balance.gt(minRewardsBalance)) return null;

  return [
    {
      key: "algorand",
      onClick: onClick,
      icon: IconCoins,
      label: <Trans i18nKey="account.stake" />,
    },
  ];
};

export default AccountHeaderActions;
