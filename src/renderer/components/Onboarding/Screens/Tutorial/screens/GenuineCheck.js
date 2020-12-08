// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import { getEnv } from "@ledgerhq/live-common/lib/env";

import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
// import ChevronRight from "~/renderer/icons/ChevronRight";
import InfoCircle from "~/renderer/icons/InfoCircle";
import { ContentContainer, HeaderContainer } from "../shared";
import DeviceAction from "~/renderer/components/DeviceAction";

import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import { command } from "~/renderer/commands";

const connectManagerExec = command("connectManager");
const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectManagerExec);

const ScreenContainer: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding: 40px 80px;
  box-sizing: border-box;
`;

const ContentFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export function GenuineCheck({ sendEvent, context }) {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <ContentContainer style={{ flex: 1 }}>
        <HeaderContainer>
          <Button color="palette.primary.main" onClick={() => sendEvent("HELP")}>
            <Text mr="8px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
              {t("onboarding.screens.tutorial.screens.genuineCheck.buttons.help")}
            </Text>
            <InfoCircle size={22} />
          </Button>
        </HeaderContainer>
        <Content>
          <DeviceAction
            action={action}
            onResult={res => sendEvent("GENUINE_CHECK_SUCCESS")}
            request={null}
          />
        </Content>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.text.shade30" onClick={() => sendEvent("PREV")}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.genuineCheck.buttons.prev")}
          </Text>
        </Button>
        <Button primary onClick={() => sendEvent("NEXT")} disabled={!context.deviceIsGenuine}>
          <Text ff="Inter|Bold" fontSize={3} lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.genuineCheck.buttons.next")}
          </Text>
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
