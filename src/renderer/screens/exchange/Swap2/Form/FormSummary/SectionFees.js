// @flow
import React from "react";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import SummarySection from "./SummarySection";
import { useTranslation } from "react-i18next";

const SectionFees = () => {
  const { t } = useTranslation();

  return (
    <SummarySection>
      <SummaryLabel
        label={t("swap2.form.details.label.fees")}
        details={t("swap2.form.details.tooltip.fees")}
      />
      <SummaryValue value="0.000034 ETH" handleChange={() => {}} />
    </SummarySection>
  );
};

export default SectionFees;
