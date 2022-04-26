import React, { useCallback, useMemo, memo } from "react";

import {
  useAppInstallNeedsDeps,
  useAppUninstallNeedsDeps,
} from "@ledgerhq/live-common/lib/apps/react";
import manager from "@ledgerhq/live-common/lib/manager";

import { App } from "@ledgerhq/live-common/lib/types/manager";
import { State, Action, InstalledItem } from "@ledgerhq/live-common/lib/apps/types";
import { Flex, Text, Icons, Tooltip } from "@ledgerhq/react-ui";

import styled from "styled-components";
import { Trans } from "react-i18next";

import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

import Link from "~/renderer/components/Link";
import Button from "~/renderer/components/Button";
import Progress from "~/renderer/screens/manager/AppsList/Progress";

const AppActionsWrapper = styled(Flex).attrs(() => ({
  flex: 1,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  minWidth: "150px",
}))``;

const Cell = styled(Flex).attrs(() => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  width: "50px",
}))``;

type Props = {
  state: State;
  app: App;
  installed: InstalledItem;
  dispatch: (arg: Action) => void;
  appStoreView: boolean;
  onlyUpdate?: boolean;
  forceUninstall?: boolean;
  notEnoughMemoryToInstall: boolean;
  showActions?: boolean;
  setAppInstallDep?: (...args: any[]) => void;
  setAppUninstallDep?: (...args: any[]) => void;
  isLiveSupported: boolean;
  addAccount?: () => void;
};

