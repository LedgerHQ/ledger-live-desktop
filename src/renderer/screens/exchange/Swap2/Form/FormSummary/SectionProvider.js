// @flow
import React from "react";
import SummaryLabel from "./SummaryLabel";
import SummaryValue, { NoValuePlaceholder } from "./SummaryValue";
import SummarySection from "./SummarySection";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Text from "~/renderer/components/Text";
import { rgba } from "~/renderer/styles/helpers";
import CheckCircleIcon from "~/renderer/icons/CheckCircle";
import ClockIcon from "~/renderer/icons/Clock";
import ExclamationCircleIcon from "~/renderer/icons/ExclamationCircle";
import type { KYCStatus } from "@ledgerhq/live-common/lib/exchange/swap/utils";
import { iconByProviderName } from "../../utils";

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
};
type ProviderStatusTagProps = {
  status: $NonMaybeType<$PropertyType<SectionProviderProps, "status">>,
};

const StatusThemeMap = {
  pending: { color: "warning", Icon: ClockIcon },
  approved: { color: "marketUp_western", Icon: CheckCircleIcon },
  closed: { color: "alertRed", Icon: ExclamationCircleIcon },
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

const SectionProvider = ({ provider, status }: SectionProviderProps) => {
  const { t } = useTranslation();
  const ProviderIcon = provider && iconByProviderName[provider.toLowerCase()];

  return (
    <SummarySection>
      <SummaryLabel label={t("swap2.form.details.label.provider")} />
      {(provider && (
        <div style={{ display: "flex", columnGap: "6px", alignItems: "center" }}>
          <SummaryValue value={provider}>{ProviderIcon && <ProviderIcon size={19} />}</SummaryValue>
          {status ? <ProviderStatusTag status={status} /> : null}
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
