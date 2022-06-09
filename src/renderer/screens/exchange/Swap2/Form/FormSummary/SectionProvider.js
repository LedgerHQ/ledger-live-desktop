// @flow
import type { KYCStatus } from "@ledgerhq/live-common/lib/exchange/swap/utils";
import { getProviderName } from "@ledgerhq/live-common/lib/exchange/swap/utils";
import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import { context } from "~/renderer/drawers/Provider";
import CheckCircleIcon from "~/renderer/icons/CheckCircle";
import ClockIcon from "~/renderer/icons/Clock";
import ExclamationCircleIcon from "~/renderer/icons/ExclamationCircle";
import { rgba } from "~/renderer/styles/helpers";
import { iconByProviderName } from "../../utils";
import RatesDrawer from "../RatesDrawer";
import SummaryLabel from "./SummaryLabel";
import SummarySection from "./SummarySection";
import SummaryValue, { NoValuePlaceholder } from "./SummaryValue";

const StatusTag = styled.div`
  display: flex;
  padding: 4px 6px;
  border-radius: 4px;
  background: ${props => rgba(props.theme.colors[props.color], 0.1)};
  color: ${props => props.theme.colors[props.color]};
  align-items: center;
  column-gap: 4px;
`;

export type SectionProviderProps = {
  provider?: string,
  status?: KYCStatus,
  ratesState: RatesReducerState,
  fromCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  toCurrency: $PropertyType<SwapSelectorStateType, "currency">,
};
type ProviderStatusTagProps = {
  status: $NonMaybeType<$PropertyType<SectionProviderProps, "status">>,
};

const StatusThemeMap = {
  pending: { color: "warning", Icon: ClockIcon },
  approved: { color: "marketUp_western", Icon: CheckCircleIcon },
  closed: { color: "alertRed", Icon: ExclamationCircleIcon },
  upgradeRequierd: { color: "warning", Icon: ClockIcon },
};

const ProviderStatusTag = ({ status }: ProviderStatusTagProps) => {
  const { t } = useTranslation();
  const { color, Icon } = StatusThemeMap[status] || { color: null, icon: null };

  return (
    <StatusTag color={color}>
      <Text ff="Inter|SemiBold" fontSize="9px" lineHeight="1.4">
        {t(`swap2.form.providers.kyc.status.${status}`)}
      </Text>
      <Icon size={12} />
    </StatusTag>
  );
};

const SectionProvider = ({
  provider,
  status,
  fromCurrency,
  toCurrency,
  ratesState,
}: SectionProviderProps) => {
  const { t } = useTranslation();
  const ProviderIcon = provider && iconByProviderName[provider.toLowerCase()];

  const { setDrawer } = useContext(context);
  const rates = ratesState.value;
  const handleChange = useMemo(
    () =>
      rates &&
      rates.length > 1 &&
      (() =>
        setDrawer(RatesDrawer, {
          fromCurrency,
          toCurrency,
          rates,
          provider,
        })),
    [setDrawer, rates, fromCurrency, toCurrency, provider],
  );

  return (
    <SummarySection>
      <SummaryLabel label={t("swap2.form.details.label.provider")} />
      {(provider && (
        <div style={{ display: "flex", columnGap: "6px", alignItems: "center" }}>
          <SummaryValue value={getProviderName(provider)} handleChange={handleChange}>
            {status ? <ProviderStatusTag status={status} /> : null}
            {ProviderIcon && <ProviderIcon size={19} />}
          </SummaryValue>
        </div>
      )) || (
        <SummaryValue>
          <NoValuePlaceholder />
        </SummaryValue>
      )}
    </SummarySection>
  );
};

export default React.memo<SectionProviderProps>(SectionProvider);
