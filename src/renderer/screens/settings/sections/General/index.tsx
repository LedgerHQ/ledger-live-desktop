import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { EXPERIMENTAL_MARKET_INDICATOR_SETTINGS } from "~/config/constants";
import { langAndRegionSelector } from "~/renderer/reducers/settings";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SectionRow as Row } from "../../Rows";
import { Flex } from "@ledgerhq/react-ui";
import CounterValueSelect from "./CounterValueSelect";
import LanguageSelect from "./LanguageSelect";
import RegionSelect from "./RegionSelect";
import ThemeSelect from "./ThemeSelect";
import MarketIndicatorRadio from "./MarketIndicatorRadio";
import PasswordButton from "./PasswordButton";
import PasswordAutoLockSelect from "./PasswordAutoLockSelect";
import SentryLogsButton from "./SentryLogsButton";
import ShareAnalyticsButton from "./ShareAnalyticsButton";
import CarouselVisibility from "./CarouselVisibility";
import { hasPasswordSelector } from "~/renderer/reducers/application";

const SectionGeneral = () => {
  const { useSystem } = useSelector(langAndRegionSelector);
  const hasPassword = useSelector(hasPasswordSelector);
  const { t } = useTranslation();

  return (
    <>
      <TrackPage category="Settings" name="Display" />
      <Flex flexDirection="column" rowGap={12}>
        <Row
          title={t("settings.display.counterValue")}
          desc={t("settings.display.counterValueDesc")}
        >
          <CounterValueSelect />
        </Row>

        <Row title={t("settings.display.language")} desc={t("settings.display.languageDesc")}>
          <LanguageSelect />
        </Row>
        {useSystem ? null : (
          <Row title={t("settings.display.region")} desc={t("settings.display.regionDesc")}>
            <RegionSelect />
          </Row>
        )}

        <Row title={t("settings.display.theme")} desc={t("settings.display.themeDesc")}>
          <ThemeSelect />
        </Row>
        {EXPERIMENTAL_MARKET_INDICATOR_SETTINGS ? (
          <Row title={t("settings.display.stock")} desc={t("settings.display.stockDesc")}>
            <MarketIndicatorRadio />
          </Row>
        ) : null}

        <Row title={t("settings.profile.password")} desc={t("settings.profile.passwordDesc")}>
          <PasswordButton />
        </Row>
        {hasPassword ? (
          <Row
            title={t("settings.profile.passwordAutoLock")}
            desc={t("settings.profile.passwordAutoLockDesc")}
          >
            <PasswordAutoLockSelect />
          </Row>
        ) : null}
        <Row
          title={t("settings.profile.reportErrors")}
          desc={t("settings.profile.reportErrorsDesc")}
        >
          <SentryLogsButton />
        </Row>
        <Row title={t("settings.profile.analytics")} desc={t("settings.profile.analyticsDesc")}>
          <ShareAnalyticsButton />
        </Row>
        <Row
          title={t("settings.display.carouselVisibility")}
          desc={t("settings.display.carouselVisibilityDesc")}
        >
          <CarouselVisibility />
        </Row>
      </Flex>
    </>
  );
};

export default SectionGeneral;
