// @flow

import React from "react";
import Box, { Card } from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import type { MarketCurrency } from "~/renderer/reducers/market";
import FormattedVal from "~/renderer/components/FormattedVal";
import { useSelector } from "react-redux";
import type { Children } from "react";

const CardStyled = styled(Card)`
  width: 100%;
`;

const Divider = styled(Box)`
  background: ${p => p.theme.colors.palette.divider};
  height: 1px;
`;

const InfoSection = ({
  title,
  children,
  style,
}: {
  title: string,
  children: Children,
  style: any,
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

function PriceStats({ currency }: { currency: MarketCurrency }) {
  const { counterCurrency } = useSelector(state => state.market);

  return (
    <CardStyled style={{ height: "100%" }} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">
        Price statistics
      </Text>
      <Box grow vertical justifyContent="space-between">
        <InfoSection style={{ height: "56px" }} title="Price">
          <Text textAlign="right" ff="Inter|Medium" fontSize={14}>
            {`${currency.current_price} ${counterCurrency}`}
          </Text>
          <Text textAlign="right" ff="Inter|Medium" fontSize={14}>
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
        <InfoSection title="Trading volume (24h)"></InfoSection>
        <Divider />
        <InfoSection title="24h Low / 24h High">{`${currency.low_24h}/${currency.high_24h}`}</InfoSection>
        <Divider />
        <InfoSection title="7d Low / 7d High">
          <Box horizontal>
            {`${currency.sparkline_in_7d[0].toFixed(2)} ${counterCurrency}`}
            <div>/</div>
            {`${currency.sparkline_in_7d[currency.sparkline_in_7d.length - 1].toFixed(2)} ${counterCurrency}`}
          </Box>
        </InfoSection>
        <Divider />
        <InfoSection title="All time high">{currency.ath}</InfoSection>
        <Divider />
        <InfoSection title="All time low">{currency.atl}</InfoSection>
      </Box>
    </CardStyled>
  );
}

function MarketCap({ currency }: { currency: MarketCurrency }) {
  return (
    <CardStyled mb={2} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">
        Market cap
      </Text>
      <Box>
        <InfoSection title="Market cap">{currency.market_cap}</InfoSection>
        <Divider />
        <InfoSection title="Market cap rank">{currency.market_cap_rank}</InfoSection>
        <Divider />
        <InfoSection title="Market cap dominance"></InfoSection>
      </Box>
    </CardStyled>
  );
}

function Supply({ currency }: { currency: MarketCurrency }) {
  return (
    <CardStyled mt={2} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">
        Supply
      </Text>
      <Box>
        <InfoSection title="Circulating supply">{currency.circulating_supply}</InfoSection>
        <Divider />
        <InfoSection title="Total supply">{currency.total_supply}</InfoSection>
        <Divider />
        <InfoSection title="Max supply">{currency.max_supply}</InfoSection>
      </Box>
    </CardStyled>
  );
}

function CryptocurrencyStats({ currency }: { currency: MarketCurrency }) {
  return (
    <Box grow horizontal>
      <Box style={{ height: "100%" }} flex="50%" mr={2}>
        <PriceStats currency={currency} />
      </Box>
      <Box flex="50%" ml={2}>
        <MarketCap currency={currency} />
        <Supply currency={currency} />
      </Box>
    </Box>
  );
}

export default CryptocurrencyStats;
