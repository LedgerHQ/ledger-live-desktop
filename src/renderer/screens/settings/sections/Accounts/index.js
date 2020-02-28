// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import EyeSlash from "~/renderer/icons/EyeSlash";
import { SettingsSection as Section, SettingsSectionHeader as Header } from "../../SettingsSection";
import HideEmptyTokenAccountsToggle from "./HideEmptyTokenAccountsToggle";
import SectionExport from "./Export";

const SectionAccounts = () => {
  const { t } = useTranslation();

  return (
    <Section style={{ flowDirection: "column" }}>
      <TrackPage category="Settings" name="Accounts" />

      <Header
        icon={<EyeSlash />}
        title={t("settings.accounts.hideEmptyTokens.title")}
        desc={t("settings.accounts.hideEmptyTokens.desc")}
        renderRight={<HideEmptyTokenAccountsToggle />}
      />

      <SectionExport />
    </Section>
  );
};

export default SectionAccounts;
