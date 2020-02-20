// @flow
import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { pairsSelector } from "~/renderer/countervalues";
import { selectedTimeRangeSelector, timeRangeDaysByKey } from "~/renderer/reducers/settings";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import Tooltip from "~/renderer/components/Tooltip";
import IconActivity from "~/renderer/icons/Activity";
import IconInfoCircle from "~/renderer/icons/InfoCircle";
import RateRow, { RateRowWrapper } from "./RateRow";
import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
} from "../../SettingsSection";

const Circle = styled.div`
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  border-radius: ${p => p.size}px;
  background-color: ${p => p.theme.colors[p.color]};
`;

const RateTooltipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > ${Circle} {
    margin-right: 4px;
  }
  > ${Circle}:not(:first-of-type) {
    margin-left: 16px;
  }
`;

const TooltipButtonWrapper = styled.div`
  color: ${p => p.theme.colors.palette.text.shade60};
  margin-left: 8px;
  display: flex;
  align-items: center;
`;

const RateTooltip = () => (
  <RateTooltipWrapper>
    <Circle size={8} color="wallet" />
    <Text>
      <Trans i18nKey="settings.rates.cryptoToFiat" />
    </Text>
    <Circle size={8} color="identity" />
    <Text>
      <Trans i18nKey="settings.rates.cryptoToCrypto" />
    </Text>
  </RateTooltipWrapper>
);

const Rates = () => {
  const { t } = useTranslation();
  const pairs = useSelector(pairsSelector);
  const timeRange = useSelector(selectedTimeRangeSelector);
  const days = timeRangeDaysByKey[timeRange];

  return (
    <Section>
      <Header
        icon={<IconActivity size={16} />}
        title={t("settings.tabs.rates")}
        desc={t("settings.rates.desc")}
      />
      <Body>
        <RateRowWrapper>
          <Box
            ff="Inter|SemiBold"
            alignItems="center"
            horizontal
            color="palette.text.shade100"
            fontSize={4}
          >
            <Trans i18nKey="settings.rates.rate" />
            <TooltipButtonWrapper>
              <Tooltip content={<RateTooltip />}>
                <IconInfoCircle size={12} />
              </Tooltip>
            </TooltipButtonWrapper>
          </Box>
          <Box ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
            <Trans i18nKey="settings.rates.price" />
          </Box>
          <Box ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
            <Trans i18nKey={`settings.rates.last`} values={{ days }} />
          </Box>
          <Box ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
            <Trans i18nKey="settings.rates.exchange" />
          </Box>
        </RateRowWrapper>
        {pairs.map(({ from, to, exchange }) => (
          <RateRow
            key={`${from.ticker}_${to.ticker}`}
            timeRange={timeRange}
            from={from}
            to={to}
            exchange={exchange}
          />
        ))}
      </Body>
    </Section>
  );
};

export default Rates;
