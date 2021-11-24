// @flow
import React from "react";
import { useTranslation } from "react-i18next";

import SectionInformative from "~/renderer/screens/exchange/Swap2/Form/FormSummary/SectionInformative";
import { KYC_STATUS } from "@ledgerhq/live-common/lib/exchange/swap/utils";
import type { KYCStatus } from "@ledgerhq/live-common/lib/exchange/swap/utils";

// FIXME: why is provider optional?
const FormKYCBanner = ({
  provider,
  status,
  onClick,
}: {
  provider?: string,
  status?: KYCStatus,
  onClick: Function,
}) => {
  const { t } = useTranslation();

  if (!provider || (status && status !== KYC_STATUS.rejected)) return null;

  const { message, cta } = status
    ? { message: "swap2.form.providers.kyc.rejected", cta: "swap2.form.providers.kyc.update" }
    : { message: "swap2.form.providers.kyc.required", cta: "swap2.form.providers.kyc.complete" };

  return <SectionInformative message={t(message)} ctaLabel={t(cta)} onClick={onClick} />;
};

export default FormKYCBanner;
