// @flow
import { getAccountUnit, getMainAccount } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import IconCoins from "~/renderer/icons/Coins";
import { localeSelector } from "~/renderer/reducers/settings";

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountHeaderManageActionsComponent = ({ account, parentAccount }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const unit = getAccountUnit(account);
  const locale = useSelector(localeSelector);
  const mainAccount = getMainAccount(account, parentAccount);
  const minAmount = 10 ** unit.magnitude;

  const { tronResources, spendableBalance } = mainAccount;
  const tronPower = tronResources?.tronPower ?? 0;
  const earnRewardDisabled = tronPower === 0 && spendableBalance.lt(minAmount);

  const formattedMinAmount = formatCurrencyUnit(unit, BigNumber(minAmount), {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
    locale,
  });

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

  if (parentAccount) return null;

  return [
    {
      key: "Stake",
      onClick: onClick,
      disabled: earnRewardDisabled,
      icon: IconCoins,
      label: t('account.stake'),
    },
  ];
};

const AccountHeaderManageActions = ({ account, parentAccount }: Props) => {
  const mainAccount = getMainAccount(account, parentAccount);
  const { tronResources } = mainAccount;

  if (!tronResources) return null;

  return AccountHeaderManageActionsComponent({ account, parentAccount });
};

export default AccountHeaderManageActions;
