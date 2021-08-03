// @flow
import React from "react";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import SummarySection from "./SummarySection";
import { useTranslation } from "react-i18next";
import IconChangelly from "~/renderer/icons/providers/Changelly";

// TODO: Think about a fallback provider icon
export const getProviderIcon = (providerName?: string) => {
  if (!providerName) return null;

  const providerIcons = { changelly: IconChangelly };
  const Icon = providerIcons[providerName.toLowerCase()];
  /* eslint-disable react/display-name */
  return <Icon size={20} />;
};

const SectionProvider = () => {
  const { t } = useTranslation();

  return (
    <SummarySection>
      <SummaryLabel
        label={t("swap2.form.details.label.provider")}
        details={t("swap2.form.details.tooltip.provider")}
      />
      {/* TODO: Remove me as soon as the data is connected */}
      <SummaryValue handleChange={() => {}}>{getProviderIcon("changelly")}</SummaryValue>
    </SummarySection>
  );
};

export default SectionProvider;
