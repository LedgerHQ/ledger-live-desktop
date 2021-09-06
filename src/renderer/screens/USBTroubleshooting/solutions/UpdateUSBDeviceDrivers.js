// @flow
import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Wrapper,
  Illustration,
  Number,
  Title,
  Content,
  BulletRowIcon,
  TranslatedLink,
} from "./shared";
import Box from "~/renderer/components/Box";
import BulletRow from "~/renderer/components/BulletRow";
import Text from "~/renderer/components/Text";
import { openURL } from "~/renderer/linking";
import illustration from "~/renderer/images/USBTroubleshooting/illus1.png";
import { urls } from "~/config/urls";

const UpdateUSBDeviceDriversSolution = ({ number = 1 }: { number?: number }) => {
  const { t } = useTranslation();
  const onClickLink = useCallback(() => {
    openURL(urls.troubleshootingUSB);
  }, []);

  return (
    <Wrapper>
      <Number>{t("USBTroubleshooting.solution", { number })}</Number>
      <Title>{t("USBTroubleshooting.solutions.updateUSBDeviceDrivers.title")}</Title>
      <Content>
        <Illustration image={illustration} />
        <Box flex={2}>
          <Text mb={3} ff="Inter|SemiBold" color="palette.text.shade90" fontSize={5}>
            {t("USBTroubleshooting.followSteps")}
          </Text>
          <BulletRow
            step={{
              icon: <BulletRowIcon>1</BulletRowIcon>,
              desc: (
                <Text ff="Inter|Medium" fontSize={4}>
                  <Trans i18nKey="USBTroubleshooting.solutions.updateUSBDeviceDrivers.bullets.0">
                    <TranslatedLink onClick={onClickLink} />
                  </Trans>
                </Text>
              ),
            }}
          />
          <BulletRow
            step={{
              icon: <BulletRowIcon>1</BulletRowIcon>,
              desc: (
                <Text ff="Inter|Medium" fontSize={4}>
                  {t("USBTroubleshooting.solutions.updateUSBDeviceDrivers.bullets.1")}
                </Text>
              ),
            }}
          />
          <BulletRow
            step={{
              icon: <BulletRowIcon>1</BulletRowIcon>,
              desc: (
                <Text ff="Inter|Medium" fontSize={4}>
                  {t("USBTroubleshooting.solutions.updateUSBDeviceDrivers.bullets.2")}
                </Text>
              ),
            }}
          />
        </Box>
      </Content>
    </Wrapper>
  );
};

export default UpdateUSBDeviceDriversSolution;
