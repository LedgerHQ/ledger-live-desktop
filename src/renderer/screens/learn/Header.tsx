import React from "react";
import { Text } from "@ledgerhq/react-ui";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  return (
    <Text variant="h3" fontSize="28px" lineHeight="34px" mb="40px">
      {t("learn.title")}
    </Text>
  );
}
