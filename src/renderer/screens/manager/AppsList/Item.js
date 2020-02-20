// @flow
import React, { useMemo, memo, useCallback } from "react";
import { useNotEnoughMemoryToInstall } from "@ledgerhq/live-common/lib/apps/react";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { isCurrencySupported } from "@ledgerhq/live-common/lib/data/cryptocurrencies";
import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { State, Action, InstalledItem } from "@ledgerhq/live-common/lib/apps/types";

import styled from "styled-components";
import { Trans } from "react-i18next";
import manager from "@ledgerhq/live-common/lib/manager";

import ByteSize from "~/renderer/components/ByteSize";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";

import IconCheckFull from "~/renderer/icons/CheckFull";
import AppActions from "./AppActions";

const AppRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
  padding: 20px;
  font-size: 12px;
`;

const AppName = styled.div`
  flex-direction: column;
  padding-left: 15px;
  & > * {
    display: block;
  }
`;

const AppSize = styled.div`
  flex: 0 0 50px;
  text-align: center;
  color: ${p => p.theme.colors.palette.text.shade60};
`;

type Props = {
  state: State,
  app: App,
  installed: ?InstalledItem,
  dispatch: Action => void,
  appStoreView: boolean,
  onlyUpdate?: boolean,
  forceUninstall?: boolean,
  showActions?: boolean,
  progress: number,
  setAppInstallDep?: (*) => void,
  setAppUninstallDep?: (*) => void,
  addAccount?: (*) => void,
};

// eslint-disable-next-line react/display-name
const Item: React$ComponentType<Props> = ({
  state,
  app,
  installed,
  dispatch,
  appStoreView,
  onlyUpdate,
  forceUninstall,
  showActions = true,
  progress,
  setAppInstallDep,
  setAppUninstallDep,
  addAccount,
}: Props) => {
  const { name } = app;
  const { deviceModel } = state;

  const notEnoughMemoryToInstall = useNotEnoughMemoryToInstall(state, name);

  const currency = useMemo(() => app.currencyId && getCryptoCurrencyById(app.currencyId), [
    app.currencyId,
  ]);

  const isLiveSupported = !!currency && isCurrencySupported(currency);

  const onAddAccount = useCallback(() => {
    if (addAccount) addAccount(currency);
  }, [addAccount, currency]);

  const version = (installed && installed.version) || app.version;
  const newVersion = installed && installed.availableVersion;

  return (
    <AppRow>
      <Box flex="0.7" horizontal>
        <img alt="" src={manager.getIconUrl(app.icon)} width={40} height={40} />
        <AppName>
          <Text ff="Inter|Bold" color="palette.text.shade100" fontSize={3}>{`${app.name}${
            currency ? ` (${currency.ticker})` : ""
          }`}</Text>
          <Text ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
            <Trans
              i18nKey={
                installed && !installed.updated
                  ? "manager.applist.item.versionNew"
                  : "manager.applist.item.version"
              }
              values={{
                version,
                newVersion: newVersion && newVersion !== version ? ` ${newVersion}` : null,
              }}
            />
          </Text>
        </AppName>
      </Box>
      <AppSize>
        <ByteSize
          value={((installed && installed.blocks) || 0) * deviceModel.blockSize || app.bytes || 0}
          deviceModel={deviceModel}
        />
      </AppSize>
      <Box flex="0.6" horizontal alignContent="center" justifyContent="center">
        {isLiveSupported && (
          <>
            <Box mr={2}>
              <IconCheckFull size={16} />
            </Box>
            <Text ml={1} ff="Inter|Regular" color="palette.text.shade60" fontSize={3}>
              <Trans i18nKey="manager.applist.item.supported" />
            </Text>
          </>
        )}
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
        progress={progress}
        setAppInstallDep={setAppInstallDep}
        setAppUninstallDep={setAppUninstallDep}
        isLiveSupported={isLiveSupported}
        addAccount={onAddAccount}
      />
    </AppRow>
  );
};

export default memo<Props>(
  Item,
  (
    { state: { installQueue: _installQueue, uninstallQueue: _uninstallQueue } },
    { state: { installQueue, uninstallQueue }, progress, app: { name } },
  ) => {
    /** compare _prev to next props that if different should trigger a rerender */
    return (
      !(progress !== 1 && installQueue.length > 0 && installQueue[0] === name) &&
      installQueue.length === _installQueue.length &&
      uninstallQueue.length === _uninstallQueue.length
    );
  },
);
