// @flow
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { urls } from "~/config/urls";
import { closeModal, openModal } from "~/renderer/actions/modals";
import EarnRewardsInfoModal from "~/renderer/components/EarnRewardsInfoModal";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import WarnBox from "~/renderer/components/WarnBox";
import { openURL } from "~/renderer/linking";

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

export default function SolanaEarnRewardsInfoModal({ name, account, parentAccount }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
      openModal("MODAL_SOLANA_DELEGATE", {
        parentAccount,
        account,
      }),
    );
  }, [parentAccount, account, dispatch, name]);

  const onLearnMore = useCallback(() => {
    openURL(urls.solana.staking);
  }, []);

  return (
    <EarnRewardsInfoModal
      name={name}
      onNext={onNext}
      description={t("solana.delegation.earnRewards.description")}
      bullets={[
        t("solana.delegation.earnRewards.bullet.0"),
        t("solana.delegation.earnRewards.bullet.1"),
        t("solana.delegation.earnRewards.bullet.2"),
      ]}
      additional={<WarnBox>{t("solana.delegation.earnRewards.warning")}</WarnBox>}
      footerLeft={<LinkWithExternalIcon label={t("delegation.howItWorks")} onClick={onLearnMore} />}
    />
  );
}
