import React from "react";
import { Flex, Icons, Text, Button } from "@ledgerhq/react-ui";
import { BoxedIcon } from "@ledgerhq/react-ui/components/asorted/Icon";
import { useTranslation } from "react-i18next";

type Props = {
  onStart: () => any;
};

const StartScreen = ({ onStart }: Props) => {
  const { t } = useTranslation();
  return (
    <Flex
      height="100%"
      width="100%"
      alignItems="center"
      justifyContent="center"
      backgroundColor="primary.c60"
    >
      <Flex flexDirection="column" alignItems="center" width={338} height={255} rowGap={7}>
        <BoxedIcon
          Icon={Icons.TrophyMedium}
          iconSize={28}
          size={64}
          borderColor="neutral.c100"
          iconColor="neutral.c100"
        />
        <Text variant="h1">{t("v3.onboarding.quizz.title")}</Text>
        <Text variant="body" fontWeight="medium">
          {t("v3.onboarding.quizz.descr")}
        </Text>
        <Button variant="main" Icon={Icons.PlusMedium} iconPosition="left" onClick={onStart}>
          {t("v3.onboarding.quizz.buttons.start")}
        </Button>
      </Flex>
    </Flex>
  );
};

export default StartScreen;
