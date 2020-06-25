// @flow
import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { getAccountUnit, getMainAccount } from "@ledgerhq/live-common/lib/account";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal, closeModal } from "~/renderer/actions/modals";
import EarnRewardsInfoModal from "~/renderer/components/EarnRewardsInfoModal";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import WarnBox from "~/renderer/components/WarnBox";

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

export default function TronEarnRewardsInfoModal({ name, account, parentAccount }: Props) {
  const { t } = useTranslation();

  const unit = getAccountUnit(account);
  const mainAccount = getMainAccount(account, parentAccount);
  const minAmount = 10 ** unit.magnitude;

  const { tronResources, spendableBalance } = mainAccount;
  const tronPower = tronResources?.tronPower ?? 0;
  const earnRewardDisabled = tronPower === 0 && spendableBalance.lt(minAmount);

  const dispatch = useDispatch();
  const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
      openModal(earnRewardDisabled ? "MODAL_RECEIVE" : "MODAL_FREEZE", {
        parentAccount,
        account,
      }),
    );
  }, [parentAccount, account, dispatch, name, earnRewardDisabled]);

  return (
    <EarnRewardsInfoModal
      name={name}
      onNext={onNext}
      description={t("tron.voting.flow.steps.starter.description")}
      bullets={[
        t("tron.voting.flow.steps.starter.bullet.delegate"),
        t("tron.voting.flow.steps.starter.bullet.access"),
        t("tron.voting.flow.steps.starter.bullet.ledger"),
      ]}
      additional={<WarnBox>{t("tron.voting.flow.steps.starter.termsAndPrivacy")}</WarnBox>}
      footerLeft={
        <LinkWithExternalIcon
          label={<Trans i18nKey="tron.voting.flow.steps.starter.help" />}
          onClick={() => openURL(urls.stakingTron)}
        />
      }
    />
  );
}
