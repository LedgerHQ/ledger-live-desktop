// @flow

import React, { useCallback, useContext } from "react";
import WrappedCard from "~/renderer/components/Box/Card";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import Image from "~/renderer/components/Image";
import styled from "styled-components";
import IconLock from "~/renderer/icons/Lock";
import IconCheckFull from "~/renderer/icons/CheckFull";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import { useDispatch } from "react-redux";
import useTheme from "~/renderer/hooks/useTheme";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const StyledCard: ThemedComponent<{}> = styled(WrappedCard)`
  height: 172px;
  padding: 16px;
  color: "white";
  background-color: ${p =>
    p.completed ? p.theme.colors.identity : p.theme.colors.palette.primary.main};
  opacity: ${p => (p.disabled ? 0.4 : 1)};
  cursor: ${p => (p.disabled || p.completed ? "default" : "pointer")};
  position: relative;
  overflow: hidden;
  & ${Box}, & ${Text} {
    z-index: 2;
  }
`;

const StyledImage: ThemedComponent<{}> = styled(Image)`
  z-index: 1;
  max-width: 90px;
  position: absolute;
  right: 10px;
  bottom: -10px;
  mix-blend-mode: luminosity;
`;

const Card = ({
  require,
  appFlow,
  onBeforeFlow,
  onAfterFlow,
  title,
  titleCompleted,
  overrideContent,
  illustration,
  controlledModals,
  learnMoreCallback,
  ...params
}: {
  require?: string,
  appFlow: string,
  onBeforeFlow: () => void,
  onAfterFlow: () => void,
  title: React$Node,
  titleCompleted: React$Node,
  overrideContent?: boolean,
  illustration: *,
  controlledModals?: string[],
  learnMoreCallback?: () => void,
}) => {
  const { state, send } = useContext(ProductTourContext);
  const theme = useTheme();
  const dispatch = useDispatch();

  const {
    context: { completedFlows },
  } = state;
  const disabled = require && !completedFlows.includes(require);
  const completed = completedFlows.includes(appFlow);

  const onClick = useCallback(() => {
    // if (!disabled && !completed) {
    send("ENTER_FLOW", {
      appFlow,
      onBeforeFlow,
      onAfterFlow,
      overrideContent,
      controlledModals,
      learnMoreCallback,
    });
    // } else if (disabled) {
    //   dispatch(openModal("MODAL_PRODUCT_TOUR_UNAVAILABLE"));
    // }
  }, [
    appFlow,
    completed,
    controlledModals,
    disabled,
    dispatch,
    learnMoreCallback,
    onAfterFlow,
    onBeforeFlow,
    overrideContent,
    send,
  ]);

  return (
    <StyledCard {...params} disabled={disabled} completed={completed} onClick={onClick}>
      <StyledImage alt={appFlow} resource={illustration} />
      <Box color={"white"} horizontal alignItems={"center"}>
        {completed ? (
          <Box color={"white"} horizontal alignItems={"center"}>
            <IconCheckFull color="white" tickColor={theme.colors.identity} size={12} />
            <Text ff={"Inter|Bold"} ml={1} fontSize={2} style={{ textTransform: "uppercase" }}>
              <Trans i18nKey={"productTour.completed"} />
            </Text>
          </Box>
        ) : disabled ? (
          <IconLock size={12} color={"white"} />
        ) : (
          <div style={{ height: 14 }} />
        )}
      </Box>
      <Text mt={3} ff={"Inter|SemiBold"} fontSize={16} color={"white"}>
        {completed ? titleCompleted : title}
      </Text>
    </StyledCard>
  );
};

export default Card;
