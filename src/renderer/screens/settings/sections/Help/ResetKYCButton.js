// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";

export default function ResetKYCButton() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onResetKYC = useCallback(() => {
    dispatch(openModal("MODAL_SWAP_RESET_KYC"));
  }, [dispatch]);

  return (
    <Button small primary onClick={onResetKYC} event="KYCReset">
      {t("common.reset")}
    </Button>
  );
}
