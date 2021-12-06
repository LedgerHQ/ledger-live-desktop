import React, { useCallback, useState, useEffect } from "react";

import { SectionRow as Row } from "../../Rows";
import TrackPage from "~/renderer/analytics/TrackPage";
import ReleaseNotesButton from "./ReleaseNotesButton";
import { setDeveloperMode } from "~/renderer/actions/settings";
import { developerModeSelector } from "~/renderer/reducers/settings";
import { useDynamicUrl } from "~/renderer/terms";
import { openURL } from "~/renderer/linking";

import { useToasts } from "@ledgerhq/live-common/lib/notifications/ToastProvider";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import { Flex, Link, Icons } from "@ledgerhq/react-ui";

const SectionHelp = () => {
  const { t } = useTranslation();
  const privacyPolicyUrl = useDynamicUrl("privacyPolicy");
  const termsUrl = useDynamicUrl("terms");
  const devMode = useSelector(developerModeSelector);
  const dispatch = useDispatch();
  const { pushToast } = useToasts();

  const version = process.env.SPECTRON_RUN ? "0.0.0" : __APP_VERSION__;
  const [clickCounter, setClickCounter] = useState(0);
  const onVersionClick = useCallback(() => {
    if (clickCounter < 10) {
      setClickCounter(counter => counter + 1);
    }
  }, [clickCounter]);

  useEffect(() => {
    if (clickCounter === 10 && !devMode) {
      dispatch(setDeveloperMode(true));
      pushToast({
        id: uuidv4(),
        type: "achievement",
        title: t("settings.developer.toast.title"),
        text: t("settings.developer.toast.text"),
        icon: "info",
      });
    }
  }, [clickCounter, devMode, pushToast, t, dispatch]);

  return (
    <>
      <TrackPage category="Settings" name="About" />
      <Flex flexDirection="column" rowGap={12}>
        <Row
          title={t("settings.help.version")}
          desc={`Ledger Live ${version}`}
          onClick={onVersionClick}
        >
          <ReleaseNotesButton />
        </Row>

        <Row title={t("settings.help.terms")} desc={t("settings.help.termsDesc")}>
          <Link
            iconPosition="right"
            type="main"
            size="medium"
            Icon={Icons.ExternalLinkMedium}
            onClick={e => {
              e.preventDefault();
              openURL(termsUrl);
            }}
          >
            {t("common.learnMore")}
          </Link>
        </Row>

        <Row title={t("settings.help.privacy")} desc={t("settings.help.privacyDesc")}>
          <Link
            iconPosition="right"
            type="main"
            size="medium"
            Icon={Icons.ExternalLinkMedium}
            onClick={e => {
              e.preventDefault();
              openURL(privacyPolicyUrl);
            }}
          >
            {t("common.learnMore")}
          </Link>
        </Row>
      </Flex>
    </>
  );
};

export default SectionHelp;
