// @flow
import React, { useContext } from "react";
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
import LoadingPlaceholder from "~/renderer/components/LoadingPlaceholder";
import { MarketContext } from "~/renderer/contexts/MarketContext";

const Wrapper: ThemedComponent<{}> = styled(Card)`
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
  loading,
}: {
  title: string,
  children: React$Node,
  style?: any,
  loading: boolean,
}) => {
  const placeholderWidthOptions = ["102", "136", "132", "159", "161"];
  const placeholderWidth =
    placeholderWidthOptions[Math.floor(Math.random() * placeholderWidthOptions.length)];
  return (
    <Box style={style} mt={15} mb={15} horizontal alignItems="top" justifyContent="space-between">
      <Text fontSize={14} color="palette.text.shade60">
        {loading ? (
          <LoadingPlaceholder style={{ height: "14px", width: `${placeholderWidth}px` }} />
        ) : (
          title
        )}
      </Text>
      <Box>
        {loading ? (
          <LoadingPlaceholder style={{ height: "14px", width: `${placeholderWidth}px` }} />
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};

function PriceStats({ currency, loading }: { currency: MarketCurrencyInfo, loading: boolean }) {
  const { contextState } = useContext(MarketContext);
  const { counterCurrency } = contextState;
  const { t } = useTranslation();

  return (
    <CardStyled style={{ height: "100%" }} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">
        {loading ? (
          <LoadingPlaceholder style={{ height: "24px", width: "115px" }} />
        ) : (
          t("market.detailsPage.priceStatistics")
        )}
      </Text>
      <Box grow vertical justifyContent="space-between">
        <InfoSection
          loading={loading}
          style={{ height: "56px" }}
          title={t("market.marketList.price")}
        >
          <Text color="palette.text.shade100" textAlign="right" ff="Inter|Medium" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.current_price} />
          </Text>
          <Text color="palette.text.shade100" textAlign="right" ff="Inter|Medium" fontSize={14}>
            {currency.price_change_percentage_in_currency ? (
              <FormattedVal
                isPercent
                isNegative
                val={Math.round(currency.price_change_percentage_in_currency)}
                inline
                withIcon
              />
            ) : (
              "-"
            )}
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection loading={loading} title={t("market.detailsPage.tradingVolume")}>
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.total_volume} />
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection
          loading={loading}
          title={`${t("market.detailsPage.24hLow")} / ${t("market.detailsPage.24hHigh")}`}
        >
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <Box horizontal>
              {currency.low_24h ? (
                <CounterValueFormatter currency={counterCurrency} value={currency.low_24h} />
              ) : (
                "-"
              )}
              <Text ml={1} mr={1}>
                /
              </Text>
              {currency.high_24h ? (
                <CounterValueFormatter currency={counterCurrency} value={currency.high_24h} />
              ) : (
                "-"
              )}
            </Box>
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection
          loading={loading}
          title={`${t("market.detailsPage.7dLow")} / ${t("market.detailsPage.7dHigh")}`}
        >
          <Box horizontal>
            <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
              <Box horizontal>
                {loading ? (
                  <LoadingPlaceholder />
                ) : currency.sparkline_in_7d[0] ? (
                  <CounterValueFormatter
                    currency={counterCurrency}
                    value={currency.sparkline_in_7d[0]}
                  />
                ) : (
                  "-"
                )}
                {loading ? (
                  <LoadingPlaceholder />
                ) : (
                  <>
                    <Text ml={1} mr={1}>
                      /
                    </Text>
                    {currency.sparkline_in_7d[currency.sparkline_in_7d.length - 1] ? (
                      <CounterValueFormatter
                        currency={counterCurrency}
                        value={currency.sparkline_in_7d[currency.sparkline_in_7d.length - 1]}
                      />
                    ) : (
                      "-"
                    )}
                  </>
                )}
              </Box>
            </Text>
          </Box>
        </InfoSection>
        <Divider />
        <InfoSection loading={loading} title={t("market.detailsPage.allTimeHigh")}>
          {currency.ath ? (
            <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
              <CounterValueFormatter currency={counterCurrency} value={currency.ath} />
            </Text>
          ) : (
            "-"
          )}
          {currency.ath_date ? (
            <Text textAlign="right" color="palette.text.shade60" fontSize={14}>
              <FormattedDate date={currency.ath_date} format="LL" />
            </Text>
          ) : (
            "-"
          )}
        </InfoSection>
        <Divider />
        <InfoSection loading={loading} title={t("market.detailsPage.allTimeLow")}>
          {currency.atl ? (
            <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
              <CounterValueFormatter currency={counterCurrency} value={currency.atl} />
            </Text>
          ) : (
            "-"
          )}
          {currency.atl_date ? (
            <Text textAlign="right" color="palette.text.shade60" fontSize={14}>
              <FormattedDate date={currency.atl_date} format="LL" />
            </Text>
          ) : (
            "-"
          )}
        </InfoSection>
      </Box>
    </CardStyled>
  );
}

function MarketCap({ currency, loading }: { currency: MarketCurrencyInfo, loading: boolean }) {
  const { contextState } = useContext(MarketContext);
  const { counterCurrency } = contextState;
  const { t } = useTranslation();

  return (
    <CardStyled mb={2} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">
        {loading ? (
          <LoadingPlaceholder style={{ height: "24px", width: "115px" }} />
        ) : (
          t("market.marketList.marketCap")
        )}
      </Text>
      <Box>
        <InfoSection loading={loading} title={t("market.marketList.marketCap")}>
          {currency.market_cap ? (
            <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
              <CounterValueFormatter currency={counterCurrency} value={currency.market_cap} />
            </Text>
          ) : (
            "-"
          )}
        </InfoSection>
        <Divider />
        <InfoSection loading={loading} title={t("market.detailsPage.marketCapRank")}>
          <MarketCapRank>
            <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
              {currency.market_cap_rank ? `#${currency.market_cap_rank}` : "-"}
            </Text>
          </MarketCapRank>
        </InfoSection>
      </Box>
    </CardStyled>
  );
}

function Supply({ currency, loading }: { currency: MarketCurrencyInfo, loading: boolean }) {
  const { contextState } = useContext(MarketContext);
  const { counterCurrency } = contextState;
  const { t } = useTranslation();

  return (
    <CardStyled mt={2} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">
        {loading ? (
          <LoadingPlaceholder style={{ height: "24px", width: "115px" }} />
        ) : (
          t("market.detailsPage.supply")
        )}
      </Text>
      <Box>
        <InfoSection loading={loading} title={t("market.detailsPage.circulatingSupply")}>
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.circulating_supply} />
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection loading={loading} title="Total supply">
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.total_supply} />
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection loading={loading} title="Max supply">
          <Text textAlign="right" color="palette.text.shade100" fontSize={14}>
            <CounterValueFormatter currency={counterCurrency} value={currency.max_supply} />
          </Text>
        </InfoSection>
      </Box>
    </CardStyled>
  );
}

function CryptocurrencyStats({
  currency,
  loading,
}: {
  currency: MarketCurrencyInfo,
  loading: boolean,
}) {
  return (
    <Wrapper horizontal>
      <Box style={{ height: "100%" }} flex="50%" mr={2}>
        <PriceStats loading={loading} currency={currency} />
      </Box>
      <Box flex="50%" ml={2}>
        <MarketCap loading={loading} currency={currency} />
        <Supply loading={loading} currency={currency} />
      </Box>
    </Wrapper>
  );
}

export default CryptocurrencyStats;
