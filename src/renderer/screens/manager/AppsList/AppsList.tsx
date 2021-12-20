import React, { useState, memo, useCallback, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Trans, TFunction } from "react-i18next";

import { useAppsSections } from "@ledgerhq/live-common/lib/apps/react";

import { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import { State, Action, AppsDistribution } from "@ledgerhq/live-common/lib/apps/types";
import { Flex, SearchInput } from "@ledgerhq/react-ui";
import { currenciesSelector } from "~/renderer/reducers/accounts";
import UpdateAllApps from "./UpdateAllApps";
import Placeholder from "./Placeholder";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import TagsTabBar from "~/renderer/components/TagsTabBar";
import Item from "./Item";
import Filter from "./Filter";
import Sort from "./Sort";
import UninstallAllButton from "./UninstallAllButton";

import { openModal } from "~/renderer/actions/modals";

import debounce from "lodash/debounce";
import InstallSuccessBanner from "./InstallSuccessBanner";

const StickyContainer = styled.div`
  background-color: ${p => p.theme.colors.palette.neutral.c00};
  position: sticky;
  top: -${p => p.theme.space[3]}px;
  right: 0px;
  left: 0px;
  box-sizing: content-box;
  z-index: 1;
`;

const TabsContainer = styled(Flex).attrs(() => ({
  py: 7,
}))``;

const FilterHeaderContainer = styled(Flex).attrs(() => ({
  flexDirection: "row",
  alignItems: "center",
  my: 7,
}))``;

const Divider = styled.div`
  height: 1px;
  left: 0px;
  right: 0px;
  margin: 0px -40px 0px -40px;
  background-color: ${p => p.theme.colors.palette.neutral.c40};
`;

type Props = {
  deviceInfo: DeviceInfo;
  optimisticState: State;
  state: State;
  dispatch: (arg: Action) => void;
  isIncomplete: boolean;
  setAppInstallDep: (...args: any[]) => void;
  setAppUninstallDep: (...args: any[]) => void;
  t: TFunction;
  distribution: AppsDistribution;
};

const AppsList = ({
  optimisticState,
  state,
  dispatch,
  isIncomplete,
  setAppInstallDep,
  setAppUninstallDep,
  t,
}: Props) => {
  const { push } = useHistory();
  const { search } = useLocation();
  const reduxDispatch = useDispatch();
  const currenciesAccountsSetup = useSelector(currenciesSelector);

  const inputRef = useRef<any>();
  const [query, setQuery] = useState("");
  const [appFilter, setFilter] = useState("all");
  const [sort, setSort] = useState({ type: "marketcap", order: "desc" });
  const [activeTab, setActiveTab] = useState(0);

  const onTextChange = useCallback((v: string) => setQuery(v), [setQuery]);

  /** clear search field on tab change */
  useEffect(() => {
    setQuery("");
  }, [activeTab]);

  const isDeviceTab = activeTab === 1;

  /** retrieve search query from router location search params */
  useEffect(() => {
    const params = new URLSearchParams(search);
    const q = params.get("q");
    if (q) setQuery(q);
    if (inputRef.current && inputRef.current && inputRef.current.focus) inputRef.current.focus();
  }, [search]);

  const { installed: installedApps, uninstallQueue, apps } = state;

  const addAccount = useCallback(
    currency => {
      push("/accounts");
      reduxDispatch(
        openModal("MODAL_ADD_ACCOUNTS", {
          currency: currency || null,
        }),
      );
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
        optimisticState={optimisticState}
        state={state}
        key={`${appStoreView ? "APP_STORE" : "DEVICE_TAB"}_${app.name}`}
        app={app}
        installed={state.installed.find(({ name }) => name === app.name)}
        dispatch={dispatch}
        forceUninstall={isIncomplete}
        appStoreView={appStoreView}
        onlyUpdate={onlyUpdate}
        showActions={showActions}
        setAppInstallDep={setAppInstallDep}
        setAppUninstallDep={setAppUninstallDep}
        addAccount={addAccount}
        containerProps={{
          marginTop: 2,
          marginBottom: 7,
        }}
      />
    ),
    [
      optimisticState,
      state,
      dispatch,
      isIncomplete,
      setAppInstallDep,
      setAppUninstallDep,
      addAccount,
    ],
  );

  const noAppToShow = isDeviceTab && !installedApps.length;

  const filterHeaderRightPart = !isDeviceTab ? (
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
  );

  return (
    <>
      <InstallSuccessBanner
        state={state}
        dispatch={dispatch}
        isIncomplete={isIncomplete}
        addAccount={addAccount}
        disabled={update.length >= 1 || currenciesAccountsSetup.length}
      />
      <UpdateAllApps
        optimisticState={optimisticState}
        update={update}
        state={state}
        dispatch={dispatch}
        isIncomplete={isIncomplete}
      />
      <StickyContainer>
        {isIncomplete ? null : (
          <TabsContainer>
            <TagsTabBar
              selectedIndex={activeTab}
              onSelectedChanged={setActiveTab}
              tabs={[t("manager.tabs.appCatalog"), t("manager.tabs.appsOnDevice")]}
            />
          </TabsContainer>
        )}
        <Divider />
        {!noAppToShow && (
          <FilterHeaderContainer isIncomplete={isIncomplete}>
            <Flex flex={1}>
              <SearchInput
                autoFocus
                onChange={onTextChange}
                search={query}
                style={{ paddingTop: 0, paddingBottom: 0 }}
                placeholder={t(
                  !isDeviceTab ? "manager.tabs.appCatalogSearch" : "manager.tabs.appOnDeviceSearch",
                )}
                ref={inputRef}
              />
            </Flex>
            {filterHeaderRightPart}
          </FilterHeaderContainer>
        )}
      </StickyContainer>
      <Flex flexDirection="column">
        {noAppToShow ? (
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
            {displayedAppList.length ? (
              displayedAppList.map(app => mapApp(app, !isDeviceTab))
            ) : (
              <Placeholder
                query={query}
                addAccount={addAccount}
                dispatch={dispatch}
                installed={installedApps}
                apps={apps}
              />
            )}
          </>
        )}
      </Flex>
    </>
  );
};

export default memo<Props>(AppsList);
