// @flow
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import IconCoins from "~/renderer/icons/Coins";
import { useDelegation } from "@ledgerhq/live-common/lib/families/tezos/bakers";

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountHeaderManageActionsComponent = ({ account, parentAccount }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const delegation = useDelegation(account);

  const onClick = useCallback(() => {
    const options = delegation
      ? {
          parentAccount,
          account,
          eventType: "redelegate",
          stepId: "summary",
        }
      : {
          parentAccount,
          account,
        };
    dispatch(openModal("MODAL_DELEGATE", options));
  }, [dispatch, account, parentAccount, delegation]);

  if (parentAccount) return null;

  return [
    {
      key: "Stake",
      onClick: onClick,
      icon: IconCoins,
      label: t("account.stake"),
    },
  ];
};

const AccountHeaderManageActions = ({ account, parentAccount }: Props) => {
  const mainAccount = getMainAccount(account, parentAccount);
  const { tezosResources } = mainAccount;

  if (!tezosResources) return null;

  return AccountHeaderManageActionsComponent({ account, parentAccount });
};

export default AccountHeaderManageActions;
