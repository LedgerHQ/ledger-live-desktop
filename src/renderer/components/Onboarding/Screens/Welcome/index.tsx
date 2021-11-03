import React, { useCallback, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import { openURL } from "~/renderer/linking";
import LangSwitcher from "~/renderer/components/Onboarding/LangSwitcher";
import Carousel from "~/renderer/components/Onboarding/Screens/Welcome/Carousel";
import { urls } from "~/config/urls";
import { Log, Text, Button, Icons } from "@ledgerhq/react-ui";

import accessCrypto from "./assets/access-crypto.svg";
import ownPrivateKey from "./assets/own-private-key.svg";
import setupNano from "./assets/setup-nano.svg";
import stayOffline from "./assets/stay-offline.svg";
import validateTransactions from "./assets/validate-transactions.svg";

import { registerAssets } from "~/renderer/components/Onboarding/preloadAssets";

const stepLogos = [accessCrypto, ownPrivateKey, stayOffline, validateTransactions, setupNano]
registerAssets(stepLogos);

const WelcomeContainer: ThemedComponent<any> = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const LeftContainer: ThemedComponent<any> = styled.div`
  width: 386px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
`;

const LedgerTitle = styled(Log)`
  width: 170px;
  margin-bottom: 40px;
  font-size: 16px;
`;

const Presentation = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductHighlight = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
`;

const NoDevice = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const RightContainer: ThemedComponent<any> = styled.div`
  height: 100%;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
  background-color:  ${p => p.theme.colors.palette.primary.c60};
`;

const CarouselTopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 40px;
  width: 100%;
`;

type Props = {
  sendEvent: (event: string) => void;
  onboardingRelaunched: boolean;
};

export function Welcome({ sendEvent, onboardingRelaunched }: Props) {
  const {t} = useTranslation();

  const handleNext = useCallback(() => {
    sendEvent("NEXT");
  }, [sendEvent]);

  const buyNanoX = useCallback(() => {
    openURL(urls.noDevice.buyNew);
  }, []);

  const steps = stepLogos.map( (logo, index) => ({
    image: logo,
    title: t(`v3.onboarding.screens.welcome.steps.${index}.title`),
    description: t(`v3.onboarding.screens.welcome.steps.${index}.desc`),
    isLast: index === stepLogos.length - 1
  }))

  return (
    <WelcomeContainer>
      <LeftContainer>
        <Presentation>
          <LedgerTitle rowGap={5}>ledger-live</LedgerTitle>
          <Text type="h1" ff="Alpha|Medium" pb={"20px"}>{t("v3.onboarding.screens.welcome.title")}</Text>
          <Text type="body" ff="Inter|Medium" fontSize={14}>{t("v3.onboarding.screens.welcome.description")}</Text>
        </Presentation>
        <ProductHighlight>
          <Button 
            iconPosition="right"
            Icon={Icons.ArrowRightMedium}
            type="main" 
            onClick={handleNext}
            mb={24}
          >
            {t("v3.onboarding.screens.welcome.nextButton")}
          </Button>
          <NoDevice>
            <Text>{t("v3.onboarding.screens.welcome.noDevice")}</Text>
            <Text onClick={buyNanoX}>{t("v3.onboarding.screens.welcome.buyLink")}</Text>
          </NoDevice>
        </ProductHighlight>
      </LeftContainer>
      <RightContainer>
        <CarouselTopBar>
          <LangSwitcher />
        </CarouselTopBar>
        <Carousel
          queue={steps}
        />
      </RightContainer>
    </WelcomeContainer>
  );
}
