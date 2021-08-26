// @flow
import React from "react";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import { useTranslation } from "react-i18next";
import IconLock from "~/renderer/icons/Lock";
import SummarySection from "./SummarySection";

const SectionRate = ({ value }: { value?: string }) => {
  const { t } = useTranslation();

  return (
    <SummarySection>
      <SummaryLabel
        label={t("swap2.form.details.label.rate")}
        details={t("swap2.form.details.tooltip.rate")}
      />
      <SummaryValue value={value} handleChange={() => {}}>
        <IconLock size={16} />
      </SummaryValue>
    </SummarySection>
  );
};

export default SectionRate;
