// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setSwapKYCStatus } from "~/renderer/actions/settings";
import Button from "~/renderer/components/Button";

export default function ResetKYCButton() {
  // NB specific to wyre, should be on a per-provider basis on SWP-Form
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onResetKYC = useCallback(() => {
    dispatch(setSwapKYCStatus({ provider: "wyre" }));
  }, [dispatch]);

  return (
    <Button small primary onClick={onResetKYC} event="KYCReset">
      {t("common.reset")}
    </Button>
  );
}
