// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import ConfirmModal from "~/renderer/modals/ConfirmModal";
import { openUserDataFolderAndQuit } from "~/renderer/reset";

type Props = {
  isOpened: boolean,
  onClose: () => *,
};

const ResetFallbackModal = ({ isOpened, onClose }: Props) => {
  const { t } = useTranslation();
  return (
    <ConfirmModal
      analyticsName="ResetModalFallback"
      centered
      isOpened={isOpened}
      onConfirm={openUserDataFolderAndQuit}
      onClose={onClose}
      onReject={onClose}
      confirmText={"Open folder"}
      title={t("settings.resetFallbackModal.title")}
      desc={
        <div>
          <p>{t("settings.resetFallbackModal.part1")}</p>
          <p style={{ fontWeight: "bold" }}>
            {t("settings.resetFallbackModal.part2")}
            {t("settings.resetFallbackModal.part3")}
            {t("settings.resetFallbackModal.part4")}
          </p>
          <p style={{ marginTop: 20 }}>{t("settings.resetFallbackModal.part5")}</p>
        </div>
      }
    />
  );
};

export default ResetFallbackModal;
