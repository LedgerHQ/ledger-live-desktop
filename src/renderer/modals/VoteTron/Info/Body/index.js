// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import { ModalBody } from "~/renderer/components/Modal";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import VoteTronInfoModalBodyMain from "./Main";
import VoteTronInfoModalBodyFooter from "./Footer";

type Props = {
  onClose: () => void,
  name?: string,
  account: AccountLike,
  parentAccount: ?Account,
};

export default function VoteTronInfoModalBody({ onClose, name, account, parentAccount }: Props) {
  const { t } = useTranslation();

  return (
    <ModalBody
      title={t("tron.manage.vote.steps.vote.title")}
      onClose={onClose}
      noScroll
      render={() => <VoteTronInfoModalBodyMain account={account} parentAccount={parentAccount} />}
      renderFooter={() => (
        <VoteTronInfoModalBodyFooter name={name} account={account} parentAccount={parentAccount} />
      )}
    />
  );
}
