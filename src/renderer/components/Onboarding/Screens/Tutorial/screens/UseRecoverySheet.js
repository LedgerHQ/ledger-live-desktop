// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import ArrowLeft from "~/renderer/icons/ArrowLeft";
import ChevronRight from "~/renderer/icons/ChevronRight";
import InfoCircle from "~/renderer/icons/InfoCircle";
import { ContentContainer, HeaderContainer, Illustration } from "../shared";
import recoverySheet from "~/renderer/components/Onboarding/Screens/Tutorial/assets/recoverySheet.svg";

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

const StepIndexContainer = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(138, 128, 219, 0.1);
  color: #8a80db;
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StepTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  flex: 1;
`;

const DescText = styled(Text).attrs(() => ({
  mt: "8px",
  color: "palette.text.shade100",
  ff: "Inter|Regular",
  fontSize: "13px",
  lineHeight: "19.5px",
}))`
  white-space: pre-line;
`;

type StepProps = {
  title: string,
  descr?: string,
  index: number,
};

function Step({ title, descr, index }: StepProps) {
  return (
    <StepContainer>
      <StepIndexContainer>
        <Text ff="Inter|Bold" fontSize="10px" lineHeight="12.1px">
          {index}
        </Text>
      </StepIndexContainer>
      <StepTextContainer>
        <Text
          color="palette.text.shade100"
          ff="Inter|SemiBold"
          fontSize="16px"
          lineHeight="19.36px"
        >
          {title}
        </Text>
        {descr ? <DescText>{descr}</DescText> : null}
      </StepTextContainer>
    </StepContainer>
  );
}

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  & > * {
    margin: 12px 0px;
  }

  & > :first-child {
    margin-top: 0px;
  }

  & > :last-child {
    margin-bottom: 0px;
  }
`;

const steps = [
  {
    titleKey: "onboarding.screens.tutorial.screens.useRecoverySheet.takeYourRecoverySheet.title",
    descrKey: "onboarding.screens.tutorial.screens.useRecoverySheet.takeYourRecoverySheet.descr",
  },
  {
    titleKey: "onboarding.screens.tutorial.screens.useRecoverySheet.writeDownWords.title",
    descrKey: "onboarding.screens.tutorial.screens.useRecoverySheet.writeDownWords.descr",
  },
];

type Props = {
  sendEvent: (string, *) => void,
};

export function UseRecoverySheet({ sendEvent }: Props) {
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <ContentContainer>
        <HeaderContainer>
          <Button color="palette.primary.main" onClick={() => sendEvent("HELP")}>
            <Text mr="8px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
              {t("onboarding.screens.tutorial.screens.useRecoverySheet.buttons.help")}
            </Text>
            <InfoCircle size={22} />
          </Button>
        </HeaderContainer>
        <Illustration src={recoverySheet} height={246} width={220} />
        <StepList>
          {steps.map(({ titleKey, descrKey }, index) => (
            <Step
              key={index}
              title={t(titleKey)}
              descr={descrKey ? t(descrKey) : undefined}
              index={index + 1}
            />
          ))}
        </StepList>
      </ContentContainer>
      <ContentFooter>
        <Button color="palette.text.shade30" onClick={() => sendEvent("PREV")}>
          <ArrowLeft />
          <Text ml="9px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.useRecoverySheet.buttons.prev")}
          </Text>
        </Button>
        <Button data-test-id="use-recovery-sheet" primary onClick={() => sendEvent("NEXT")}>
          <Text mr="12px" ff="Inter|Bold" fontSize="12px" lineHeight="18px">
            {t("onboarding.screens.tutorial.screens.useRecoverySheet.buttons.next")}
          </Text>
          <ChevronRight size={13} />
        </Button>
      </ContentFooter>
    </ScreenContainer>
  );
}
