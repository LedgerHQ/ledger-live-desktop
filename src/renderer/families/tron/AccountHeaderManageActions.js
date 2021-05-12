// @flow
import React, { useCallback } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import { getAccountUnit, getMainAccount } from "@ledgerhq/live-common/lib/account";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import IconChartLine from "~/renderer/icons/ChartLine";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { openModal } from "~/renderer/actions/modals";

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountHeaderManageActions = ({ account, parentAccount }: Props) => {
  const dispatch = useDispatch();
  const unit = getAccountUnit(account);
  const mainAccount = getMainAccount(account, parentAccount);
  const minAmount = 10 ** unit.magnitude;

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

  if (parentAccount || earnRewardDisabled) return null;

  return [
    {
      key: "tron",
      onClick: onClick,
      icon: tronPower > 0 ? CryptoCurrencyIcon : IconChartLine,
      label: <Trans i18nKey={tronPower > 0 ? "tron.voting.manageTP" : "delegation.title"} />,
    },
  ];
};

export default AccountHeaderManageActions;
