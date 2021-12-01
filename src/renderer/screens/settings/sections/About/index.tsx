import React, { useCallback, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SectionRow as Row } from "../../Rows";
import ReleaseNotesButton from "./ReleaseNotesButton";
import { setDeveloperMode } from "../../../../actions/settings";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "@ledgerhq/live-common/lib/notifications/ToastProvider";
import { v4 as uuidv4 } from "uuid";
import { developerModeSelector } from "../../../../reducers/settings";
import { useDynamicUrl } from "~/renderer/terms";
import { Flex } from "@ledgerhq/react-ui";

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

        <Row
          title={t("settings.help.terms")}
          desc={t("settings.help.termsDesc")}
          linkHref={termsUrl}
          linkLabel={t("common.learnMore")}
        />

        <Row
          title={t("settings.help.privacy")}
          desc={t("settings.help.privacyDesc")}
          linkHref={privacyPolicyUrl}
          linkLabel={t("common.learnMore")}
        />
      </Flex>
    </>
  );
};

export default SectionHelp;
