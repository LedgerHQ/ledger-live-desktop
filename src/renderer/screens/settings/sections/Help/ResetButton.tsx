import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import logger from "~/logger";
import { useHardReset } from "~/renderer/reset";
import ConfirmModal from "~/renderer/modals/ConfirmModal";
import ResetFallbackModal from "~/renderer/modals/ResetFallbackModal";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import Button from "~/renderer/components/Button";
import { useActionModal } from "./logic";
import { Box, Alert, BoxedIcon, Icons } from "@ledgerhq/react-ui";

export default function ResetButton() {
  const { t } = useTranslation();
  const hardReset = useHardReset();
  const [
    { opened, pending, fallbackOpened },
    { open, close, closeFallback, handleConfirm, handleError },
  ] = useActionModal();

  const onConfirm = useCallback(async () => {
    if (pending) return;
    try {
      handleConfirm();
      await hardReset();
      window.api.reloadRenderer();
    } catch (err) {
      logger.error(err);
      handleError();
    }
  }, [pending, handleConfirm, handleError, hardReset]);

  return (
    <>
      <Button variant="main" onClick={open} event="HardResetIntent" style={{ width: "120px" }}>
        {t("common.reset")}
      </Button>

      <ConfirmModal
        analyticsName="HardReset"
        isDanger
        centered
        isLoading={pending}
        isOpened={opened}
        onClose={close}
        onReject={close}
        onConfirm={onConfirm}
        confirmText={t("common.reset")}
        title={t("settings.hardResetModal.title")}
        desc={
          <Box>
            {t("settings.hardResetModal.desc")}
            <Alert type="warning" title={t("settings.hardResetModal.warning")} />
          </Box>
        }
        renderIcon={() => <BoxedIcon Icon={Icons.WarningMedium} />}
      >
        <SyncSkipUnderPriority priority={999} />
      </ConfirmModal>

      <ResetFallbackModal isOpened={fallbackOpened} onClose={closeFallback} />
    </>
  );
}
