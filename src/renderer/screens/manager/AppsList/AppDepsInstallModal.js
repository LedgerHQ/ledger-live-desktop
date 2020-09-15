// @flow
import React, { memo, useCallback } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import type { App } from "@ledgerhq/live-common/lib/types/manager";
import type { Action } from "@ledgerhq/live-common/lib/apps/types";

import manager from "@ledgerhq/live-common/lib/manager";

import ConfirmModal from "~/renderer/modals/ConfirmModal/index";
import LinkIcon from "~/renderer/icons/LinkIcon";
import Image from "~/renderer/components/Image";

const IconsSection = styled.div`
  height: ${p => p.theme.space[7]}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  margin: ${p => -p.theme.space[6]}px 0px ${p => p.theme.space[6]}px 0;
`;

const Separator = styled.div`
  margin: 0 ${p => p.theme.space[1]}px;
  width: ${p => p.theme.space[4]}px;
  height: 0px;
  border-bottom: 2px dashed ${p => p.theme.colors.palette.action.hover};
`;

const LinkIconWrapper = styled.div`
  padding: ${p => p.theme.space[1]}px;
  box-sizeing: content-box;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  color: ${p => p.theme.colors.palette.primary.main};
  background-color: ${p => p.theme.colors.palette.action.hover};
`;

type Props = {
  app?: App,
  dependencies?: App[],
  appList: App[],
  dispatch: Action => void,
  onClose: () => void,
};

const AppDepsInstallModal = ({ app, dependencies, appList, dispatch, onClose }: Props) => {
  const onConfirm = useCallback(() => {
    if (app && app.name) dispatch({ type: "install", name: app.name });
    onClose();
  }, [app, dispatch, onClose]);

  /** if no app with dependencies was triggered to be installed we dont show anything */
  if (!app || !dependencies || !dependencies.length) return null;

  return (
    <ConfirmModal
      analyticsName="ManagerConfirmationDeps"
      isOpened={!!app}
      onReject={onClose}
      onClose={onClose}
      onConfirm={onConfirm}
      centered
      subTitle={
        <>
          <IconsSection>
            <Image alt="" resource={manager.getIconUrl(app.icon)} width={40} height={40} />
            <Separator />
            <LinkIconWrapper>
              <LinkIcon size={20} />
            </LinkIconWrapper>
            <Separator />
            {
              <Image
                alt=""
                resource={manager.getIconUrl(dependencies[0].icon)}
                width={40}
                height={40}
              />
            }
          </IconsSection>
          <Trans
            i18nKey="manager.apps.dependencyInstall.title"
            values={{ dependency: dependencies[0].name }}
          />
        </>
      }
      desc={
        <Trans
          i18nKey="manager.apps.dependencyInstall.description"
          values={{ app: app.name, dependency: dependencies[0].name }}
        />
      }
      confirmText={<Trans i18nKey="manager.apps.dependencyInstall.confirm" />}
    ></ConfirmModal>
  );
};

export default memo<Props>(AppDepsInstallModal);
