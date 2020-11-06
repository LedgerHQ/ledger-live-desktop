// @flow
import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

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

export default function PolkadotEarnRewardsInfoModal({ name, account, parentAccount }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
      openModal("MODAL_POLKADOT_BOND", {
        account,
      }),
    );
  }, [account, dispatch, name]);

  return (
    <EarnRewardsInfoModal
      name={name}
      onNext={onNext}
      description={t("polkadot.nomination.flow.steps.starter.description")}
      bullets={[
        t("polkadot.nomination.flow.steps.starter.bullet.0"),
        t("polkadot.nomination.flow.steps.starter.bullet.1"),
        t("polkadot.nomination.flow.steps.starter.bullet.2"),
      ]}
      additional={<WarnBox>{t("polkadot.nomination.flow.steps.starter.termsAndPrivacy")}</WarnBox>}
      footerLeft={
        <LinkWithExternalIcon
          label={<Trans i18nKey="polkadot.nomination.flow.steps.starter.help" />}
          onClick={() => openURL(urls.stakingPolkadot)}
        />
      }
    />
  );
}
