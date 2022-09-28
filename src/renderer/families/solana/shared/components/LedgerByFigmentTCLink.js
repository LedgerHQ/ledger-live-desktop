// @flow
import React from "react";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { useTranslation } from "react-i18next";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { LEDGER_VALIDATOR_ADDRESS } from "@ledgerhq/live-common/lib/families/solana/utils";
import type { Transaction } from "@ledgerhq/live-common/lib/families/solana/types";

type Props = {
  transaction: Transaction,
};

export default function LedgerByFigmentTC({ transaction }: Props) {
  const { t } = useTranslation();
  if (!shouldShowTC(transaction)) {
    return null;
  }

  const openLedgerByFigmentTC = () => openURL(urls.solana.ledgerByFigmentTC);

  return (
    <LinkWithExternalIcon
      label={t("solana.delegation.ledgerByFigmentTC")}
      onClick={openLedgerByFigmentTC}
    />
  );
}

const shouldShowTC = ({ model }: Transaction) => {
  switch (model.kind) {
    case "stake.createAccount":
      return model.uiState.delegate.voteAccAddress === LEDGER_VALIDATOR_ADDRESS;
    case "stake.delegate":
      return model.uiState.voteAccAddr === LEDGER_VALIDATOR_ADDRESS;
    default:
      break;
  }
  return false;
};
