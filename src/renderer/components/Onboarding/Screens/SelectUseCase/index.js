// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { openModal } from "~/renderer/actions/modals";
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

import { registerAssets } from "~/renderer/components/Onboarding/preloadAssets";

import { track } from "~/renderer/analytics/segment";

registerAssets([deviceConnect, importRecovery, nanoBox]);

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
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

const LeftText = styled(Text).attrs(() => ({
  color: "palette.text.shade100",
  ff: "Inter|SemiBold",
  fontSize: "32px",
  mb: 2,
}))`
  max-width: 225px;
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

export function SelectUseCase() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { deviceId } = useParams();
  const history = useHistory();
  const device = deviceById(deviceId);

  const onWrappedUseCase = useCallback(() => {
    dispatch(openModal("MODAL_RECOVERY_SEED_WARNING", { deviceId }));
  }, [deviceId, dispatch]);

  return (
    <ScrollArea withHint>
      <TopRightContainer>
        <Button small onClick={() => history.push("/select-device")}>
          {t("onboarding.screens.selectUseCase.switchDevice")}
        </Button>
      </TopRightContainer>
      <SelectUseCaseContainer>
        <Row>
          <LeftColumn>
            <Text mb="8px" color="palette.text.shade100" ff="Inter|SemiBold" fontSize="18px">
              {t("onboarding.screens.selectUseCase.greetings")}
            </Text>
            <LeftText>
              <Trans
                i18nKey="onboarding.screens.selectUseCase.hasNoRecovery"
                values={{
                  deviceName: device.productName,
                }}
              />
            </LeftText>
          </LeftColumn>
          <RightColumn>
            <UseCaseOption
              dataTestId="onboarding-new-device"
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
              onClick={() => {
                track("Onboarding - Setup new");
                history.push(`/setup-device/${deviceId}`);
                // dispatch(openModal("MODAL_PEDAGOGY", { deviceId }));
              }}
            />
          </RightColumn>
        </Row>
        <Separator label={t("onboarding.screens.selectUseCase.separator")} />
        <Row>
          <LeftColumn>
            <LeftText>{t("onboarding.screens.selectUseCase.hasRecovery")}</LeftText>
          </LeftColumn>
          <RightColumn>
            <UseCaseOption
              dataTestId="onboarding-initialized-device"
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
              onClick={() => {
                track("Onboarding - Connect");
                history.push(`/connect-device/${deviceId}`);
                onWrappedUseCase();
              }}
            />
            <UseCaseOption
              dataTestId="onboarding-restore-device"
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
              onClick={() => {
                track("Onboarding - Restore");
                history.push("/use-recovery-phrase");
                onWrappedUseCase();
              }}
            />
          </RightColumn>
        </Row>
      </SelectUseCaseContainer>
    </ScrollArea>
  );
}
