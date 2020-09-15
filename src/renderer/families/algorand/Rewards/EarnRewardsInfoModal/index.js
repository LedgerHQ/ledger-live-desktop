// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { openModal, closeModal } from "~/renderer/actions/modals";
import EarnRewardsInfoModal from "~/renderer/components/EarnRewardsInfoModal";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

export default function AlgorandEarnRewardsInfoModal({ name, account, parentAccount }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
      openModal("MODAL_RECEIVE", {
        account,
      }),
    );
  }, [account, dispatch, name]);

  const onLearnMore = useCallback(() => {
    openURL(urls.algorandStakingRewards);
  }, []);

  return (
    <EarnRewardsInfoModal
      name={name}
      onNext={onNext}
      nextLabel={t("algorand.claimRewards.flow.steps.starter.button.cta")}
      description={t("algorand.claimRewards.flow.steps.starter.description")}
      bullets={[
        t("algorand.claimRewards.flow.steps.starter.bullet.delegate"),
        t("algorand.claimRewards.flow.steps.starter.bullet.access"),
        t("algorand.claimRewards.flow.steps.starter.bullet.ledger"),
      ]}
      additional={null}
      footerLeft={
        <LinkWithExternalIcon
          label={t("algorand.claimRewards.flow.steps.starter.learnMore")}
          onClick={onLearnMore}
        />
      }
    />
  );
}
