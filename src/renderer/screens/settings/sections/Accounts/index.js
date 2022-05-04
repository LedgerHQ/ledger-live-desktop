// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SettingsSectionRow as Row, SettingsSectionBody as Body } from "../../SettingsSection";
import HideEmptyTokenAccountsToggle from "./HideEmptyTokenAccountsToggle";
import SectionExport from "./Export";
import Currencies from "./Currencies";
import BlacklistedTokens from "./BlacklistedTokens";
import HiddenNftCollections from "./HiddenNFTCollections";

export default function SectionAccounts() {
  const { t } = useTranslation();

  return (
    <Body>
      <TrackPage category="Settings" name="Accounts" />
      <SectionExport />
      <Row
        title={t("settings.accounts.hideEmptyTokens.title")}
        desc={t("settings.accounts.hideEmptyTokens.desc")}
      >
        <HideEmptyTokenAccountsToggle />
      </Row>
      <BlacklistedTokens />
      <HiddenNftCollections />
      <Currencies />
    </Body>
  );
}
