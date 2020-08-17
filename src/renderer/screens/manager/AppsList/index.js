// @flow
import React, { memo, useState, useCallback, useMemo, useEffect } from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import type { DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult, Exec, InstalledItem } from "@ledgerhq/live-common/lib/apps/types";
import {
  predictOptimisticState,
  reducer,
  isIncompleteState,
  distribute,
} from "@ledgerhq/live-common/lib/apps";
import { useAppsRunner } from "@ledgerhq/live-common/lib/apps/react";

import NavigationGuard from "~/renderer/components/NavigationGuard";
import Quit from "~/renderer/icons/Quit";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";

import AppList from "./AppsList";
import DeviceStorage from "../DeviceStorage/index";

import AppDepsInstallModal from "./AppDepsInstallModal";
import AppDepsUnInstallModal from "./AppDepsUnInstallModal";

import ErrorModal from "~/renderer/modals/ErrorModal/index";
import { setHasInstalledApps, setLastSeenDeviceInfo } from "~/renderer/actions/settings";
import { useDispatch, useSelector } from "react-redux";
import { hasInstalledAppsSelector } from "~/renderer/reducers/settings";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${p => p.theme.animations.fadeIn};
`;

const QuitIconWrapper = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  width: ${p => p.theme.space[8]}px;
  height: ${p => p.theme.space[8]}px;
  color: ${p => p.theme.colors.palette.primary.main};
  background-color: ${p => p.theme.colors.palette.action.hover};
  border-radius: 100%;
  margin: ${p => -p.theme.space[5]}px auto ${p => p.theme.space[6]}px auto;
`;

type Props = {
  device: Device,
  firmware: ?FirmwareUpdateContext,
  deviceInfo: DeviceInfo,
  result: ListAppsResult,
  exec: Exec,
  t: TFunction,
  render?: ({
    disableFirmwareUpdate: boolean,
    installed: InstalledItem[],
  }) => React$Node,
  appsToRestore?: string[],
};

const AppsList = ({
  firmware,
  deviceInfo,
  result,
  exec,
  t,
  render,
  appsToRestore,
  device,
}: Props) => {
  const [state, dispatch] = useAppsRunner(result, exec, appsToRestore);
  const [appInstallDep, setAppInstallDep] = useState(undefined);
  const [appUninstallDep, setAppUninstallDep] = useState(undefined);
  const isIncomplete = isIncompleteState(state);
  const hasInstalledApps = useSelector(hasInstalledAppsSelector);
  const reduxDispatch = useDispatch();

  const { installQueue, uninstallQueue, currentError } = state;

  const jobInProgress = installQueue.length > 0 || uninstallQueue.length > 0;

  const distribution = useMemo(() => {
    const newState = installQueue.length
      ? predictOptimisticState(reducer(state, { type: "install", name: installQueue[0] }))
      : state;
    return distribute(newState);
  }, [state, installQueue]);

  const onCloseDepsInstallModal = useCallback(() => setAppInstallDep(undefined), [
    setAppInstallDep,
  ]);

  const onCloseDepsUninstallModal = useCallback(() => setAppUninstallDep(undefined), [
    setAppUninstallDep,
  ]);

  const installState =
    installQueue.length > 0 ? (uninstallQueue.length > 0 ? "update" : "install") : "uninstall";

  const onCloseError = useCallback(() => {
    dispatch({ type: "recover" });
  }, [dispatch]);

  useEffect(() => {
    if (state.installed.length && !hasInstalledApps) {
      reduxDispatch(setHasInstalledApps(true));
    }
  }, [state.installed.length, reduxDispatch, hasInstalledApps]);

  // Save last seen device
  useEffect(() => {
    const dmi = {
      modelId: device.modelId,
      deviceInfo,
      apps: state.installed.map(({ name, version }) => ({ name, version })),
    };
    reduxDispatch(setLastSeenDeviceInfo(dmi));
  }, [device, state.installed, deviceInfo, reduxDispatch]);

  const disableFirmwareUpdate = state.installQueue.length > 0 || state.uninstallQueue.length > 0;

  return (
    <>
      {render ? render({ disableFirmwareUpdate, installed: state.installed }) : null}
      <Container>
        {currentError && (
          <ErrorModal isOpened={!!currentError} error={currentError.error} onClose={onCloseError} />
        )}
        <NavigationGuard
          analyticsName="ManagerGuardModal"
          when={jobInProgress}
          subTitle={
            <>
              <QuitIconWrapper>
                <Quit size={30} />
              </QuitIconWrapper>
              {t(`errors.ManagerQuitPage.${installState}.title`)}
            </>
          }
          desc={t(`errors.ManagerQuitPage.${installState}.description`)}
          confirmText={t(`errors.ManagerQuitPage.${installState}.stay`)}
          cancelText={t(`errors.ManagerQuitPage.quit`)}
          centered
        />
        <DeviceStorage
          jobInProgress={jobInProgress}
          uninstallQueue={uninstallQueue}
          installQueue={installQueue}
          distribution={distribution}
          deviceModel={state.deviceModel}
          deviceInfo={deviceInfo}
          isIncomplete={isIncomplete}
          firmware={firmware}
        />
        <AppList
          deviceInfo={deviceInfo}
          state={state}
          dispatch={dispatch}
          isIncomplete={isIncomplete}
          setAppInstallDep={setAppInstallDep}
          setAppUninstallDep={setAppUninstallDep}
          t={t}
          distribution={distribution}
        />
        <AppDepsInstallModal
          app={appInstallDep && appInstallDep.app}
          dependencies={appInstallDep && appInstallDep.dependencies}
          appList={state.apps}
          dispatch={dispatch}
          onClose={onCloseDepsInstallModal}
        />
        <AppDepsUnInstallModal
          app={appUninstallDep && appUninstallDep.app}
          dependents={appUninstallDep && appUninstallDep.dependents}
          appList={state.apps}
          installed={state.installed}
          dispatch={dispatch}
          onClose={onCloseDepsUninstallModal}
        />
      </Container>
    </>
  );
};

const AppsListScreen = memo<Props>(AppsList);

export default withTranslation()(AppsListScreen);
