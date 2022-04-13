// @flow
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import IconCoins from "~/renderer/icons/Coins";

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountHeaderManageActionsComponent = ({ account, parentAccount }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    dispatch(
      openModal("MODAL_DELEGATE", {
        parentAccount,
        account,
      }),
    );
  }, [dispatch, account, parentAccount]);

  if (parentAccount) return null;

  return [
    {
      key: "Stake",
      onClick: onClick,
      icon: IconCoins,
      label: t('account.stake'),
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
