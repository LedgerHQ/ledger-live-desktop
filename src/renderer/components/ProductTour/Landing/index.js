// @flow

import React, { useContext } from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import { Trans } from "react-i18next";
import IconChevronRight from "~/renderer/icons/ChevronRight";
import IconQuestion from "~/renderer/icons/Question";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import TrackPage from "~/renderer/analytics/TrackPage";

import install from "~/renderer/components/ProductTour/assets/install.png";
import createAccount from "~/renderer/components/ProductTour/assets/create.png";
import receive from "~/renderer/components/ProductTour/assets/receive.png";
import send from "~/renderer/components/ProductTour/assets/send.png";
import swap from "~/renderer/components/ProductTour/assets/swap.png";
import buy from "~/renderer/components/ProductTour/assets/buy.png";
import customize from "~/renderer/components/ProductTour/assets/customize.png";

import AnimatedWave from "~/renderer/components/ProductTour/AnimatedWave";

const Wrapper: ThemedComponent<{}> = styled(Box)`
  flex: 1;
  background-color: ${p => p.theme.colors.palette.primary.main};
  position: relative;
  align-items: center;
`;

const WaveWrapper: ThemedComponent<{}> = styled.div`
  position: absolute;
  left: 0;
  right: 0;
`;

const ContentWrapper: ThemedComponent<{}> = styled(Box)`
  flex: 1;
  max-width: 700px;
  z-index: 9;
  position: absolute;
`;

const Illustration = styled.img`
  object-fit: contain;
  margin: 50px 0;
  margin-bottom: 20px;
  height: 188px;
`;

const landingIllustrations = {
  install,
  createAccount,
  receive,
  send,
  buy,
  swap,
  customize,
};

const Landing = () => {
  const { state, send } = useContext(ProductTourContext);
  const { context } = state;
  const { activeFlow, learnMoreCallback } = context;

  return (
    <Wrapper color={"white"}>
      <TrackPage category="ProductTour" name="Landing" activeFlow={activeFlow} />
      <WaveWrapper>
        <AnimatedWave height={500} color={"#587ED4"} />
      </WaveWrapper>
      <ContentWrapper pb={40}>
        <Illustration src={landingIllustrations[activeFlow]} />
        <Text ff={"Inter|SemiBold"} fontSize={32} mt={6} mb={5}>
          <Trans i18nKey={`productTour.landing.${activeFlow}.hero`} />
        </Text>
        <Text ff={"Inter|Regular"} mb={5} fontSize={14}>
          <Trans i18nKey={`productTour.landing.${activeFlow}.title`} />
        </Text>
        <Text ff={"Inter|Regular"} fontSize={14} flow={1}>
          <Trans i18nKey={`productTour.landing.${activeFlow}.description`} />
        </Text>
        {learnMoreCallback ? (
          <Box
            horizontal
            mt={30}
            alignItems={"center"}
            onClick={learnMoreCallback}
            style={{ cursor: "pointer" }}
          >
            <Text ff={"Inter|SemiBold"} fontSize={13} mr={2}>
              <Trans i18nKey={`productTour.landing.${activeFlow}.learnMore`} />
            </Text>
            <IconQuestion size={16} />
          </Box>
        ) : null}
        <Box mt={30} flex={1} justifyContent={"flex-end"} alignSelf={"flex-end"}>
          <Button mt={3} primary inverted onClick={() => send("START_FLOW")}>
            <Box alignItems="center" horizontal>
              <Text mr={2}>
                <Trans i18nKey={`productTour.landing.cta`} />
              </Text>
              <IconChevronRight size={13} />
            </Box>
          </Button>
        </Box>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Landing;
