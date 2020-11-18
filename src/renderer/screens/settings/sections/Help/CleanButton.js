// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import logger from "~/logger";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import Button from "~/renderer/components/Button";
import ConfirmModal from "~/renderer/modals/ConfirmModal";
import ResetFallbackModal from "~/renderer/modals/ResetFallbackModal";
import { useActionModal } from "./logic";
import { useSoftReset } from "~/renderer/reset";

export default function CleanButton() {
  const { t } = useTranslation();
  const softReset = useSoftReset();
  const [
    { opened, pending, fallbackOpened },
    { open, close, closeFallback, handleConfirm, handleError },
  ] = useActionModal();

  const onConfirm = useCallback(async () => {
    if (pending) return;
    try {
      handleConfirm();
      await softReset();
    } catch (err) {
      logger.error(err);
      handleError();
    }
  }, [pending, softReset, handleConfirm, handleError]);

  return (
    <>
      <Button small primary onClick={open} event="ClearCacheIntent">
        {t("settings.profile.softReset")}
      </Button>

      <ConfirmModal
        analyticsName="CleanCache"
        centered
        isOpened={opened}
        onClose={close}
        onReject={close}
        onConfirm={onConfirm}
        isLoading={pending}
        title={t("settings.softResetModal.title")}
        subTitle={t("common.areYouSure")}
        desc={t("settings.softResetModal.desc")}
      >
        <SyncSkipUnderPriority priority={999} />
      </ConfirmModal>

      <ResetFallbackModal isOpened={fallbackOpened} onClose={closeFallback} />
    </>
  );
}
