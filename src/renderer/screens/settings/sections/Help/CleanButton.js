// @flow

import React, { useReducer, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import logger from "~/logger";
import { softReset } from "~/renderer/reset";
import { cleanAccountsCache } from "~/renderer/actions/accounts";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import { useCountervaluesPolling } from "@ledgerhq/live-common/lib/countervalues/react";
import Button from "~/renderer/components/Button";
import ConfirmModal from "~/renderer/modals/ConfirmModal";
import ResetFallbackModal from "~/renderer/modals/ResetFallbackModal";

export default function CleanButton() {
  const { t } = useTranslation();
  const dispatchRedux = useDispatch();
  const { wipe } = useCountervaluesPolling();

  const [{ opened, isLoading, fallbackOpened }, dispatch] = useReducer(reducer, initialState);
  const open = useCallback(() => {
    dispatch({ type: "open" });
  }, [dispatch]);
  const close = useCallback(() => {
    dispatch({ type: "close" });
  }, [dispatch]);
  const closeFallback = useCallback(() => {
    dispatch({ type: "closeFallback" });
  }, [dispatch]);

  const onConfirm = useCallback(async () => {
    if (isLoading) return;
    try {
      dispatch({ type: "confirm" });
      await softReset({
        cleanAccountsCache: (...args) => {
          dispatchRedux(cleanAccountsCache(...args));
        },
      });
      wipe();
    } catch (err) {
      logger.error(err);
      dispatch({ type: "error" });
    }
  }, [isLoading, dispatch, dispatchRedux, wipe]);

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
        isLoading={isLoading}
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

const initialState = {
  opened: false,
  fallbackOpened: false,
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "open":
      return { ...state, opened: true };
    case "close":
      return { ...state, opened: false };
    case "closeFallback":
      return { ...state, fallbackOpened: false };
    case "confirm":
      return { ...state, isLoading: true };
    case "error":
      return { ...state, isLoading: false, fallbackOpened: true };
    default:
      return state;
  }
}
