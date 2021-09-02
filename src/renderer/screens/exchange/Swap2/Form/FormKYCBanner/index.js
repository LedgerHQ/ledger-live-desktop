// @flow
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import SectionInformative from "~/renderer/screens/exchange/Swap2/Form/FormSummary/SectionInformative";
import { setSwapKYCStatus } from "~/renderer/actions/settings";

const FormKYCBanner = ({
  provider,
  status,
}: {
  provider?: string,
  status?: "pending" | "rejected" | "approved",
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    if (provider && status === "rejected") {
      dispatch(setSwapKYCStatus({ provider }));
    }
    history.push({ pathname: "/swap/kyc" });
  }, [dispatch, history, status, provider]);

  if (!provider || (status && status !== "rejected")) return null;

  const { message, cta } = status
    ? { message: "swap2.form.providers.kyc.rejected", cta: "swap2.form.providers.kyc.update" }
    : { message: "swap2.form.providers.kyc.required", cta: "swap2.form.providers.kyc.complete" };

  return <SectionInformative message={t(message)} ctaLabel={t(cta)} onClick={handleClick} />;
};

export default FormKYCBanner;
