// @flow
import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import SectionInformative from "~/renderer/screens/exchange/Swap2/Form/FormSummary/SectionInformative";

const FormKYCBanner = ({ status }: { status?: "pending" | "rejected" }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const { message, cta } = status
    ? { message: "swap2.form.providers.kyc.pending", cta: "swap2.form.providers.kyc.update" }
    : { message: "swap2.form.providers.kyc.required", cta: "swap2.form.providers.kyc.complete" };

  const handleClick = (): void => history.push({ pathname: "/swap/kyc" });

  return <SectionInformative message={t(message)} ctaLabel={t(cta)} onClick={handleClick} />;
};

export default FormKYCBanner;
