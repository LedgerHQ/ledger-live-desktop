// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { openModal } from "~/renderer/actions/modals";
import { useTranslation, Trans } from "react-i18next";
import { Text } from "@ledgerhq/react-ui";
import styled from "styled-components";
import { UseCaseOption } from "./UseCaseOption";
import { ScrollArea } from "~/renderer/components/Onboarding/ScrollArea";
import { Separator } from "./Separator";
import placeholderOption from "./assets/placeholderOption.svg";
import { deviceById } from "~/renderer/components/Onboarding/Screens/SelectDevice/devices";

import { registerAssets } from "~/renderer/components/Onboarding/preloadAssets";
import OnboardingNavHeader from "../../OnboardingNavHeader.v3";

import { track } from "~/renderer/analytics/segment";

registerAssets([placeholderOption]);

const SelectUseCaseContainer = styled.div`
  width: 100%;
  padding: 134px 0px;
  display: flex;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
`;

const PlaceholderIllu = styled.div`
  background: url(${() => placeholderOption}) no-repeat center;
  width: 200px;
  height: 200px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 160.5px;
  width: 100%;
`;

const LeftColumn = styled.div`
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

const LeftText = styled(Text).attrs(() => ({
  ff: "Alpha|Medium",
  type: "h3",
  fontSize: "28px",
  uppercase: true,
}))`
  color: ${p => p.theme.colors.palette.neutral.c100};
  max-width: 382px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
    margin: 10px 0px;
  }

  & > :first-child {
    margin-top: 0px;
  }

  & > :last-child {
    margin-bottom: 0px;
  }
`;

interface Props {
  sendEvent: (arg1: string) => any;
  context: {
    deviceId: string;
  };
}

export function SelectUseCase({ sendEvent, context }: Props) {
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
      <OnboardingNavHeader onClickPrevious={() => history.push("/select-device")} />
      <SelectUseCaseContainer>
        <Row>
          <LeftColumn>
            <LeftText>
              <Trans
                i18nKey="v3.onboarding.screens.selectUseCase.hasNoRecovery"
                values={{
                  deviceName: device.productName,
                }}
              />
            </LeftText>
          </LeftColumn>
          <RightColumn>
            <UseCaseOption
              id="first-use"
              title={
                <Trans
                  i18nKey="v3.onboarding.screens.selectUseCase.options.1.title"
                  values={{
                    deviceName: device.productName,
                  }}
                />
              }
              description={t("v3.onboarding.screens.selectUseCase.options.1.description")}
              Illu={<PlaceholderIllu />}
              onClick={() => {
                track("Onboarding - Setup new");
                history.push(`/setup-device/${deviceId}`);
                // dispatch(openModal("MODAL_PEDAGOGY", { deviceId }));
              }}
            />
          </RightColumn>
        </Row>
        <Separator label={t("v3.onboarding.screens.selectUseCase.separator")} />
        <Row>
          <LeftColumn>
            <LeftText>{t("v3.onboarding.screens.selectUseCase.hasRecovery")}</LeftText>
          </LeftColumn>
          <RightColumn>
            <UseCaseOption
              id="initialized-device"
              title={
                <Trans
                  i18nKey="v3.onboarding.screens.selectUseCase.options.2.title"
                  values={{
                    deviceName: device.productName,
                  }}
                />
              }
              description={t("v3.onboarding.screens.selectUseCase.options.2.description")}
              Illu={<PlaceholderIllu />}
              onClick={() => {
                track("Onboarding - Connect");
                history.push(`/connect-device/${deviceId}`);
                onWrappedUseCase();
              }}
            />
            <UseCaseOption
              id="restore-device"
              title={t("v3.onboarding.screens.selectUseCase.options.3.title")}
              description={
                <Trans
                  i18nKey="v3.onboarding.screens.selectUseCase.options.3.description"
                  values={{
                    deviceName: device.productName,
                  }}
                />
              }
              Illu={<PlaceholderIllu />}
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
