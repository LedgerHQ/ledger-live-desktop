// @flow
import React from "react";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import SummarySection from "./SummarySection";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ChangellyIcon from "~/renderer/icons/providers/Changelly";
import WyreIcon from "~/renderer/icons/providers/Wyre";
import Text from "~/renderer/components/Text";
import { rgba } from "~/renderer/styles/helpers";
import CheckCircleIcon from "~/renderer/icons/CheckCircle";
import ClockIcon from "~/renderer/icons/Clock";
import ExclamationCircleIcon from "~/renderer/icons/ExclamationCircle";

const providerIcons = { changelly: ChangellyIcon, wyre: WyreIcon };

export const getProviderIcon = (providerName?: string) => {
  if (!providerName) return null;

  const Icon = providerIcons[providerName.toLowerCase()];

  /* eslint-disable react/display-name */
  if (Icon) return <Icon size={20} />;
  return null;
};

const StatusTag = styled.div`
  display: flex;
  padding: 4px 6px;
  border-radius: 4px;
  background: ${props => rgba(props.theme.colors[props.color], 0.1)};
  color: ${props => props.theme.colors[props.color]};
  align-items: center;
  column-gap: 4px;
`;

type SectionProviderProps = { value?: string, status?: "approved" | "pending" | "rejected" };
type ProviderStatusTagProps = {
  status: $NonMaybeType<$PropertyType<SectionProviderProps, "status">>,
};

const StatusThemeMap = {
  pending: { color: "warning", Icon: ClockIcon },
  approved: { color: "marketUp_western", Icon: CheckCircleIcon },
  rejected: { color: "alertRed", Icon: ExclamationCircleIcon },
};

const ProviderStatusTag = ({ status }: ProviderStatusTagProps) => {
  const { t } = useTranslation();
  const { color, Icon } = StatusThemeMap[status];

  return (
    <StatusTag color={color}>
      <Text ff="Inter|SemiBold" fontSize="9px" lineHeight="1.4">
        {t(`swap2.form.providers.kyc.status.${status}`)}
      </Text>
      <Icon size={12} />
    </StatusTag>
  );
};

const SectionProvider = ({ value, status }: SectionProviderProps) => {
  const { t } = useTranslation();

  return (
    <SummarySection>
      <SummaryLabel
        label={t("swap2.form.details.label.provider")}
        details={t("swap2.form.details.tooltip.provider")}
      />
      <div style={{ display: "flex", columnGap: "6px", alignItems: "center" }}>
        <SummaryValue value={value}>{getProviderIcon(value)}</SummaryValue>
        {status ? <ProviderStatusTag status={status} /> : null}
      </div>
    </SummarySection>
  );
};

export default SectionProvider;
