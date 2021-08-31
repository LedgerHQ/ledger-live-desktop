// @flow
import React from "react";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import SummarySection from "./SummarySection";
import { useTranslation } from "react-i18next";

const SectionFees = ({ value }: { value?: string }) => {
  const { t } = useTranslation();

  return (
    <SummarySection>
      <SummaryLabel
        label={t("swap2.form.details.label.fees")}
        details={t("swap2.form.details.tooltip.fees")}
      />
      <SummaryValue value={value} handleChange={() => {}} />
    </SummarySection>
  );
};

export default SectionFees;
