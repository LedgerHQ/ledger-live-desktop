// @flow

import React, { useCallback, useContext } from "react";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ProgressBar from "~/renderer/components/ProductTour/ProgressBar";
import TrackPage from "~/renderer/analytics/TrackPage";
import Button from "~/renderer/components/Button";
import Pill from "~/renderer/components/ProductTour/Pill";
import IconChevronRight from "~/renderer/icons/ChevronRight";

import InstallCrypto from "~/renderer/components/ProductTour/Dashboard/cards/InstallCrypto";
import CreateAccount from "~/renderer/components/ProductTour/Dashboard/cards/CreateAccount";
import BuyCoins from "~/renderer/components/ProductTour/Dashboard/cards/BuyCoins";
import ReceiveCoins from "~/renderer/components/ProductTour/Dashboard/cards/ReceiveCoins";
import SendCoins from "~/renderer/components/ProductTour/Dashboard/cards/SendCoins";
import SwapCoins from "~/renderer/components/ProductTour/Dashboard/cards/SwapCoins";
import CustomizeApp from "~/renderer/components/ProductTour/Dashboard/cards/CustomizeApp";

const Wrapper = styled(Box)`
  flex: 1;
  padding: 32px 100px;
  display: grid;
  grid-gap: 18px;
  grid-template-columns: repeat(auto-fill, minmax(128px, 128px));
`;

const Hero = styled(Box)`
  color: "white";
  padding: 32px 100px;
  background-color: ${p => p.theme.colors.palette.primary.main};
`;

const Dashboard = () => {
  const { state, send } = useContext(ProductTourContext);
  const {
    context: { completedFlows, totalFlows },
  } = state;
  const progress = Math.round((completedFlows.length / totalFlows) * 100);
  const completed = completedFlows.length === totalFlows;
  const c = completedFlows?.length || 0;
  const heroKey = c < 2 ? "beginner" : c < 4 ? "insider" : "master";
  const onCompleteTour = useCallback(() => {
    send("BACK");
  }, [send]);

  return (
    <>
      <TrackPage category="ProductTour" name="Dashboard" />
      <Hero>
        <Text mt={1} mb={completed ? 0 : 3} ff="Inter|SemiBold" color="white" fontSize={28}>
          <Trans
            i18nKey={completed ? "productTour.hero.completed" : `productTour.hero.${heroKey}`}
          />
        </Text>
        <Box horizontal alignItems={"center"}>
          <ProgressBar withDividers width={400} progress={progress} />
          {completed ? (
            <Button ml={5} primary inverted event={"completeProductTour"} onClick={onCompleteTour}>
              <Box alignItems="center" horizontal>
                <Text mr={2}>
                  <Trans i18nKey={"productTour.completeTour"} />
                </Text>
                <IconChevronRight size={13} />
              </Box>
            </Button>
          ) : null}
        </Box>
        <Box horizontal mt={completed ? 0 : 3}>
          <Pill />
        </Box>
      </Hero>
      <Wrapper horizontal>
        <InstallCrypto />
        <CreateAccount />
        <BuyCoins />
        <ReceiveCoins />
        <SendCoins />
        <SwapCoins />
        <CustomizeApp />
      </Wrapper>
    </>
  );
};

export default Dashboard;
