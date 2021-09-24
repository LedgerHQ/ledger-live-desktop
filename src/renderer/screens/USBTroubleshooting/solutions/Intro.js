// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import illustration from "~/renderer/images/USBTroubleshooting/device.png";
export const Illustration: ThemedComponent<{}> = styled.div`
  background-image: url(${p => p.image});
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  height: 54px;
  width: 380px;
  grid-gap: 12px;
`;

const Intro = ({ onStart, onBack }: { onStart: () => void, onBack: () => void }) => {
  const { t } = useTranslation();

  return (
    <Box alignItems="center" justifyContent="center" flex={1}>
      <Illustration image={illustration} />
      <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={22} mt={48} mb={12}>
        {t("connectTroubleshooting.steps.entry.title")}
      </Text>
      <Text
        mb={48}
        ff="Inter|Regular"
        color="palette.text.shade80"
        fontSize={4}
        style={{ maxWidth: 480, textAlign: "center" }}
      >
        {t("connectTroubleshooting.steps.entry.desc")}
      </Text>
      <Box horizontal>
        <Button onClick={onBack} event="USBTroubleshooting Intro - Back">
          {t("connectTroubleshooting.steps.entry.back")}
        </Button>
        <Button
          ml={3}
          primary
          event="USBTroubleshooting Intro - Start"
          onClick={onStart}
          id="USBTroubleshooting-intro-start"
        >
          {t("connectTroubleshooting.steps.entry.cta")}
        </Button>
      </Box>
    </Box>
  );
};

export default Intro;
