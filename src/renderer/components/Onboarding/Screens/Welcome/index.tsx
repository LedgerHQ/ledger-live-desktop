import React, { useCallback, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import Image from "~/renderer/components/Image";
import { openURL } from "~/renderer/linking";
import LangSwitcher from "~/renderer/components/Onboarding/LangSwitcher";
import Carroussel from "~/renderer/components/Onboarding/Screens/Welcome/Carroussel";
import { urls } from "~/config/urls";
import useTheme from "~/renderer/hooks/useTheme";
import { Log, Text, Button } from "@ledgerhq/react-ui";

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

const LedgerTitle = styled.Log`
  width: 115px;
  margin-bottom: 40px;
`;

const Presentation = styled.div`

`;

const ProductHighlight = styled.div`

`;


const RightContainer: ThemedComponent<any> = styled.div`
  height: 100%;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
  background-color:  ${p => p.theme.colors.palette.primary.c60};
`;

const CarrousselTopBar = styled.div`
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

  const [carrousselIndex, changeCarrousselIndex] = useState(0);

  const handleNext = useCallback(() => {
    sendEvent("NEXT");
  }, [sendEvent]);

  const buyNanoX = useCallback(() => {
    openURL(urls.noDevice.buyNew);
  }, []);

  const steps = stepLogos.map( (logo, index) => ({
    logo,
    titleKey: `v3.onboarding.screens.welcome.steps.${index}.title`,
    descKey: `v3.onboarding.screens.welcome.steps.${index}.desc`,
    isLast: index === stepLogos.length - 1
  }))

  return (
    <WelcomeContainer>
      <LeftContainer>
        <Presentation>
          <LedgerTitle>Ledger-LIVE</LedgerTitle>
          <Text type="h1">{t("v3.onboarding.screens.welcome.title")}</Text>
          <Text type="body">{t("v3.onboarding.screens.welcome.description")}</Text>
        </Presentation>
        <ProductHighlight>
          <Button type="main" onClick={handleNext}>{t("v3.onboarding.screens.welcome.nextButton")}</Button>
          <Text>{t("v3.onboarding.screens.welcome.cta")} {t("v3.onboarding.screens.welcome.noDevice")}</Text>
        </ProductHighlight>
      </LeftContainer>
      <RightContainer>
        <CarrousselTopBar>
          <LangSwitcher />
        </CarrousselTopBar>
        <Carroussel
          onChange={changeCarrousselIndex}
          currentIndex={carrousselIndex}
          steps={steps}
        />
      </RightContainer>
    </WelcomeContainer>
  );
}
