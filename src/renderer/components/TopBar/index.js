// @flow

import React, { useState, useCallback, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

import { lock } from "~/renderer/actions/application";
import { openModal } from "~/renderer/actions/modals";
import { discreetModeSelector } from "~/renderer/reducers/settings";
import { hasAccountsSelector } from "~/renderer/reducers/accounts";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "~/renderer/components/Box";
import Tooltip from "~/renderer/components/Tooltip";
import Breadcrumb from "~/renderer/components/Breadcrumb";
import HelpSideBar from "~/renderer/modals/Help";
import ProductTourContext from "~/renderer/components/ProductTour/ProductTourContext";
import IconLock from "~/renderer/icons/Lock";
import IconEye from "~/renderer/icons/Eye";
import IconHelp from "~/renderer/icons/Question";
import IconEyeOff from "~/renderer/icons/EyeOff";
import IconSettings from "~/renderer/icons/Settings";
import IconArrowLeft from "~/renderer/icons/ArrowLeft";

// TODO: ActivityIndicator
import ActivityIndicator from "./ActivityIndicator";
import ItemContainer from "./ItemContainer";
import { setDiscreetMode } from "~/renderer/actions/settings";
import { hasPasswordSelector } from "~/renderer/reducers/application";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({}))`
  height: ${p => p.theme.sizes.topBarHeight}px;
  box-sizing: content-box;
  background-color: transparent;
  ${p => !p.productTourState.matches("idle") && `color:white;`}
`;

const Inner = styled(Box).attrs(() => ({
  horizontal: true,
  grow: true,
  flow: 4,
  alignItems: "center",
  px: 6,
}))`
  height: ${p => p.theme.sizes.topBarHeight}px;
  ${p =>
    p.productTourState.matches("flow.landing")
      ? `background-color:#587ED4;`
      : p.productTourState.matches("dashboard")
      ? `background-color:${p.theme.colors.palette.primary.main};`
      : ""}
  &:empty {
    display: none;
  }
`;

const Bar = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  height: 15px;
  width: 1px;
  background: ${p => p.theme.colors.palette.divider};
`;

const MaybeStyledBox = styled(Box)`
  ${p => (p.inProductTour ? "opacity: 0.5;" : "")}
  ${p => (p.inProductTour ? "pointer-events: none;" : "")}
`;

export const SeparatorBar: ThemedComponent<{}> = styled.div`
  height: 1px;
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  width: calc(100% - ${p => p.theme.space[6] * 2}px);
  left: ${p => p.theme.space[6]};
  position: relative;
`;

const TopBar = () => {
  const settingsClickTimes = useRef([]);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const hasPassword = useSelector(hasPasswordSelector);
  const hasAccounts = useSelector(hasAccountsSelector);
  const discreetMode = useSelector(discreetModeSelector);

  const [helpSideBarVisible, setHelpSideBarVisible] = useState(false);

  const handleLock = useCallback(() => dispatch(lock()), [dispatch]);
  const handleDiscreet = useCallback(() => dispatch(setDiscreetMode(!discreetMode)), [
    discreetMode,
    dispatch,
  ]);
  const navigateToSettings = useCallback(() => {
    const url = "/settings";

    const now = Date.now();
    settingsClickTimes.current = settingsClickTimes.current.filter(t => now - t < 3000).concat(now);
    if (settingsClickTimes.current.length === 7) {
      settingsClickTimes.current = [];
      dispatch(openModal("MODAL_DEBUG"));
    }

    if (location.pathname !== url) {
      history.push({ pathname: url, state: { source: "topbar" } });
    }
  }, [history, location, dispatch]);

  const { state: productTourState, send } = useContext(ProductTourContext);
  const { context } = productTourState;
  const maybeProductTourMessage =
    productTourState.matches({ flow: "ongoing" }) &&
    t(`productTour.flows.${context.activeFlow}.ongoing`);

  return (
    <Container
      doubleHeight={maybeProductTourMessage}
      productTourState={productTourState}
      color="palette.text.shade80"
    >
      <Inner productTourState={productTourState} bg={"palette.background.default"}>
        <Box grow horizontal justifyContent="space-between">
          {productTourState.matches("flow.landing") || productTourState.matches("dashboard") ? (
            <Box
              justifyContent={"center"}
              onClick={() => {
                send("BACK");
                history.push("/");
              }}
            >
              <IconArrowLeft size={24} />
            </Box>
          ) : null}
          <Breadcrumb />
          <MaybeStyledBox horizontal inProductTour={!productTourState.matches("idle")}>
            {hasAccounts && (
              <>
                <ActivityIndicator />
                <Box justifyContent="center">
                  <Bar />
                </Box>
              </>
            )}
            <Tooltip content={t("settings.discreet")} placement="bottom">
              <ItemContainer isInteractive onClick={handleDiscreet}>
                {discreetMode ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </ItemContainer>
            </Tooltip>
            <Box justifyContent="center">
              <Bar />
            </Box>
            <Tooltip content={t("settings.helpButton")} placement="bottom">
              <ItemContainer
                id="topbar-help-button"
                isInteractive
                onClick={() => setHelpSideBarVisible(true)}
              >
                <IconHelp size={16} />
              </ItemContainer>
            </Tooltip>
            <HelpSideBar
              isOpened={helpSideBarVisible}
              onClose={() => setHelpSideBarVisible(false)}
            />
            {hasPassword && (
              <>
                <Box justifyContent="center">
                  <Bar />
                </Box>
                <Tooltip content={t("common.lock")}>
                  <ItemContainer
                    id="topbar-password-lock-button"
                    isInteractive
                    justifyContent="center"
                    onClick={handleLock}
                  >
                    <IconLock size={16} />
                  </ItemContainer>
                </Tooltip>
              </>
            )}
            <Box justifyContent="center">
              <Bar />
            </Box>
            <Tooltip content={t("settings.title")} placement="bottom">
              <ItemContainer id="topbar-settings-button" isInteractive onClick={navigateToSettings}>
                <IconSettings size={16} />
              </ItemContainer>
            </Tooltip>
          </MaybeStyledBox>
        </Box>
      </Inner>
    </Container>
  );
};

export default TopBar;
