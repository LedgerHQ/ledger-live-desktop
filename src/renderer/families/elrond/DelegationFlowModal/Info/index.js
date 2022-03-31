// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { openModal, closeModal } from "~/renderer/actions/modals";
import EarnRewardsInfoModal from "~/renderer/components/EarnRewardsInfoModal";
import WarnBox from "~/renderer/components/WarnBox";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";

// import { getValidators } from "@ledgerhq/live-common/lib/families/elrond/api";

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

export default function ElrondEarnRewardsInfoModal({ name, account, parentAccount }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
      openModal("MODAL_ELROND_DELEGATE", {
        parentAccount,
        account,
      }),
    );
  }, [parentAccount, account, dispatch, name]);

  const onLearnMore = useCallback(() => {
    openURL(urls.cosmosStakingRewards);
  }, []);

  return (
    <EarnRewardsInfoModal
      name={name}
      onNext={onNext}
      description={t("elrond.delegation.flow.steps.starter.description")}
      bullets={[
        t("elrond.delegation.flow.steps.starter.bullet.0"),
        t("elrond.delegation.flow.steps.starter.bullet.1"),
        t("elrond.delegation.flow.steps.starter.bullet.2"),
      ]}
      additional={
        <WarnBox>{t("elrond.delegation.flow.steps.starter.warning.description")}</WarnBox>
      }
      footerLeft={<LinkWithExternalIcon label={t("delegation.howItWorks")} onClick={onLearnMore} />}
    />
  );
}
