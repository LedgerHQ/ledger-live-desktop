// @flow
import React, { useMemo, memo, useCallback } from "react";
import { useNotEnoughMemoryToInstall } from "@ledgerhq/live-common/lib/apps/react";
import { getCryptoCurrencyById, isCurrencySupported } from "@ledgerhq/live-common/lib/currencies";
import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { State, Action, InstalledItem } from "@ledgerhq/live-common/lib/apps/types";

import styled from "styled-components";
import { Trans } from "react-i18next";

import ByteSize from "~/renderer/components/ByteSize";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import Box from "~/renderer/components/Box";

import IconCheckFull from "~/renderer/icons/CheckFull";
import IconInfoCircleFull from "~/renderer/icons/InfoCircleFull";

import AppActions from "./AppActions";

import AppIcon from "./AppIcon";

const AppRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
  padding: 20px;
  font-size: 12px;
`;

const AppName = styled.div`
  flex: 1;
  flex-direction: column;
  padding-left: 15px;
  max-height: 40px;
  min-width: 160px;
  & > * {
    display: block;
  }
`;

type Props = {
  optimisticState: State,
  state: State,
  app: App,
  installed: ?InstalledItem,
  dispatch: Action => void,
  appStoreView: boolean,
  onlyUpdate?: boolean,
  forceUninstall?: boolean,
  showActions?: boolean,
  setAppInstallDep?: (*) => void,
  setAppUninstallDep?: (*) => void,
  addAccount?: (*) => void,
};

// eslint-disable-next-line react/display-name
const Item: React$ComponentType<Props> = ({
  optimisticState,
  state,
  app,
  installed,
  dispatch,
  appStoreView,
  onlyUpdate,
  forceUninstall,
  showActions = true,
  setAppInstallDep,
  setAppUninstallDep,
  addAccount,
}: Props) => {
  const { name, type } = app;
  const { deviceModel, deviceInfo } = state;

  const notEnoughMemoryToInstall = useNotEnoughMemoryToInstall(optimisticState, name);

  const currency = useMemo(() => app.currencyId && getCryptoCurrencyById(app.currencyId), [
    app.currencyId,
  ]);

  const currencySupported = !!currency && isCurrencySupported(currency);
  const isLiveSupported = currencySupported || ["swap", "plugin"].includes(type);

  const onAddAccount = useCallback(() => {
    if (addAccount) addAccount(currency);
  }, [addAccount, currency]);

  const version = (installed && installed.version) || app.version;
  const newVersion = installed && installed.availableVersion;

  const availableApp = useMemo(() => state.apps.find(({ name }) => name === app.name), [
    app.name,
    state.apps,
  ]);

  const bytes = useMemo(
    () =>
      (onlyUpdate && availableApp?.bytes) ||
      ((installed && installed.blocks) || 0) * deviceModel.getBlockSize(deviceInfo.version) ||
      app.bytes ||
      0,
    [app.bytes, availableApp.bytes, deviceInfo.version, deviceModel, installed, onlyUpdate],
  );

  return (
    <AppRow id={`managerAppsList-${name}`}>
      <Box flex="0.7" horizontal>
        <AppIcon app={app} />
        <AppName>
          <Text ff="Inter|Bold" color="palette.text.shade100" fontSize={3}>{`${app.displayName}${
            currency ? ` (${currency.ticker})` : ""
          }`}</Text>
          <Text ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
            <Trans
              i18nKey="manager.applist.item.version"
              values={{
                version: onlyUpdate && newVersion && newVersion !== version ? newVersion : version,
              }}
            />{" "}
            •{" "}
            <ByteSize
              value={bytes}
              formatFunction={Math.ceil}
              deviceModel={deviceModel}
              firmwareVersion={deviceInfo.version}
            />
          </Text>
        </AppName>
      </Box>
      <Box flex="0.7" horizontal alignContent="center" justifyContent="flex-start" ml={5}>
        {isLiveSupported ? (
          <>
            <Box>
              <IconCheckFull size={16} />
            </Box>
            <Ellipsis ml={2} ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
              <Trans i18nKey="manager.applist.item.supported" />
            </Ellipsis>
          </>
        ) : currency ? (
          <>
            <Box>
              <IconInfoCircleFull size={16} />
            </Box>
            <Ellipsis ml={2} ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
              <Trans i18nKey="manager.applist.item.not_supported" />
            </Ellipsis>
          </>
        ) : null}
      </Box>
      <AppActions
        state={state}
        app={app}
        installed={installed}
        dispatch={dispatch}
        forceUninstall={forceUninstall}
        appStoreView={appStoreView}
        onlyUpdate={onlyUpdate}
        showActions={showActions}
        notEnoughMemoryToInstall={notEnoughMemoryToInstall}
        setAppInstallDep={setAppInstallDep}
        setAppUninstallDep={setAppUninstallDep}
        isLiveSupported={isLiveSupported}
        addAccount={onAddAccount}
      />
    </AppRow>
  );
};

export default memo<Props>(Item);
