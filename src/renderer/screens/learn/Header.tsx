import React from "react";
import { Flex, Text } from "@ledgerhq/react-ui";
import styled from "@ledgerhq/react-ui/components/styled";
import { useTranslation } from "react-i18next";

const TitleContainer = styled(Flex).attrs({
  height: "48px",
  alignItems: "center",
  mb: "40px",
})``;

export default function Header() {
  const { t } = useTranslation();
  return (
    <TitleContainer>
      <Text variant="h3" fontSize="28px">
        {t("learn.title")}
      </Text>
    </TitleContainer>
  );
}
