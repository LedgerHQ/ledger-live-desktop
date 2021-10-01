// @flow

import React from "react";
import Box, { Card } from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import styled from "styled-components";
import type { MarketCurrency } from "~/renderer/reducers/market";
import FormattedVal from "~/renderer/components/FormattedVal";
import { useSelector } from "react-redux";

const CardStyled = styled(Card)`
  width: 100%;
`;

const Divider = styled(Box)`
  background: ${p => p.theme.colors.palette.divider};
  height: 1px;
`;

const InfoSection = ({ title, children }) => {
  return (
    <Box mt={15} mb={15} horizontal alignItems="top" justifyContent="space-between">
      <Text fontSize={14} color="palette.text.shade60">
        {title}
      </Text>
      <Box justifyContent="flex-end">{children}</Box>
    </Box>
  );
};

function PriceStats({ currency }: { currency: MarketCurrency }) {
  const { counterValue } = useSelector(state => state.market);
  return (
    <CardStyled style={{ height: "100%" }} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">Price statistics</Text>
      <Box grow vertical justifyContent="space-between">
        <InfoSection title="Price">
          <Text textAlign="right" ff="Inter|Medium" fontSize={14}>
            <FormattedVal
              animateTicker
              isNegative
              color="palette.text.shade60"
              val={`${currency.price}`}
              showCode
              inline
              unit={counterValue.currency.units[0]}
            />
          </Text>
          <Text textAlign="right" ff="Inter|Medium" fontSize={14}>
            <FormattedVal
              isPercent
              animateTicker
              isNegative
              val={Math.round(currency.change)}
              inline
              withIcon
            />
          </Text>
        </InfoSection>
        <Divider />
        <InfoSection title="Trading volume (24h)">
        </InfoSection>
        <Divider />
        <InfoSection title="24h Low / 24h High"></InfoSection>
        <Divider />
        <InfoSection title="7d Low / 7d High"></InfoSection>
        <Divider />
        <InfoSection title="All time high"></InfoSection>
        <Divider />
        <InfoSection title="All time low"></InfoSection>
      </Box>
    </CardStyled>
  );
}

function MarketCap(props) {
  return (
    <CardStyled mb={2} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">
        Market cap
      </Text>
      <Box>
        <InfoSection title="Market cap"></InfoSection>
        <Divider />
        <InfoSection title="Market cap rank"></InfoSection>
        <Divider />
        <InfoSection title="Market cap dominance"></InfoSection>
      </Box>
    </CardStyled>
  );
}

function Supply(props) {
  return (
    <CardStyled mt={2} px={16} py={20}>
      <Text mb={20} fontSize={16} color="palette.text.shade100">
        Supply
      </Text>
      <Box>
        <InfoSection title="Circulating supply"></InfoSection>
        <Divider />
        <InfoSection title="Total supply"></InfoSection>
        <Divider />
        <InfoSection title="Max supply"></InfoSection>
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
        <MarketCap />
        <Supply />
      </Box>
    </Box>
  );
}

export default CryptocurrencyStats;
