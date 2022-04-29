// @flow
import React from "react";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
// import { useTranslation } from "react-i18next";

import SectionInformative from "~/renderer/screens/exchange/Swap2/Form/FormSummary/SectionInformative";
import { getProviderName } from "@ledgerhq/live-common/lib/exchange/swap/utils";

const FormErrorBanner = ({ provider, error }: { provider?: string, error: string }) => {
  // const { t } = useTranslation();

  if (!provider) return null;

  const openProviderSupport = () => openURL(urls.swap.providers[provider]?.support);

  // FIXME: need proper wording / transaltion

  const ctaLabel = `Contact ${getProviderName(provider)} support`;

  const message = `Error: ${error}`;

  return <SectionInformative message={message} ctaLabel={ctaLabel} onClick={openProviderSupport} />;
};

export default FormErrorBanner;
