// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SettingsSectionBody as Body, SettingsSectionRow as Row } from "../../SettingsSection";
import RowItem from "../../RowItem";
import ReleaseNotesButton from "./ReleaseNotesButton";
import TermsButton from "./TermsButton";
import { usePrivacyUrl } from "~/renderer/terms";

const SectionHelp = () => {
  const { t } = useTranslation();
  const privacyPolicyUrl = usePrivacyUrl();
  const version = process.env.SPECTRON_RUN ? "0.0.0" : __APP_VERSION__;

  return (
    <>
      <TrackPage category="Settings" name="About" />
      <Body>
        <Row title={t("settings.help.version")} desc={`Ledger Live ${version}`}>
          <ReleaseNotesButton />
        </Row>

        <Row title={t("settings.help.terms")} desc={t("settings.help.termsDesc")}>
          <TermsButton />
        </Row>

        <RowItem
          title={t("settings.help.privacy")}
          desc={t("settings.help.privacyDesc")}
          url={privacyPolicyUrl}
        />
      </Body>
    </>
  );
};

export default SectionHelp;
