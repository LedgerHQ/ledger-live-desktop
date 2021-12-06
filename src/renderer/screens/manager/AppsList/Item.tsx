import React, { useMemo, memo, useCallback } from "react";
import { useNotEnoughMemoryToInstall } from "@ledgerhq/live-common/lib/apps/react";
import { getCryptoCurrencyById, isCurrencySupported } from "@ledgerhq/live-common/lib/currencies";
import { App } from "@ledgerhq/live-common/lib/types/manager";
import { State, Action, InstalledItem } from "@ledgerhq/live-common/lib/apps/types";
import { Text, Icons, Flex } from "@ledgerhq/react-ui";
import styled from "styled-components";
import { Trans } from "react-i18next";

import ByteSize from "~/renderer/components/ByteSize";
import Box from "~/renderer/components/Box";

import AppActions from "./AppActions";

import AppIcon from "./AppIcon";

const AppRow = styled.div`
  display: flex;
  /* background-color: lightgreen; */
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 20px;
  padding: 6px 0px;
`;

const AppName = styled.div`
  flex: 1;
  flex-direction: column;
  padding-left: 15px;
  max-height: 40px;
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
  optimisticState: State;
  state: State;
  app: App;
  installed: InstalledItem;
  dispatch: (arg: Action) => void;
  appStoreView: boolean;
  onlyUpdate?: boolean;
  forceUninstall?: boolean;
  showActions?: boolean;
  setAppInstallDep?: (...args: any[]) => void;
  setAppUninstallDep?: (...args: any[]) => void;
  addAccount?: (...args: any[]) => void;
};

// eslint-disable-next-line react/display-name
const Item: React.ComponentType<Props> = ({
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
  const { name } = app;
  const { deviceModel, deviceInfo } = state;

  const notEnoughMemoryToInstall = useNotEnoughMemoryToInstall(optimisticState, name);

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
    <AppRow id={`managerAppsList-${name}`}>
      <Flex flex="0.7" horizontal>
        <AppIcon app={app} />
        <AppName>
          <Text type="paragraph" fontWeight="medium" color="palette.neutral.c100">{`${app.displayName}${
            currency ? ` (${currency.ticker})` : ""
          }`}</Text>
          <Text variant="small" color="palette.neutral.c70">
            <Trans
              i18nKey="manager.applist.item.version"
              values={{
                version: onlyUpdate && newVersion && newVersion !== version ? newVersion : version,
              }}
            />
          </Text>
        </AppName>
      </Flex>
      <AppSize>
        <Text variant="small" color="palette.neutral.c70">
          <ByteSize
            value={
              ((installed && installed.blocks) || 0) * deviceModel.getBlockSize(deviceInfo.version) ||
              app.bytes ||
              0
            }
            deviceModel={deviceModel}
            firmwareVersion={deviceInfo.version}
          />
        </Text>
      </AppSize>
      <Flex flex="0.6" flexDirection="row" alignItems="center" justifyContent="center">
        {isLiveSupported && (
          <>
            <Icons.CircledCheckMedium size="20px" color="palette.success.c100" />
            <Text variant="small" ml="6px" color="palette.neutral.c70">
              <Trans i18nKey="manager.applist.item.supported" />
            </Text>
          </>
        )}
      </Flex>
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
