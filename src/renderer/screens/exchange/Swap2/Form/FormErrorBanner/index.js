// @flow
import React from "react";
// import { useTranslation } from "react-i18next";

import SectionInformative from "~/renderer/screens/exchange/Swap2/Form/FormSummary/SectionInformative";

const FormErrorBanner = ({ provider, error }: { provider?: string, error: string }) => {
  // const { t } = useTranslation();

  if (!provider) return null;

  // FIXME: get link to provider website

  const onClick = () => {};

  const ctaLabel = "Go to partner website";

  return <SectionInformative message={error} ctaLabel={ctaLabel} onClick={onClick} />;
};

export default FormErrorBanner;
