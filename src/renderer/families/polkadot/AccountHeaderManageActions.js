// @flow
import { useCallback } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import type { Account } from "@ledgerhq/live-common/lib/types";
import {
  hasExternalController,
  hasExternalStash,
  hasPendingOperationType,
} from "@ledgerhq/live-common/lib/families/polkadot/logic";

import { openModal } from "~/renderer/actions/modals";
import IconCoins from "~/renderer/icons/Coins";

type Props = {
  account: Account,
};

const AccountHeaderManageActions = ({ account }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { polkadotResources } = account;
  invariant(polkadotResources, "polkadot account expected");

  const hasBondedBalance = polkadotResources.lockedBalance && polkadotResources.lockedBalance.gt(0);
  const hasPendingBondOperation = hasPendingOperationType(account, "BOND");

  const onClick = useCallback(() => {
    if (hasBondedBalance || hasPendingBondOperation) {
      dispatch(
        openModal("MODAL_POLKADOT_MANAGE", {
          account,
        }),
      );
    } else {
      dispatch(
        openModal("MODAL_POLKADOT_REWARDS_INFO", {
          account,
        }),
      );
    }
  }, [dispatch, account, hasBondedBalance, hasPendingBondOperation]);

  const _hasExternalController = hasExternalController(account);
  const _hasExternalStash = hasExternalStash(account);

  const manageEnabled = !(
    _hasExternalController ||
    _hasExternalStash ||
    (!hasBondedBalance && hasPendingBondOperation)
  );

  const disabledLabel = manageEnabled
    ? ""
    : `${t(
        _hasExternalController
          ? "polkadot.nomination.externalControllerTooltip"
          : _hasExternalStash
          ? "polkadot.nomination.externalStashTooltip"
          : "polkadot.nomination.hasPendingBondOperation",
      )}`;

  return [
    {
      key: "polkadot",
      onClick: onClick,
      icon: IconCoins,
      disabled: !manageEnabled,
      label: t("account.stake"),
      tooltip: disabledLabel,
    },
  ];
};

export default AccountHeaderManageActions;
