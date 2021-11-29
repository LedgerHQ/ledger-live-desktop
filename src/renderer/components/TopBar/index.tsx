import React, { useCallback, useRef, useState } from "react";

import { Flex, Header, Button, Icons, Tooltip } from "@ledgerhq/react-ui";
import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import { discreetModeSelector } from "~/renderer/reducers/settings";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";

import { lock } from "~/renderer/actions/application";
import { openModal } from "~/renderer/actions/modals";
import { hasPasswordSelector } from "~/renderer/reducers/application";
import { hasAccountsSelector } from "~/renderer/reducers/accounts";
import { setDiscreetMode } from "~/renderer/actions/settings";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { informationCenterStateSelector } from "~/renderer/reducers/UI";
import { openInformationCenter, closeInformationCenter } from "~/renderer/actions/UI";

import HelpSideBar from "~/renderer/modals/Help";
import Breadcrumb from "./Breadcrumb";
import InformationDrawer from "./InformationDrawer";
import ActivityIndicator from "./ActivityIndicator";

const VerticalDivider = styled.span`
  height: ${p => p.theme.space[3]}px;
  border-left: 1px solid ${p => p.theme.colors.palette.neutral.c40};
`;

const TopBarMenu: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const hasPassword = useSelector(hasPasswordSelector);
  const hasAccounts = useSelector(hasAccountsSelector);
  const discreetMode = useSelector(discreetModeSelector);
  const { isOpen: isInformationCenterOpen } = useSelector(informationCenterStateSelector);
  const [helpSideBarVisible, setHelpSideBarVisible] = useState(false);

  const openInfoCenter = useCallback(() => dispatch(openInformationCenter()), [dispatch]);
  const closeInfoCenter = useCallback(() => dispatch(closeInformationCenter()), [dispatch]);

  const lockLedgerLive = useCallback(() => dispatch(lock()), [dispatch]);

  const toggleDiscreetMode = useCallback(() => dispatch(setDiscreetMode(!discreetMode)), [
    discreetMode,
    dispatch,
  ]);

  const openHelpSidebar = useCallback(() => setHelpSideBarVisible(true), [setHelpSideBarVisible]);
  const closeHelpSidebar = useCallback(() => setHelpSideBarVisible(false), [setHelpSideBarVisible]);

  const settingsClickTimes = useRef<number[]>([]);
  const navigateToSettings = useCallback(() => {
    const url = "/settings";

    const now = Date.now();
    settingsClickTimes.current = settingsClickTimes.current.filter(t => now - t < 3000).concat(now);
    if (settingsClickTimes.current.length === 7) {
      settingsClickTimes.current = [];
      dispatch(openModal("MODAL_DEBUG", null));
    }

    if (location.pathname !== url) {
      setTrackingSource("topbar");
      history.push({ pathname: url });
    }
  }, [history, location, dispatch]);

  return (
    <>
      <HelpSideBar isOpened={helpSideBarVisible} onClose={closeHelpSidebar} />
      <InformationDrawer isOpen={isInformationCenterOpen} onRequestClose={closeInfoCenter} />
      <Flex alignItems="center" px={5}>
        {hasAccounts && <ActivityIndicator />}
        <Tooltip content={t("settings.discreet")} placement="bottom">
          <Button
            onClick={toggleDiscreetMode}
            Icon={discreetMode ? Icons.EyeNoneRegular : Icons.EyeRegular}
          />
        </Tooltip>
        <Tooltip content={t("informationCenter.tooltip")} placement="bottom">
          <Button onClick={openInfoCenter} Icon={Icons.NotificationsMedium} />
        </Tooltip>
        {hasPassword && (
          <Tooltip content={t("common.lock")} placement="bottom">
            <Button onClick={lockLedgerLive} Icon={Icons.LockAltRegular} />
          </Tooltip>
        )}
        <Tooltip content={t("settings.title")} placement="bottom">
          <Button onClick={navigateToSettings} Icon={Icons.SettingsRegular} />
        </Tooltip>
        <VerticalDivider />
        <Tooltip content={t("settings.helpButton")} placement="bottom">
          <Button onClick={openHelpSidebar} Icon={Icons.LifeRingRegular} />
        </Tooltip>
      </Flex>
    </>
  );
};

const TopBar: React.FC = () => <Header right={<TopBarMenu />} left={<Breadcrumb />} />;

export default TopBar;
