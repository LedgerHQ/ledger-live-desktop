// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { urls } from "~/config/urls";
import TrackPage from "~/renderer/analytics/TrackPage";
import ExportLogsBtn from "~/renderer/components/ExportLogsButton";
import OpenUserDataDirectoryBtn from "~/renderer/components/OpenUserDataDirectoryBtn";
import RowItem from "../../RowItem";
import { SettingsSectionBody as Body, SettingsSectionRow as Row } from "../../SettingsSection";
import CleanButton from "./CleanButton";
import ResetButton from "./ResetButton";
import ResetKYCButton from "./ResetKYCButton";
import { swapKYCSelector } from "~/renderer/reducers/settings";
import RepairDeviceButton from "./RepairDeviceButton";
import LaunchOnboardingBtn from "./LaunchOnboardingBtn";

const SectionHelp = () => {
  const { t } = useTranslation();
  const swapKYC = useSelector(swapKYCSelector);
  return (
    <>
      <TrackPage category="Settings" name="Help" />
      <Body>
        <RowItem title={t("settings.help.faq")} desc={t("settings.help.faqDesc")} url={urls.faq} />
        <Row
          title={t("settings.profile.softResetTitle")}
          desc={t("settings.profile.softResetDesc")}
        >
          <CleanButton />
        </Row>
        <Row title={t("settings.exportLogs.title")} desc={t("settings.exportLogs.desc")}>
          <ExportLogsBtn />
        </Row>
        <Row
          title={t("settings.profile.launchOnboarding")}
          desc={t("settings.profile.launchOnboardingDesc")}
        >
          <LaunchOnboardingBtn />
        </Row>
        <Row
          title={t("settings.openUserDataDirectory.title")}
          desc={t("settings.openUserDataDirectory.desc")}
        >
          <OpenUserDataDirectoryBtn primary small />
        </Row>
        <Row
          title={t("settings.repairDevice.title")}
          desc={t("settings.repairDevice.descSettings")}
        >
          <RepairDeviceButton buttonProps={{ small: true, primary: true }} />
        </Row>
        {swapKYC.wyre ? (
          <Row title={t("settings.profile.resetKYC")} desc={t("settings.profile.resetKYCDesc")}>
            <ResetKYCButton />
          </Row>
        ) : null}
        <Row
          title={t("settings.profile.hardResetTitle")}
          desc={t("settings.profile.hardResetDesc")}
        >
          <ResetButton />
        </Row>
      </Body>
    </>
  );
};

export default SectionHelp;
