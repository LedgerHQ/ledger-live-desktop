// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

import { canDelegate } from "@ledgerhq/live-common/lib/families/cosmos/logic";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";

import { openModal, closeModal } from "~/renderer/actions/modals";
import EarnRewardsInfoModal from "~/renderer/components/EarnRewardsInfoModal";
import InfoBox from "~/renderer/components/InfoBox";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";

type Props = {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

export default function CosmosEarnRewardsInfoModal({ name, account, parentAccount }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const mainAccount = getMainAccount(account, parentAccount);

  const canContinue = canDelegate(mainAccount);

  const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
      openModal(canContinue ? "MODAL_COSMOS_DELEGATE" : "MODAL_RECEIVE", {
        parentAccount,
        account,
      }),
    );
  }, [parentAccount, account, dispatch, name, canContinue]);

  const onLearnMore = useCallback(() => {
    openURL(urls.cosmosStakingRewards);
  }, []);

  return (
    <EarnRewardsInfoModal
      name={name}
      onNext={onNext}
      description={t("cosmos.delegation.flow.steps.starter.description")}
      bullets={[
        t("cosmos.delegation.flow.steps.starter.bullet.0"),
        t("cosmos.delegation.flow.steps.starter.bullet.1"),
        t("cosmos.delegation.flow.steps.starter.bullet.2"),
      ]}
      additional={
        <InfoBox onLearnMore={onLearnMore}>
          {t("cosmos.delegation.flow.steps.starter.warning.description")}
        </InfoBox>
      }
    />
  );
}
