// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import EyeSlash from "~/renderer/icons/EyeSlash";
import { SettingsSection as Section, SettingsSectionHeader as Header } from "../../SettingsSection";
import HideEmptyTokenAccountsToggle from "./HideEmptyTokenAccountsToggle";
import SectionExport from "./Export";
import Currencies from "./Currencies";
import BlacklistedTokens from "./BlacklistedTokens";

export default function SectionAccounts() {
  const { t } = useTranslation();

  return (
    <>
      <Section style={{ flowDirection: "column" }}>
        <TrackPage category="Settings" name="Accounts" />
        <Currencies />
        <SectionExport />
        <Header
          icon={<EyeSlash />}
          title={t("settings.accounts.hideEmptyTokens.title")}
          desc={t("settings.accounts.hideEmptyTokens.desc")}
          renderRight={<HideEmptyTokenAccountsToggle />}
        />
        <BlacklistedTokens />
      </Section>
    </>
  );
}
