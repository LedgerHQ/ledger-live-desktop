// @flow
import { useCallback } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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

  if (parentAccount || delegations.length > 0) return null;

  const disabledLabel = earnRewardEnabled ? "" : ` - ${t("cosmos.delegation.minSafeWarning")}`;
  const label = `${t("delegation.title")}${disabledLabel}`;

  return [
    {
      key: "cosmos",
      onClick: onClick,
      icon: IconChartLine,
      disabled: !earnRewardEnabled,
      label,
    },
  ];
};

export default AccountHeaderActions;
