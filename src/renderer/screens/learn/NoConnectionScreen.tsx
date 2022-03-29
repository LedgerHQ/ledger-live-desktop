import React from "react";
import { useTranslation } from "react-i18next";
import NoConnectionIllustration from "./assets/NoConnection";
import ErrorScreen from "./ErrorScreen";

export default function NoConnectionScreen() {
  const { t } = useTranslation();
  return (
    <ErrorScreen
      title={t("learn.noConnection")}
      description={t("learn.noConnectionDesc")}
      illustration={<NoConnectionIllustration />}
    />
  );
}
