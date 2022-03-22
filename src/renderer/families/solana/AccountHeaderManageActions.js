// @flow
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { canDelegate } from "@ledgerhq/live-common/lib/families/cosmos/logic";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import invariant from "invariant";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
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

  const { solanaResources } = mainAccount;

  invariant(solanaResources, "solana account expected");

  if (solanaResources.stakes.length > 0) {
    return null;
  }

  const onClick = useCallback(() => {
    dispatch(
      openModal("MODAL_SOLANA_REWARDS_INFO", {
        account,
      }),
    );
  }, [dispatch, account]);

  return [
    {
      key: "solana",
      onClick: onClick,
      icon: IconChartLine,
      label: t("delegation.title"),
    },
  ];
};

export default AccountHeaderActions;
