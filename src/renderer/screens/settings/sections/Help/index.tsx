import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import TrackPage from "~/renderer/analytics/TrackPage";
import ExportLogsBtn from "~/renderer/components/ExportLogsButton";
import OpenUserDataDirectoryBtn from "~/renderer/components/OpenUserDataDirectoryBtn";

import { SectionRow as Row } from "../../Rows";
import CleanButton from "./CleanButton";
import ResetButton from "./ResetButton";
import ResetKYCButton from "./ResetKYCButton";
import { swapKYCSelector } from "~/renderer/reducers/settings";
import RepairDeviceButton from "./RepairDeviceButton";
import LaunchOnboardingBtn from "./LaunchOnboardingBtn";

import { Flex, Icons, Link } from "@ledgerhq/react-ui";

const SectionHelp = () => {
  const { t } = useTranslation();
  const swapKYC = useSelector(swapKYCSelector);
  return (
    <>
      <TrackPage category="Settings" name="Help" />
      <Flex flexDirection="column" rowGap={12}>
        <Row title={t("settings.help.faq")} desc={t("settings.help.faqDesc")}>
          <Link
            iconPosition="right"
            type="main"
            size="medium"
            Icon={Icons.ExternalLinkMedium}
            onClick={e => {
              e.preventDefault();
              openURL(urls.faq);
            }}
          >
            {t("common.learnMore")}
          </Link>
        </Row>
        <Row
          title={t("settings.profile.softResetTitle")}
          desc={t("settings.profile.softResetDesc")}
        >
          <CleanButton />
        </Row>
        <Row title={t("settings.exportLogs.title")} desc={t("settings.exportLogs.desc")}>
          <ExportLogsBtn style={{ width: "120px" }} />
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
          <OpenUserDataDirectoryBtn variant="main" style={{ width: "120px" }} />
        </Row>
        <Row
          title={t("settings.repairDevice.title")}
          desc={t("settings.repairDevice.descSettings")}
        >
          <RepairDeviceButton />
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
      </Flex>
    </>
  );
};

export default SectionHelp;
