// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import EyeOff from "~/renderer/icons/EyeOff";
import { SettingsSection as Section, SettingsSectionHeader as Header } from "../../SettingsSection";
import HideEmptyTokenAccountsToggle from "./HideEmptyTokenAccountsToggle";
import SectionExport from "./Export";
import BlacklistedTokens from "~/renderer/screens/settings/sections/Accounts/BlacklistedTokens";

const SectionAccounts = () => {
  const { t } = useTranslation();

  return (
    <>
      <Section style={{ flowDirection: "column" }}>
        <TrackPage category="Settings" name="Accounts" />

        <Header
          icon={<EyeOff />}
          title={t("settings.accounts.hideEmptyTokens.title")}
          desc={t("settings.accounts.hideEmptyTokens.desc")}
          renderRight={<HideEmptyTokenAccountsToggle />}
        />

        <SectionExport />
      </Section>
      <BlacklistedTokens />
    </>
  );
};

export default SectionAccounts;
