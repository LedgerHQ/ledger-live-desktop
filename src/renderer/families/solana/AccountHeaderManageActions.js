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

const AccountHeaderActions = ({ account, parentAccount }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mainAccount = getMainAccount(account, parentAccount);
  const { solanaResources } = mainAccount;

  const onClick = useCallback(() => {
    dispatch(
      openModal(
        solanaResources && solanaResources.stakes.length > 0
          ? "MODAL_SOLANA_DELEGATE"
          : "MODAL_SOLANA_REWARDS_INFO",
        {
          account,
        },
      ),
    );
  }, [dispatch, account, solanaResources]);

  return [
    {
      key: "solana",
      onClick: onClick,
      icon: IconCoins,
      label: t("account.stake"),
    },
  ];
};

export default AccountHeaderActions;
