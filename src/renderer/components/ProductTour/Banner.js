// @flow

import React, { useState, useCallback, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setHasCompletedProductTour } from "~/renderer/actions/settings";
import { hasCompletedProductTourSelector } from "~/renderer/reducers/settings";
import ProductTourContext from "./ProductTourContext";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import ProgressBar from "~/renderer/components/ProductTour/ProgressBar";
import Pill from "~/renderer/components/ProductTour/Pill";
import styled from "styled-components";
import { Trans } from "react-i18next";
import banner from "~/renderer/components/ProductTour/assets/banner.png";
import IconChevronRight from "~/renderer/icons/ChevronRight";
import IconCross from "~/renderer/icons/Cross";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Wrapper: ThemedComponent<{}> = styled(Card)`
  color: "white";
  background-color: ${p => p.theme.colors.palette.primary.main};
  position: relative;
  margin-top: ${p => (p.withProgress ? 10 : 40)}px;
`;

const Illustration = styled.img.attrs({ src: banner })`
  width: 290px;
  margin-top: -40px;
  pointer-events: none;
`;

const Close = styled.div`
  position: absolute;
  color: white;
  top: 16px;
  right: 16px;
  cursor: pointer;
  opacity: 0.6;
  &:hover {
    opacity: 0.4;
  }
`;

const Disclaimer: ThemedComponent<{}> = styled(Card)`
  padding: 40px;
  height: ${p => (p.withProgress ? 155 : 175)}px;
  margin-top: ${p => (p.withProgress ? 10 : 40)}px;
  background: ${p => p.theme.colors.palette.background.paper};
  text-align: center;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const Banner = () => {
  const { state, send } = useContext(ProductTourContext);
  const {
    context: { completedFlows, totalFlows },
  } = state;
  const progress = Math.round((completedFlows.length / totalFlows) * 100);
  const remainingSteps = totalFlows - completedFlows.length;
  const dispatch = useDispatch();
  const hasCompletedProductTour = useSelector(hasCompletedProductTourSelector);

  const [wantToDismiss, setWantToDismiss] = useState(false);
  const onDismiss = useCallback(() => {
    setWantToDismiss(true);
  }, []);
  const onUndo = useCallback(() => {
    setWantToDismiss(false);
  }, []);
  const onClose = useCallback(() => dispatch(setHasCompletedProductTour(true)), [dispatch]);

  return hasCompletedProductTour ? null : state.matches("idle") && remainingSteps ? (
    wantToDismiss ? (
      <Disclaimer withProgress={completedFlows.length}>
        <Text ff="Inter|Regular" fontSize={4} color="palette.text.shade80">
          <Trans i18nKey="productTour.dismiss.disclaimer" />
        </Text>
        <Box horizontal mt={3}>
          <Button mr={1} small primary onClick={onClose}>
            <Trans i18nKey="productTour.dismiss.close" />
          </Button>
          <Button ml={1} small secondary outlineGrey onClick={onUndo}>
            <Trans i18nKey="productTour.dismiss.undo" />
          </Button>
        </Box>
      </Disclaimer>
    ) : (
      <Wrapper horizontal withProgress={completedFlows.length}>
        <Close onClick={onDismiss}>
          <IconCross size={16} />
        </Close>
        {progress ? (
          <Box px={24} py={29} flex={1} justifyContent={"space-between"} horizontal>
            <Box flex={1}>
              <Text
                ff="Inter|Bold"
                color="white"
                fontSize={2}
                style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
              >
                <Trans i18nKey={"productTour.banner.productTour"} />
              </Text>
              <Text mt={1} mb={3} ff="Inter|SemiBold" color="white" fontSize={28}>
                <Trans i18nKey={"productTour.banner.progress"} values={{ remainingSteps }} />
              </Text>
              <Box horizontal alignItems="center">
                <Pill />
                <Box ml={3}>
                  <ProgressBar withDividers width={300} progress={progress} />
                </Box>
              </Box>
            </Box>
            <Box mt={3} justifyContent={"center"}>
              <Button
                primary
                inverted
                event={"startProductTourFromBanner"}
                onClick={() => send("ENTER_DASHBOARD")}
              >
                <Box alignItems="center" horizontal>
                  <Text mr={2}>{"Continue"}</Text>
                  <IconChevronRight size={13} />
                </Box>
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Box px={24} py={29} flex={1}>
              <Text
                ff="Inter|Bold"
                color="white"
                fontSize={2}
                style={{ textTransform: "uppercase" }}
              >
                <Trans i18nKey={"productTour.banner.welcome"} />
              </Text>
              <Text mt={1} ff="Inter|SemiBold" color="white" fontSize={28}>
                <Trans i18nKey={"productTour.banner.ready"} />
              </Text>
              <Box mt={3} alignItems={"flex-start"}>
                <Button
                  primary
                  inverted
                  event={"enterProductTourFromBanner"}
                  onClick={() => send("ENTER_DASHBOARD")}
                >
                  <Box alignItems="center" horizontal>
                    <Text mr={2}>
                      <Trans i18nKey={"productTour.banner.cta"} />
                    </Text>
                    <IconChevronRight size={13} />
                  </Box>
                </Button>
              </Box>
            </Box>
            <Illustration />
          </>
        )}
      </Wrapper>
    )
  ) : null;
};

export default Banner;
