import React from "react";
import { useTranslation } from "react-i18next";
import { Flex, Text } from "@ledgerhq/react-ui";
import useTheme from "~/renderer/hooks/useTheme";

export default function LearnScreen() {
  const { t, i18n } = useTranslation();
  const themeType: string = useTheme("colors.palette.type");

  return (
    <Flex
      flexDirection="column"
      flex={1}
      alignItems="stretch"
      justifyContent="flex-start"
      px={1}
      mx={-1}
    >
      <Text variant="h3" fontSize="28px" lineHeight="33px">
        {t("learn.title")}
      </Text>
      <Flex flexGrow={1}>
        <iframe
          loading="eager"
          sandbox="allow-scripts"
          frameBorder="0"
          allowFullScreen={false}
          width="100%"
          height="100%"
          src={`http://media-ledgerlive.ledger-ppr.com?theme=${themeType}&lang=${i18n.languages[0]}`}
        />
      </Flex>
    </Flex>
  );
}
