// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { urls } from "~/config/urls";
import TrackPage from "~/renderer/analytics/TrackPage";
import IconLoader from "~/renderer/icons/Loader";
import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from "../../SettingsSection";
import RowItem from "../../RowItem";
import ReleaseNotesButton from "./ReleaseNotesButton";
import TermsButton from "./TermsButton";

const SectionHelp = () => {
  const { t } = useTranslation();
  const version = __APP_VERSION__;

  return (
    <Section>
      <TrackPage category="Settings" name="About" />

      <Header
        icon={<IconLoader size={16} />}
        title={t("settings.tabs.about")}
        desc={t("settings.about.desc")}
      />

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
          url={urls.privacyPolicy}
        />
      </Body>
    </Section>
  );
};

export default SectionHelp;