// eslint-disable-next-line react/display-name
const AppActions: React$ComponentType<Props> = React.memo(
  ({
    state,
    app,
    installed,
    dispatch,
    forceUninstall,
    appStoreView,
    onlyUpdate,
    notEnoughMemoryToInstall,
    showActions = true,
    setAppInstallDep,
    setAppUninstallDep,
    isLiveSupported,
    addAccount,
  }: Props) => {
    const { name } = app;
    const { installedAvailable, installQueue, uninstallQueue, updateAllQueue } = state;

    // $FlowFixMe
    const canInstall = useMemo(() => manager.canHandleInstall(app), [app]);

    const needsInstallDeps = useAppInstallNeedsDeps(state, app);

    const needsUninstallDeps = useAppUninstallNeedsDeps(state, app);

    const onInstall = useCallback(() => {
      if (needsInstallDeps && setAppInstallDep) setAppInstallDep(needsInstallDeps);
      else dispatch({ type: "install", name });
    }, [dispatch, name, needsInstallDeps, setAppInstallDep]);

    const onUninstall = useCallback(() => {
      if (needsUninstallDeps && setAppUninstallDep) setAppUninstallDep(needsUninstallDeps);
      else dispatch({ type: "uninstall", name });
    }, [dispatch, name, needsUninstallDeps, setAppUninstallDep]);

    const onAddAccount = useCallback(() => {
      if (addAccount) addAccount();
    }, [addAccount, name, app]);

    const onSupportLink = useCallback(() => {
      openURL(urls.appSupport[app.name] || urls.appSupport.default);
    }, [app.name]);

    const updating = useMemo(() => updateAllQueue.includes(name), [updateAllQueue, name]);
    const installing = useMemo(() => installQueue.includes(name), [installQueue, name]);
    const uninstalling = useMemo(() => uninstallQueue.includes(name), [uninstallQueue, name]);

    const canAddAccount = useMemo(
      () => installed && installQueue.length <= 0 && uninstallQueue.length <= 0,
      [installQueue.length, installed, uninstallQueue.length],
    );

    return (
      <AppActionsWrapper>
        {installing || uninstalling ? (
          <>
            <Cell />
            <Cell justifyContent="flex-end">
              <Progress
                state={state}
                name={name}
                updating={updating}
                installing={installing}
                isCurrent={installQueue.length > 0 && installQueue[0] === name}
                uninstalling={uninstalling}
              />
            </Cell>
          </>
        ) : showActions ? (
          <>
            <Cell justifyContent="center">
              {installed ? (
                isLiveSupported ? (
                  <Tooltip
                    content={
                      canAddAccount ? (
                        <Trans
                          i18nKey="manager.applist.item.addAccountTooltip"
                          values={{ appName: name }}
                        />
                      ) : (
                        <Trans i18nKey="manager.applist.item.addAccountWarn" />
                      )
                    }
                  >
                    <Flex>
                      <Link
                        iconPosition="left"
                        event="Manager AddAccount Click"
                        eventProperties={{
                          appName: name,
                          appVersion: app.version,
                        }}
                        onClick={onAddAccount}
                        disabled={!canAddAccount}
                        Icon={Icons.WalletAddMedium}
                        type="shade"
                      >
                        <Trans i18nKey="manager.applist.item.addAccount" />
                      </Link>
                    </Flex>
                  </Tooltip>
                ) : (
                  <Tooltip
                    content={
                      <Trans
                        i18nKey="manager.applist.item.learnMoreTooltip"
                        values={{ appName: name }}
                      />
                    }
                  >
                    <Flex>
                      <Link
                        iconPosition="left"
                        event="Manager SupportLink Click"
                        eventProperties={{
                          appName: name,
                          appVersion: app.version,
                        }}
                        onClick={onSupportLink}
                        Icon={Icons.LinkMedium}
                        type="shade"
                      >
                        <Trans i18nKey="manager.applist.item.learnMore" />
                      </Link>
                    </Flex>
                  </Tooltip>
                )
              ) : null}
            </Cell>
            <Cell justifyContent="flex-end">
              {appStoreView && installed ? (
                <Flex flexDirection="row" alignItems="center" justifyContent="center">
                  <Icons.CheckAloneMedium size={15} color="palette.success.c100" />
                  <Text
                    ml="4px"
                    variant="paragraph"
                    fontWeight="medium"
                    color="palette.success.c100"
                  >
                    <Trans i18nKey="manager.applist.item.installed" />
                  </Text>
                </Flex>
              ) : !installed ? (
                <Tooltip
                  disabled={!notEnoughMemoryToInstall}
                  content={<Trans i18nKey="manager.applist.item.notEnoughSpace" />}
                >
                  <Flex>
                    <Button
                      variant="shade"
                      Icon={Icons.ArrowToBottomMedium}
                      iconPosition="left"
                      id={`appActionsInstall-${name}`}
                      disabled={!canInstall || notEnoughMemoryToInstall}
                      onClick={onInstall}
                      event="Manager Install Click"
                      eventProperties={{
                        appName: name,
                        appVersion: app.version,
                      }}
                    >
                      <Trans i18nKey="manager.applist.item.install" />
                    </Button>
                  </Flex>
                </Tooltip>
              ) : ((installed || !installedAvailable) && !appStoreView && !onlyUpdate) ||
                forceUninstall ? (
                <Tooltip
                  content={
                    <Trans
                      i18nKey="manager.applist.item.removeTooltip"
                      values={{ appName: name }}
                    />
                  }
                >
                  <Flex>
                    <Link
                      id={`appActionsUninstall-${name}`}
                      event="Manager Uninstall Click"
                      eventProperties={{
                        appName: name,
                        appVersion: app.version,
                      }}
                      onClick={onUninstall}
                      Icon={Icons.TrashMedium}
                      type="shade"
                    />
                  </Flex>
                </Tooltip>
              ) : null}
            </Cell>
          </>
        ) : (
          onlyUpdate &&
          updating &&
          !uninstalling &&
          installed && (
            <>
              <Cell />
              <Cell justifyContent="flex-end">
                <Flex flexDirection="row" alignItems="center" justifyContent="center">
                  <Icons.CheckAloneMedium size={15} color="palette.success.c100" />
                  <Text
                    ml="4px"
                    variant="paragraph"
                    fontWeight="medium"
                    color="palette.success.c100"
                  >
                    <Trans i18nKey="manager.applist.item.updated" />
                  </Text>
                </Flex>
              </Cell>
            </>
          )
        )}
      </AppActionsWrapper>
    );
  },
);

export default memo<Props>(AppActions);
