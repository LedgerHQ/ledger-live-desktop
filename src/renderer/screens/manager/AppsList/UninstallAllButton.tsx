import React, { useState, memo, useCallback } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { Action, InstalledItem } from "@ledgerhq/live-common/lib/apps/types";
import { Icons } from "@ledgerhq/react-ui";

import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import ConfirmModal from "~/renderer/modals/ConfirmModal/index";
import Trash from "~/renderer/icons/Trash";

const IconWrapper = styled.div`
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
  installedApps: InstalledItem[];
  uninstallQueue: string[];
  dispatch: (arg: Action) => void;
};

const UninstallAllButton = ({ installedApps, uninstallQueue, dispatch }: Props) => {
  const [isOpened, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), [setModalOpen]);
  const closeModal = useCallback(() => setModalOpen(false), [setModalOpen]);

  const onConfirm = useCallback(() => {
    dispatch({ type: "wipe" });
    setModalOpen(false);
  }, [dispatch, setModalOpen]);

  if (!installedApps || !installedApps.length || uninstallQueue.length === installedApps.length)
    return null;

  return (
    <>
      <Button variant="shade" onClick={openModal} event="Manager Uninstall All" Icon={Icons.TrashMedium} iconPosition="left">
        <Trans i18nKey="manager.applist.uninstall.title" />
      </Button>
      <ConfirmModal
        isOpened={isOpened}
        isDanger
        analyticsName="ManagerConfirmWipeAll"
        onConfirm={onConfirm}
        onClose={closeModal}
        onReject={closeModal}
        subTitle={
          <>
            <IconWrapper>
              <Trash size={30} />
            </IconWrapper>
            <Trans i18nKey="manager.applist.uninstall.subtitle" />
          </>
        }
        desc={<Trans i18nKey="manager.applist.uninstall.description" />}
        confirmText={<Trans i18nKey="manager.applist.item.uninstall" />}
        centered
      />
    </>
  );
};

export default memo<Props>(UninstallAllButton);
