// @flow
import React, { useCallback, useMemo, memo } from "react";

import {
  useAppInstallNeedsDeps,
  useAppUninstallNeedsDeps,
} from "@ledgerhq/live-common/lib/apps/react";
import manager from "@ledgerhq/live-common/lib/manager";
import { useHistory } from "react-router-dom";

import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { State, Action, InstalledItem } from "@ledgerhq/live-common/lib/apps/types";

import styled from "styled-components";
import { Trans } from "react-i18next";

import Text from "~/renderer/components/Text";
import Tooltip from "~/renderer/components/Tooltip";
import Button from "~/renderer/components/Button";
import Progress from "~/renderer/screens/manager/AppsList/Progress";
import Box from "~/renderer/components/Box/Box";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

import { colors } from "~/renderer/styles/theme";

import AccountAdd from "~/renderer/icons/AccountAdd";
import IconCheck from "~/renderer/icons/Check";
import IconTrash from "~/renderer/icons/Trash";
import IconArrowDown from "~/renderer/icons/ArrowDown";
import IconExternalLink from "~/renderer/icons/ExternalLink";

const ExternalLinkIconContainer = styled.span`
  display: inline-flex;
  margin-left: 4px;
`;

const AppActionsWrapper = styled.div`
  display: flex;
  flex: 0.8;
  min-width: 150px;
  max-width: 300px;
  justify-content: ${p => (p.right ? "flex-end" : "space-between")};
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
    const { name, type } = app;
    const history = useHistory();
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
    }, [addAccount]);

    const onNavigateTo = useCallback(() => {
      switch (type) {
        case "plugin":
          history.push("/platform");
          break;
        case "app":
          openURL(urls.appSupport[name] || urls.appSupport.default);
          break;
        case "tool":
          openURL(urls.managerAppLearnMore);
          break;
        case "swap":
          history.push("/swap");
          break;
      }
    }, [name, type, history]);

    const updating = useMemo(() => updateAllQueue.includes(name), [updateAllQueue, name]);
    const installing = useMemo(() => installQueue.includes(name), [installQueue, name]);
    const uninstalling = useMemo(() => uninstallQueue.includes(name), [uninstallQueue, name]);

    const canAddAccount = useMemo(
      () => installed && installQueue.length <= 0 && uninstallQueue.length <= 0,
      [installQueue.length, installed, uninstallQueue.length],
    );

    const showLearnMore = type === "tool" || (type === "app" && !isLiveSupported);
    const hasSpecificAction =
      ["swap", "plugin"].includes(type) || (type === "app" && isLiveSupported);
    const hasTwoCTAS = showLearnMore || installed;

    return (
      <AppActionsWrapper right={!hasTwoCTAS}>
        {showLearnMore ? (
          <Button
            color={"palette.primary.main"}
            style={{ display: "flex", backgroundColor: "rgba(0,0,0,0)" }}
            fontSize={3}
            onClick={onNavigateTo}
            justifyContent="center"
            event={`Manager ${type} Click`}
            eventProperties={{
              appName: name,
              appVersion: app.version,
            }}
          >
            <Box horizontal alignContent="center" justifyContent="center">
              <Text>
                <Trans i18nKey={`manager.applist.item.${type}`} />
              </Text>
              <ExternalLinkIconContainer>
                <IconExternalLink size={16} />
              </ExternalLinkIconContainer>
            </Box>
          </Button>
        ) : null}
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
              type === "app" && isLiveSupported ? (
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
              ) : hasSpecificAction ? (
                <Button
                  color={"palette.primary.main"}
                  style={{ display: "flex", backgroundColor: "rgba(0,0,0,0)" }}
                  fontSize={3}
                  onClick={onNavigateTo}
                  justifyContent="center"
                  event={`Manager ${type} Click`}
                  eventProperties={{
                    appName: name,
                    appVersion: app.version,
                  }}
                >
                  <Box horizontal alignContent="center" justifyContent="center">
                    <Text>
                      <Trans i18nKey={`manager.applist.item.${type}`} />
                    </Text>
                  </Box>
                </Button>
              ) : null
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
                  disabled={!canInstall || notEnoughMemoryToInstall}
                  onClick={onInstall}
                  event="Manager Install Click"
                  eventProperties={{
                    appName: name,
                    appVersion: app.version,
                  }}
                  data-test-id={`manager-install-${name}-app-button`}
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
                  data-test-id={`manager-uninstall-${name}-app-button`}
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
