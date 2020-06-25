// @flow
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { openModal, closeModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";

export default function VoteTronInfoModalBodyFooter({
  name,
  account,
  parentAccount,
}: {
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
}) {
  const { t } = useTranslation();

  const mainAccount = getMainAccount(account, parentAccount);

  const { tronResources } = mainAccount;

  const hasVotesAvailable = tronResources ? tronResources.tronPower > 0 : false;

  const dispatch = useDispatch();
  const onNext = useCallback(() => {
    dispatch(closeModal(name));
    dispatch(
      openModal("MODAL_VOTE_TRON", {
        parentAccount,
        account,
      }),
    );
  }, [dispatch, name, account, parentAccount]);

  return (
    <>
      <Button primary disabled={!hasVotesAvailable} onClick={onNext}>
        {t("tron.manage.vote.steps.vote.footer.next")}
      </Button>
    </>
  );
}
