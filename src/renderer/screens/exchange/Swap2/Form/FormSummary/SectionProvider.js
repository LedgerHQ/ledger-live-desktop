// @flow
import React from "react";
import { capitalize } from "lodash";
import { useSelector } from "react-redux";
import { rateSelector } from "~/renderer/actions/swap";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import SummarySection from "./SummarySection";
import { useTranslation } from "react-i18next";
import * as providerIcons from "~/renderer/icons/providers";
import Text from "~/renderer/components/Text";

const SectionProvider = ({ value }: { value?: string }) => {
  const { t } = useTranslation();
  const exchangeRate = useSelector(rateSelector);
  const ProviderIcon = exchangeRate && providerIcons[capitalize(exchangeRate.provider)];

  return (
    <SummarySection>
      <SummaryLabel
        label={t("swap2.form.details.label.provider")}
        details={t("swap2.form.details.tooltip.provider")}
      />
      {(exchangeRate && (
        <SummaryValue value={exchangeRate.provider}>
          <ProviderIcon size={20} />
        </SummaryValue>
      )) || <Text color="palette.text.shade100">{"-"}</Text>}
    </SummarySection>
  );
};

export default SectionProvider;
