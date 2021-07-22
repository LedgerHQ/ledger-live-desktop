// @flow

import React, { useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SettingsSectionBody as Body, SettingsSectionRow as Row } from "../../SettingsSection";
import RowItem from "../../RowItem";
import ReleaseNotesButton from "./ReleaseNotesButton";
import TermsButton from "./TermsButton";
import { usePrivacyUrl } from "~/renderer/terms";
import { setDeveloperMode } from "../../../../actions/settings";
import { useDispatch } from "react-redux";

const SectionHelp = () => {
  const { t } = useTranslation();
  const privacyPolicyUrl = usePrivacyUrl();
  const version = process.env.SPECTRON_RUN ? "0.0.0" : __APP_VERSION__;
  const dispatch = useDispatch();

  const [clickCounter, setClickCounter] = useState(0);
  const onVersionClick = useCallback(() => {
    if (clickCounter < 10) {
      setClickCounter(counter => counter + 1);
    }
  }, [clickCounter]);

  useEffect(() => {
    if (clickCounter === 10) {
      dispatch(setDeveloperMode(true));
    }
  }, [clickCounter]);

  return (
    <>
      <TrackPage category="Settings" name="About" />
      <Body>
        <Row
          title={t("settings.help.version")}
          desc={`Ledger Live ${version}`}
          onClick={onVersionClick}
        >
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
