// @flow
import React from "react";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { useTranslation } from "react-i18next";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";

export default function LedgerByFigmentTC() {
  const { t } = useTranslation();
  const openLedgerByFigmentTC = () => openURL(urls.solana.ledgerByFigmentTC);

  return (
    <LinkWithExternalIcon
      label={t("solana.delegation.ledgerByFigmentTC")}
      onClick={openLedgerByFigmentTC}
    />
  );
}
