// @flow
import React, { useState, memo, useCallback, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Trans } from "react-i18next";

import { useAppsSections } from "@ledgerhq/live-common/lib/apps/react";

import type { TFunction } from "react-i18next";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { State, Action, AppsDistribution } from "@ledgerhq/live-common/lib/apps/types";
import UpdateAllApps from "./UpdateAllApps";
import Placeholder from "./Placeholder";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Input from "~/renderer/components/Input";
import IconSearch from "~/renderer/icons/Search";
import TabBar from "~/renderer/components/TabBar";
import Item from "./Item";
import Filter from "./Filter";
import Sort from "./Sort";
import UninstallAllButton from "./UninstallAllButton";

import { openModal } from "~/renderer/actions/modals";

import debounce from "lodash/debounce";
import InstallSuccessBanner from "./InstallSuccessBanner";

// sticky top bar with extra width to cover card boxshadow underneath
const StickyTabBar = styled.div`
  position: sticky;
  background-color: ${p => p.theme.colors.palette.background.default};
  top: -${p => p.theme.space[3]}px;
  left: 0;
  right: 0;
  padding: ${p => p.theme.space[3]}px ${p => p.theme.space[3]}px 0 ${p => p.theme.space[3]}px;
  margin-left: -${p => p.theme.space[3]}px;
  height: ${p => p.theme.sizes.topBarHeight}px;
  width: 100%;
  box-sizing: content-box;
  z-index: 1;
`;

const FilterHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  margin: 0px;
  align-items: center;
  background-color: ${p => p.theme.colors.palette.background.paper};
  box-shadow: 0 1px 0 0 ${p => p.theme.colors.palette.text.shade10};
  border-radius: 4px 4px 0 0;
  position: sticky;
  top: ${p => (p.isIncomplete ? -p.theme.space[3] : p.theme.sizes.topBarHeight)}px;
  left: 0;
  right: 0;
  z-index: 1;
`;

type Props = {
  deviceInfo: DeviceInfo,
  state: State,
  dispatch: Action => void,
  isIncomplete: boolean,
  progress?: number,
  setAppInstallDep: (*) => void,
  setAppUninstallDep: (*) => void,
  t: TFunction,
  distribution: AppsDistribution,
};

const AppsList = ({
  deviceInfo,
  state,
  dispatch,
  isIncomplete,
  progress = {},
  setAppInstallDep,
  setAppUninstallDep,
  t,
  distribution,
}: Props) => {
  const { push } = useHistory();
  const { search } = useLocation();
  const reduxDispatch = useDispatch();

  const inputRef = useRef();
  const [query, setQuery] = useState("");
  const [appFilter, setFilter] = useState("all");
  const [sort, setSort] = useState({ type: "marketcap", order: "desc" });
  const [activeTab, setActiveTab] = useState(0);

  /** clear search field on tab change */
  useEffect(() => {
    if (inputRef && inputRef.current) inputRef.current.value = "";
    setQuery("");
  }, [activeTab]);
  const isDeviceTab = activeTab === 1;

  /** retrieve search query from router location search params */
  useEffect(() => {
    const params = new URLSearchParams(search);
    const q = params.get("q");

    if (inputRef && inputRef.current && q) {
      inputRef.current.value = q;
      inputRef.current.focus();
      setQuery(q);
    }
  }, [search]);

  const { installed: installedApps, uninstallQueue } = state;

  const addAccount = useCallback(
    currency => {
      push("/accounts");
      reduxDispatch(openModal("MODAL_ADD_ACCOUNTS", { currency: currency || null }));
    },
    [push, reduxDispatch],
  );

  const { update, device, catalog } = useAppsSections(state, {
    query,
    appFilter,
    sort,
  });

  const displayedAppList = isDeviceTab ? device : catalog;

  const mapApp = useCallback(
    (app, appStoreView, onlyUpdate, showActions) => (
      <Item
        state={state}
        key={`${appStoreView ? "APP_STORE" : "DEVICE_TAB"}_${app.name}`}
        app={app}
        installed={state.installed.find(({ name }) => name === app.name)}
        dispatch={dispatch}
        forceUninstall={isIncomplete}
        appStoreView={appStoreView}
        onlyUpdate={onlyUpdate}
        showActions={showActions}
        progress={progress}
        setAppInstallDep={setAppInstallDep}
        setAppUninstallDep={setAppUninstallDep}
        addAccount={addAccount}
      />
    ),
    [state, dispatch, isIncomplete, progress, setAppInstallDep, setAppUninstallDep, addAccount],
  );

  return (
    <>
      {update.length <= 0 ? (
        <InstallSuccessBanner
          state={state}
          dispatch={dispatch}
          isIncomplete={isIncomplete}
          addAccount={addAccount}
        />
      ) : (
        <UpdateAllApps
          update={update}
          state={state}
          dispatch={dispatch}
          isIncomplete={isIncomplete}
          progress={progress}
        />
      )}
      {isIncomplete ? null : (
        <StickyTabBar>
          <TabBar
            tabs={["manager.tabs.appCatalog", "manager.tabs.appsOnDevice"]}
            onIndexChange={setActiveTab}
          />
        </StickyTabBar>
      )}
      <Card mt={0}>
        {isDeviceTab && !installedApps.length ? (
          <Box py={8}>
            <Text textAlign="center" ff="Inter|SemiBold" fontSize={6}>
              <Trans i18nKey="manager.applist.placeholderNoAppsInstalled" />
            </Text>
            <Text textAlign="center" fontSize={4}>
              <Trans i18nKey="manager.applist.placeholderGoToCatalog" />
            </Text>
          </Box>
        ) : (
          <>
            <FilterHeader isIncomplete={isIncomplete}>
              <Input
                containerProps={{ noBorder: true, noBoxShadow: true, flex: 1 }}
                renderLeft={<IconSearch size={16} />}
                onChange={debounce(setQuery, 100)}
                placeholder={t(
                  !isDeviceTab ? "manager.tabs.appCatalogSearch" : "manager.tabs.appOnDeviceSearch",
                )}
                ref={inputRef}
              />
              {!isDeviceTab ? (
                <>
                  <Filter onFilterChange={debounce(setFilter, 100)} filter={appFilter} />
                  <Box ml={3}>
                    <Sort onSortChange={debounce(setSort, 100)} sort={sort} />
                  </Box>
                </>
              ) : (
                <UninstallAllButton
                  installedApps={installedApps}
                  uninstallQueue={uninstallQueue}
                  dispatch={dispatch}
                />
              )}
            </FilterHeader>
            {displayedAppList.length ? (
              displayedAppList.map(app => mapApp(app, !isDeviceTab))
            ) : (
              <Placeholder />
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default memo<Props>(AppsList);
