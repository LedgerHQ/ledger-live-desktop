// @flow
import React from "react";
import { useTranslation } from "react-i18next";

import SectionInformative from "~/renderer/screens/exchange/Swap2/Form/FormSummary/SectionInformative";

const FormLoginBanner = ({ provider, onClick }: { provider?: string, onClick: Function }) => {
  const { t } = useTranslation();

  if (!provider) return null;

  const { message, cta } = {
    message: "swap2.form.providers.login.required",
    cta: "swap2.form.providers.login.complete",
  };

  return <SectionInformative message={t(message)} ctaLabel={t(cta)} onClick={onClick} />;
};

export default FormLoginBanner;
