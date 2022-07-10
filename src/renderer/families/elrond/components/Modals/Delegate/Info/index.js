import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { openModal, closeModal } from "~/renderer/actions/modals";
import EarnRewardsInfoModal from "~/renderer/components/EarnRewardsInfoModal";
import WarnBox from "~/renderer/components/WarnBox";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { constants } from "~/renderer/families/elrond/constants";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

export default function ElrondEarnRewardsInfoModal({
  name,
  account,
  parentAccount,
  validators,
  delegations,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
      openModal(constants.modals.stake, {
        parentAccount,
        account,
        validators,
        delegations,
      }),
    );
  }, [parentAccount, account, dispatch, validators, delegations, name]);

  const onLearnMore = useCallback(() => {
    openURL(urls.elrondStaking);
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
      footerLeft={
        <LinkWithExternalIcon
          label={t("elrond.delegation.emptyState.info")}
          onClick={onLearnMore}
        />
      }
    />
  );
}
