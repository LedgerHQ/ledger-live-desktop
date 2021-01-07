// @flow
import React, { useCallback, useMemo, memo } from "react";

import {
  useAppInstallNeedsDeps,
  useAppUninstallNeedsDeps,
} from "@ledgerhq/live-common/lib/apps/react";

import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { State, Action, InstalledItem } from "@ledgerhq/live-common/lib/apps/types";

import styled from "styled-components";
import { Trans } from "react-i18next";

import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

import Text from "~/renderer/components/Text";
import Tooltip from "~/renderer/components/Tooltip";
import Button from "~/renderer/components/Button";
import Progress from "~/renderer/screens/manager/AppsList/Progress";
import Box from "~/renderer/components/Box/Box";

import { colors } from "~/renderer/styles/theme";

import AccountAdd from "~/renderer/icons/AccountAdd";
import IconCheck from "~/renderer/icons/Check";
import IconTrash from "~/renderer/icons/Trash";
import IconArrowDown from "~/renderer/icons/ArrowDown";
import LinkIcon from "~/renderer/icons/LinkIcon";

const AppActionsWrapper = styled.div`
  display: flex;
  flex: 1;
  min-width: 150px;
  justify-content: flex-end;
  flex-direction: row;
  > *:not(:last-child) {
    margin-right: 10px;
  }
`;

const SuccessInstall = styled.div`
  color: ${p => p.theme.colors.positiveGreen};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  > svg {
    padding-right: 5px;
  }
`;

type Props = {
  state: State,
  app: App,
  installed: ?InstalledItem,
  dispatch: Action => void,
  appStoreView: boolean,
  onlyUpdate?: boolean,
  forceUninstall?: boolean,
  notEnoughMemoryToInstall: boolean,
  showActions?: boolean,
  setAppInstallDep?: (*) => void,
  setAppUninstallDep?: (*) => void,
  isLiveSupported: boolean,
  addAccount?: () => void,
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
    }, [addAccount]);

    const onSupportLink = useCallback(() => {
      openURL(urls.appSupport);
    }, []);

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
          <Progress
            state={state}
            name={name}
            updating={updating}
            installing={installing}
            isCurrent={installQueue.length > 0 && installQueue[0] === name}
            uninstalling={uninstalling}
          />
        ) : showActions ? (
          <>
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
                  <Button
                    color={canAddAccount ? "palette.primary.main" : "palette.text.shade40"}
                    inverted
                    style={{ display: "flex", backgroundColor: "rgba(0,0,0,0)" }}
                    fontSize={3}
                    disabled={!canAddAccount}
                    onClick={onAddAccount}
                    justifyContent="center"
                    event="Manager AddAccount Click"
                    eventProperties={{
                      appName: name,
                      appVersion: app.version,
                    }}
                  >
                    <Box horizontal alignContent="center" justifyContent="center">
                      <AccountAdd size={16} />
                      <Text style={{ marginLeft: 8 }}>
                        <Trans i18nKey="manager.applist.item.addAccount" />
                      </Text>
                    </Box>
                  </Button>
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
                  <Button
                    inverted
                    style={{ display: "flex" }}
                    fontSize={3}
                    onClick={onSupportLink}
                    event="Manager SupportLink Click"
                    eventProperties={{
                      appName: name,
                      appVersion: app.version,
                    }}
                  >
                    <Box horizontal alignContent="center" justifyContent="center">
                      <LinkIcon size={16} />
                      <Text ff="Inter" style={{ marginLeft: 8 }}>
                        <Trans i18nKey="manager.applist.item.learnMore" />
                      </Text>
                    </Box>
                  </Button>
                </Tooltip>
              )
            ) : null}
            {appStoreView && installed && (
              <SuccessInstall>
                <IconCheck size={20} />
                <Text ff="Inter|SemiBold" fontSize={4}>
                  <Trans i18nKey="manager.applist.item.installed" />
                </Text>
              </SuccessInstall>
            )}

            {!installed && (
              <Tooltip
                content={
                  notEnoughMemoryToInstall ? (
                    <Trans i18nKey="manager.applist.item.notEnoughSpace" />
                  ) : null
                }
              >
                <Button
                  style={{ display: "flex" }}
                  lighterPrimary
                  disabled={notEnoughMemoryToInstall}
                  onClick={onInstall}
                  event="Manager Install Click"
                  eventProperties={{
                    appName: name,
                    appVersion: app.version,
                  }}
                >
                  <IconArrowDown size={14} />
                  <Text style={{ marginLeft: 8 }}>
                    <Trans i18nKey="manager.applist.item.install" />
                  </Text>
                </Button>
              </Tooltip>
            )}
            {(((installed || !installedAvailable) && !appStoreView && !onlyUpdate) ||
              forceUninstall) && (
              <Tooltip
                content={
                  <Trans i18nKey="manager.applist.item.removeTooltip" values={{ appName: name }} />
                }
              >
                <Button
                  style={{ padding: 13 }}
                  onClick={onUninstall}
                  event="Manager Uninstall Click"
                  eventProperties={{
                    appName: name,
                    appVersion: app.version,
                  }}
                >
                  <IconTrash color={colors.grey} size={14} />
                </Button>
              </Tooltip>
            )}
          </>
        ) : (
          onlyUpdate &&
          updating &&
          !uninstalling &&
          installed && (
            <SuccessInstall>
              <IconCheck size={16} />
              <Text ff="Inter|SemiBold" fontSize={4}>
                <Trans i18nKey="manager.applist.item.updated" />
              </Text>
            </SuccessInstall>
          )
        )}
      </AppActionsWrapper>
    );
  },
);

export default memo<Props>(AppActions);
