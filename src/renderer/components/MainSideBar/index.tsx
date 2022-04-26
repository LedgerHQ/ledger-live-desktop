import React, { useCallback, useContext } from "react";
import { SideBar, Icons } from "@ledgerhq/react-ui";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { useHistory, useLocation } from "react-router-dom";
import {
  sidebarCollapsedSelector,
  lastSeenDeviceSelector,
  SettingsState,
} from "~/renderer/reducers/settings";
import { setFirstTimeLend, setSidebarCollapsed } from "~/renderer/actions/settings";
import { openModal } from "~/renderer/actions/modals";
import { useManagerBlueDot } from "@ledgerhq/live-common/lib/manager/hooks";
import { hasLendEnabledAccountsSelector } from "~/renderer/reducers/accounts";
import useIsUpdateAvailable from "../Updater/useIsUpdateAvailable";
import { context as drawersContext } from "~/renderer/drawers/Provider";
import { ReceiveDrawer } from "~/renderer/drawers/ReceiveFlow";

const MainSideBar: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setDrawer } = useContext(drawersContext);

  const collapsed = useSelector(sidebarCollapsedSelector);
  const toggleCollapsed = useCallback(() => dispatch(setSidebarCollapsed(!collapsed)), [
    dispatch,
    collapsed,
  ]);

  const isUpdateAvailable = useIsUpdateAvailable();

  const displayManagerBlueDot = useManagerBlueDot(useSelector(lastSeenDeviceSelector));

  const push = useCallback(
    (pathname: string) => {
      if (location.pathname === pathname) return;
      setTrackingSource("sidebar");
      history.push({ pathname });
    },
    [history, location.pathname],
  );

  const navigateToDashboard = useCallback(() => {
    push("/");
  }, [push]);

  const navigateToAccounts = useCallback(() => {
    push("/accounts");
  }, [push]);

  const navigateToCatalog = useCallback(() => {
    push("/platform");
  }, [push]);

  const openSendModal = useCallback(() => {
    if (location.pathname === "/manager") {
      push("/accounts");
    }
    dispatch(openModal("MODAL_SEND", null));
  }, [dispatch, location.pathname, push]);

  const openReceiveDrawer = useCallback(() => {
    setDrawer(ReceiveDrawer, null, ReceiveDrawer.initialOptions);
  }, [setDrawer]);

  const navigateToExchange = useCallback(() => {
    push("/exchange");
  }, [push]);

  const navigateToSwap = useCallback(() => {
    push("/swap");
  }, [push]);

  const firstTimeLend = useSelector<{ settings: SettingsState }, boolean>(
    state => state.settings.firstTimeLend,
  );

  const navigateToLend = useCallback(() => {
    if (firstTimeLend) {
      dispatch(setFirstTimeLend());
    }
    push("/lend");
  }, [push, firstTimeLend, dispatch]);

  const navigateToManager = useCallback(() => {
    push("/manager");
  }, [push]);

  const lendingEnabled = useSelector(hasLendEnabledAccountsSelector);

  // TODO: still missing the starred accounts list and the experimental features indicator (not yet specified on Figma)
  return (
    <SideBar onToggle={toggleCollapsed} isExpanded={!collapsed}>
      <SideBar.Item
        label={t("dashboard.title")}
        onClick={navigateToDashboard}
        isActive={location.pathname === "/"}
        displayNotificationBadge={isUpdateAvailable}
      >
        <Icons.PortfolioRegular size={20} />
      </SideBar.Item>
      <SideBar.Item
        label={t("sidebar.accounts")}
        onClick={navigateToAccounts}
        isActive={location.pathname === "/accounts"}
      >
        <Icons.WalletRegular size={20} />
      </SideBar.Item>
      <SideBar.Item
        label={t("sidebar.catalog")}
        onClick={navigateToCatalog}
        isActive={location.pathname.startsWith("/platform")}
      >
        <Icons.ManagerRegular size={20} />
      </SideBar.Item>
      <SideBar.Item label={t("send.title")} onClick={openSendModal}>
        <Icons.ArrowTopRegular />
      </SideBar.Item>
      <SideBar.Item label={t("receive.title")} onClick={openReceiveDrawer}>
        <Icons.ArrowBottomRegular size={20} />
      </SideBar.Item>
      <SideBar.Item
        label={t("sidebar.exchange")}
        onClick={navigateToExchange}
        isActive={location.pathname === "/exchange"}
      >
        <Icons.BuyCryptoAltRegular size={20} />
      </SideBar.Item>
      <SideBar.Item
        label={t("sidebar.swap")}
        onClick={navigateToSwap}
        isActive={location.pathname.startsWith("/swap")}
      >
        <Icons.BuyCryptoRegular size={20} />
      </SideBar.Item>
      {/* wrap in a fragment because the boolean is not assignable to JSX.Element by itself */}
      <>
        {lendingEnabled && (
          <SideBar.Item
            label={t("sidebar.lend")}
            onClick={navigateToLend}
            isActive={location.pathname === "/lend"}
            displayNotificationBadge={firstTimeLend}
          >
            <Icons.LendRegular size={20} />
          </SideBar.Item>
        )}
      </>
      <SideBar.Item
        label={t("sidebar.manager")}
        onClick={navigateToManager}
        isActive={location.pathname === "/manager"}
        displayNotificationBadge={displayManagerBlueDot}
      >
        <Icons.NanoFoldedRegular size={20} />
      </SideBar.Item>
    </SideBar>
  );
};

export default MainSideBar;
