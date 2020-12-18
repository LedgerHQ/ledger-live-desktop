// @flow

import React from "react";
import { useTranslation, Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import { UseCaseOption } from "./UseCaseOption";
import { ScrollArea } from "~/renderer/components/Onboarding/ScrollArea";
import { Separator } from "./Separator";
import Button from "~/renderer/components/Button";
import deviceConnect from "./assets/deviceConnect.svg";
import importRecovery from "./assets/importRecovery.svg";
import nanoBox from "./assets/nanoBox.svg";
import { deviceById } from "~/renderer/components/Onboarding/Screens/SelectDevice/devices";

const SelectUseCaseContainer = styled.div`
  width: 100%;
  padding: 134px 208px;
  display: flex;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
`;

const DeviceConnect = styled.div`
  background: url(${deviceConnect}) no-repeat top right;
  width: 224px;
  height: 180px;
`;

const ImportRecovery = styled.div`
  background: url(${importRecovery}) no-repeat top right;
  width: 224px;
  height: 180px;
`;

const NanoBox = styled.div`
  background: url(${nanoBox}) no-repeat top right;
  width: 224px;
  height: 180px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const LeftColumn = styled.div`
  max-width: 225px;
  display: flex;
  flex-direction: column;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
    margin: 15px 0px;
  }

  & > :first-child {
    margin-top: 0px;
  }

  & > :last-child {
    margin-bottom: 0px;
  }
`;

const TopRightContainer = styled.div`
  position: absolute;
  right: 40px;
  top: 40px;
`;

type Props = {
  sendEvent: string => void,
  context: {
    deviceId: string,
  },
};

export function SelectUseCase({ sendEvent, context }: Props) {
  const { t } = useTranslation();

  const device = deviceById(context.deviceId);

  return (
    <ScrollArea withHint>
      <TopRightContainer>
        <Button small onClick={() => sendEvent("PREV")}>
          Switch device
        </Button>
      </TopRightContainer>
      <SelectUseCaseContainer>
        <Row>
          <LeftColumn>
            <Text mb="8px" color="palette.text.shade100" ff="Inter|SemiBold" fontSize="18px">
              {t("onboarding.screens.selectUseCase.greetings")}
            </Text>
            <Text color="palette.text.shade100" ff="Inter|SemiBold" fontSize="32px">
              <Trans
                i18nKey="onboarding.screens.selectUseCase.hasNoRecovery"
                values={{
                  deviceName: device.productName,
                }}
              />
            </Text>
          </LeftColumn>
          <RightColumn>
            <UseCaseOption
              id="first-use"
              heading={t("onboarding.screens.selectUseCase.options.1.heading")}
              title={
                <Trans
                  i18nKey="onboarding.screens.selectUseCase.options.1.title"
                  values={{
                    deviceName: device.productName,
                  }}
                />
              }
              description={t("onboarding.screens.selectUseCase.options.1.description")}
              Illu={<NanoBox />}
              onClick={() => sendEvent("OPEN_PEDAGOGY_MODAL")}
            />
          </RightColumn>
        </Row>
        <Separator label={t("onboarding.screens.selectUseCase.separator")} />
        <Row>
          <LeftColumn>
            <Text color="palette.text.shade100" ff="Inter|SemiBold" fontSize="32px">
              {t("onboarding.screens.selectUseCase.hasRecovery")}
            </Text>
          </LeftColumn>
          <RightColumn>
            <UseCaseOption
              heading={t("onboarding.screens.selectUseCase.options.2.heading")}
              title={
                <Trans
                  i18nKey="onboarding.screens.selectUseCase.options.2.title"
                  values={{
                    deviceName: device.productName,
                  }}
                />
              }
              description={t("onboarding.screens.selectUseCase.options.2.description")}
              Illu={<DeviceConnect />}
              onClick={() => sendEvent("CONNECT_SETUP_DEVICE")}
            />
            <UseCaseOption
              heading={t("onboarding.screens.selectUseCase.options.3.heading")}
              title={t("onboarding.screens.selectUseCase.options.3.title")}
              description={
                <Trans
                  i18nKey="onboarding.screens.selectUseCase.options.3.description"
                  values={{
                    deviceName: device.productName,
                  }}
                />
              }
              Illu={<ImportRecovery />}
              onClick={() => sendEvent("USE_RECOVERY_PHRASE")}
            />
          </RightColumn>
        </Row>
      </SelectUseCaseContainer>
    </ScrollArea>
  );
}
