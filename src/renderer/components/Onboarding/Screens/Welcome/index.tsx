import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { openURL } from "~/renderer/linking";
import LangSwitcher from "~/renderer/components/Onboarding/LangSwitcher";
import Carousel from "~/renderer/components/Onboarding/Screens/Welcome/Carousel";
import { urls } from "~/config/urls";
import { Text, Button, Logos, Icons } from "@ledgerhq/react-ui";

import accessCrypto from "./assets/access-crypto.svg";
import ownPrivateKey from "./assets/own-private-key.svg";
import setupNano from "./assets/setup-nano.svg";
import stayOffline from "./assets/stay-offline.svg";
import validateTransactions from "./assets/validate-transactions.svg";

import { registerAssets } from "~/renderer/components/Onboarding/preloadAssets";

import { relaunchOnboarding } from "~/renderer/actions/application";
import { onboardingRelaunchedSelector } from "~/renderer/reducers/application";

const stepLogos = [accessCrypto, ownPrivateKey, stayOffline, validateTransactions, setupNano];
registerAssets(stepLogos);

const StyledLink = styled(Text)`
  text-decoration: underline;
  cursor: pointer;
`;

const WelcomeContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const LeftContainer = styled.div`
  width: 386px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  z-index: 999;
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
  margin-top: 24px;
`;

const RightContainer = styled.div`
  height: 100%;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background-color: ${p => p.theme.colors.palette.primary.c60};
`;

const CarouselTopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 40px;
  width: 100%;
`;

const Description = styled(Text)`
  white-space: pre-line;
`;

type Props = {
  setOpenedTermsModal: (isOpened: boolean) => void;
};

export function Welcome({ setOpenedTermsModal }: Props) {
  const onboardingOrigin = useSelector(onboardingRelaunchedSelector) ? "/settings/help" : undefined;
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const buyNanoX = useCallback(() => {
    openURL(urls.noDevice.buyNew);
  }, []);

  const steps = stepLogos.map((logo, index) => ({
    image: logo,
    title: t(`v3.onboarding.screens.welcome.steps.${index}.title`),
    description: t(`v3.onboarding.screens.welcome.steps.${index}.desc`),
    isLast: index === stepLogos.length - 1,
  }));

  const handlePrevious = useCallback(() => {
    if (onboardingOrigin) {
      history.push(onboardingOrigin);
      dispatch(relaunchOnboarding(false));
    }
  }, [history, onboardingOrigin, dispatch]);

  return (
    <WelcomeContainer>
      <LeftContainer>
        <Presentation>
          <Logos.LedgerLiveRegular />
          <Text variant="h1" ff="Alpha|Medium" pt={"32px"} pb={"20px"}>
            {t("v3.onboarding.screens.welcome.title")}
          </Text>
          <Description variant="body" ff="Inter|Medium" fontSize={14}>
            {t("v3.onboarding.screens.welcome.description")}
          </Description>
        </Presentation>
        <ProductHighlight>
          <Button
            data-testid="onboarding-get-started-button"
            iconPosition="right"
            Icon={Icons.ArrowRightMedium}
            variant="main"
            onClick={() => setOpenedTermsModal(true)}
          >
            {t("v3.onboarding.screens.welcome.nextButton")}
          </Button>
          <NoDevice>
            <Text marginRight={2}>{t("v3.onboarding.screens.welcome.noDevice")}</Text>
            <StyledLink onClick={buyNanoX}>{t("v3.onboarding.screens.welcome.buyLink")}</StyledLink>
          </NoDevice>
        </ProductHighlight>
      </LeftContainer>
      <RightContainer>
        <CarouselTopBar>
          {!!onboardingOrigin && (
            <Button small onClick={handlePrevious}>
              {t("common.previous")}
            </Button>
          )}
          <LangSwitcher />
        </CarouselTopBar>
        <Carousel queue={steps} />
      </RightContainer>
    </WelcomeContainer>
  );
}
