import React, { useMemo, memo, useCallback } from "react";
import { useNotEnoughMemoryToInstall } from "@ledgerhq/live-common/lib/apps/react";
import { getCryptoCurrencyById, isCurrencySupported } from "@ledgerhq/live-common/lib/currencies";
import { App } from "@ledgerhq/live-common/lib/types/manager";
import { State, Action, InstalledItem } from "@ledgerhq/live-common/lib/apps/types";
import { Text, Icons, Flex } from "@ledgerhq/react-ui";
import styled from "styled-components";
import { Trans } from "react-i18next";
import ByteSize from "~/renderer/components/ByteSize";
import AppActions from "./AppActions";
import AppIcon from "./AppIcon";

const AppRow = styled(Flex).attrs(() => ({
  flexDirection: "row",
  alignItems: "center",
}))`
  height: 52px;
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
  color: ${p => p.theme.colors.neutral.c70};
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
  containerProps: Record<string, unknown>;
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
  containerProps,
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
    <AppRow id={`managerAppsList-${name}`} {...containerProps}>
      <Flex flex={1} alignItems="center">
        <AppIcon app={app} />
        <AppName>
          <Text variant="paragraph" fontWeight="medium" mb={1} color="neutral.c100">{`${
            app.displayName
          }${currency ? ` (${currency.ticker})` : ""}`}</Text>
          <Text variant="small" color="neutral.c70">
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
        <Text variant="small" color="neutral.c70">
          <ByteSize
            value={
              ((installed && installed.blocks) || 0) *
                deviceModel.getBlockSize(deviceInfo.version) ||
              app.bytes ||
              0
            }
            deviceModel={deviceModel}
            firmwareVersion={deviceInfo.version}
          />
        </Text>
      </AppSize>
      <Flex flex={1} flexDirection="row" alignItems="center" justifyContent="center">
        {isLiveSupported && (
          <>
            <Icons.CircledCheckMedium size="20px" color="success.c100" />
            <Text variant="small" ml="6px" color="neutral.c70">
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
