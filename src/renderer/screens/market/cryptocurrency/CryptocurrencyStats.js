// @flow
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Box, { Card } from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import FormattedDate from "~/renderer/components/FormattedDate";
import type { MarketCurrencyInfo } from "~/renderer/reducers/market";
import { rgba } from "~/renderer/styles/helpers";
import CounterValueFormatter from "~/renderer/components/CounterValueFormatter";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useTranslation } from "react-i18next";

const Wrapper: ThemedComponent<{}> = styled(Box)`
  background-color: ${p => p.theme.colors.palette.background.paper};
  padding: 16px;
  border-radius: 4px;
  font-weight: 500;
`;

const CardStyled: ThemedComponent<{}> = styled(Card)`
  width: 100%;
  flex: 1;
  background: ${p => rgba(p.theme.colors.palette.background.default, 0.5)};
`;

const MarketCapRank: ThemedComponent<{}> = styled(Box)`
  background-color: ${p => p.theme.colors.palette.text.shade10};
  padding: 4px;
  border-radius: 4px;
`;

const Divider: ThemedComponent<{}> = styled(Box)`
  background: ${p => p.theme.colors.palette.divider};
  height: 1px;
`;

const InfoSection = ({
  title,
  children,
  style,
}: {
  title: string,
  children: React$Node,
  style?: any,
}) => {
  return (
    <Box style={style} mt={15} mb={15} horizontal alignItems="top" justifyContent="space-between">
      <Text fontSize={14} color="palette.text.shade60">
        {title}
      </Text>
      <Box justifyContent="flex-end">{children}</Box>
    </Box>
  );
};

function PriceStats({ currency }: { currency: MarketCurrencyInfo }) {
  const { counterCurrency } = useSelector(state => state.market);
  const { t } = useTranslation();

  return (
    <CardStyled style={{ height: "100%" }} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">
        {t("market.detailsPage.priceStatistics")}
      </Text>
      <Box grow vertical justifyContent="space-between">
        <InfoSection style={{ height: "56px" }} title={t("market.marketList.price")}>
          <Text color="palette.text.shade100" textAlign="right" ff="Inter|Medium" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.current_price} />
          </Text>
          <Text color="palette.text.shade100" textAlign="right" ff="Inter|Medium" fontSize={14}>
            <FormattedVal
              isPercent
              animateTicker
              isNegative
              val={Math.round(currency.price_change_percentage_in_currency)}
              inline
              withIcon
            />
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection title={t("market.detailsPage.tradingVolume")}>
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.total_volume} />
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection
          title={`${t("market.detailsPage.24hLow")} / ${t("market.detailsPage.24hHigh")}`}
        >
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <Box horizontal>
              <CounterValueFormatter currency={counterCurrency} value={currency.low_24h} />
              <Text ml={1} mr={1}>
                /
              </Text>
              <CounterValueFormatter currency={counterCurrency} value={currency.high_24h} />
            </Box>
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection
          title={`${t("market.detailsPage.7dLow")} / ${t("market.detailsPage.7dHigh")}`}
        >
          <Box horizontal>
            <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
              <Box horizontal>
                <CounterValueFormatter
                  currency={counterCurrency}
                  value={currency.sparkline_in_7d[0]}
                />
                <Text ml={1} mr={1}>
                  /
                </Text>
                <CounterValueFormatter
                  currency={counterCurrency}
                  value={currency.sparkline_in_7d[currency.sparkline_in_7d.length - 1]}
                />
              </Box>
            </Text>
          </Box>
        </InfoSection>
        <Divider />
        <InfoSection title={t("market.detailsPage.allTimeHigh")}>
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.ath} />
          </Text>
          <Text textAlign="right" color="palette.text.shade60" fontSize={14}>
            <FormattedDate date={currency.ath_date} format="LL" />
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection title={t("market.detailsPage.allTimeLow")}>
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.atl} />
          </Text>
          <Text textAlign="right" color="palette.text.shade60" fontSize={14}>
            <FormattedDate date={currency.atl_date} format="LL" />
          </Text>
        </InfoSection>
      </Box>
    </CardStyled>
  );
}

function MarketCap({ currency }: { currency: MarketCurrencyInfo }) {
  const { counterCurrency } = useSelector(state => state.market);
  const { t } = useTranslation();

  return (
    <CardStyled mb={2} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">
        {t("market.marketList.marketCap")}
      </Text>
      <Box>
        <InfoSection title={t("market.marketList.marketCap")}>
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.market_cap} />
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection title={t("market.detailsPage.marketCapRank")}>
          <MarketCapRank>
            <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
              #{currency.market_cap_rank}
            </Text>
          </MarketCapRank>
        </InfoSection>
      </Box>
    </CardStyled>
  );
}

function Supply({ currency }: { currency: MarketCurrencyInfo }) {
  const { counterCurrency } = useSelector(state => state.market);
  const { t } = useTranslation();

  return (
    <CardStyled mt={2} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">
        {t("market.detailsPage.supply")}
      </Text>
      <Box>
        <InfoSection title={t("market.detailsPage.circulatingSupply")}>
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.circulating_supply} />
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection title="Total supply">
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.total_supply} />
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection title="Max supply">
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.max_supply} />
          </Text>
        </InfoSection>
      </Box>
    </CardStyled>
  );
}

function CryptocurrencyStats({ currency }: { currency: MarketCurrencyInfo }) {
  console.log(currency);
  return (
    <Wrapper horizontal>
      <Box style={{ height: "100%" }} flex="50%" mr={2}>
        <PriceStats currency={currency} />
      </Box>
      <Box flex="50%" ml={2}>
        <MarketCap currency={currency} />
        <Supply currency={currency} />
      </Box>
    </Wrapper>
  );
}

export default CryptocurrencyStats;
