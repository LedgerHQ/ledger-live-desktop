// @flow
import React from "react";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import SummarySection from "./SummarySection";
import { useTranslation } from "react-i18next";
import ChangellyIcon from "~/renderer/icons/providers/Changelly";
import WyreIcon from "~/renderer/icons/providers/Wyre";

const providerIcons = { changelly: ChangellyIcon, wyre: WyreIcon };

export const getProviderIcon = (providerName?: string) => {
  if (!providerName) return null;

  const Icon = providerIcons[providerName.toLowerCase()];

  /* eslint-disable react/display-name */
  if (Icon) return <Icon size={20} />;
  return null;
};

const SectionProvider = () => {
  const { t } = useTranslation();

  return (
    <SummarySection>
      <SummaryLabel
        label={t("swap2.form.details.label.provider")}
        details={t("swap2.form.details.tooltip.provider")}
      />
      <SummaryValue value="changelly">{getProviderIcon("changelly")}</SummaryValue>
    </SummarySection>
  );
};

export default SectionProvider;
