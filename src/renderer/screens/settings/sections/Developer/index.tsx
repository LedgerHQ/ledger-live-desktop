import React from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SectionRow as Row } from "../../Rows";
import { Flex } from "@ledgerhq/react-ui";
import AllowExperimentalAppsToggle from "./AllowExperimentalAppsToggle";
import AllowDebugAppsToggle from "./AllowDebugAppsToggle";
import EnablePlatformDevToolsToggle from "./EnablePlatformDevToolsToggle";
import CatalogProviderSelect from "./CatalogProviderSelect";
import RunLocalAppButton from "./RunLocalAppButton";

const SectionDeveloper = () => {
  const { t } = useTranslation();

  return (
    <>
      <TrackPage category="Settings" name="Developer" />
      <Flex flexDirection="column" rowGap={12}>
        <Row title={t("settings.developer.debugApps")} desc={t("settings.developer.debugAppsDesc")}>
          <AllowDebugAppsToggle />
        </Row>

        <Row
          title={t("settings.developer.experimentalApps")}
          desc={t("settings.developer.experimentalAppsDesc")}
        >
          <AllowExperimentalAppsToggle />
        </Row>

        <Row
          title={t("settings.developer.catalogServer")}
          desc={t("settings.developer.catalogServerDesc")}
        >
          <CatalogProviderSelect />
        </Row>

        <Row
          title={t("settings.developer.enablePlatformDevTools")}
          desc={t("settings.developer.enablePlatformDevToolsDesc")}
        >
          <EnablePlatformDevToolsToggle />
        </Row>
        <RunLocalAppButton />
      </Flex>
    </>
  );
};

export default SectionDeveloper;
