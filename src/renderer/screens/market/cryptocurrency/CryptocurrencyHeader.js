// @flow
import React from "react";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import CryptocurrencyStar from "~/renderer/components/MarketList/CryptocurrencyStar";
import type { MarketCurrencyInfo } from "~/renderer/reducers/market";

const CryptoCurrencyIconWrapper = styled.div`
  height: 56px;
  width: 56px;
  position: relative;

  img {
    height: 100%;
  }
`;

type CryptocurrencyHeaderType = { currency: MarketCurrencyInfo };

const Title = styled(Text)`
  color: ${p => p.theme.colors.palette.text.shade100};
  font-size: 28px;
  text-transform: uppercase;
`;

function CryptocurrencyHeader({ currency }: CryptocurrencyHeaderType) {
  return (
    <Box py={2}>
      <Box horizontal>
        <Box horizontal pr={3}>
          <CryptoCurrencyIconWrapper>
            <img src={currency.image} alt={"Currency logo"} />
          </CryptoCurrencyIconWrapper>
        </Box>
        <Box px={16}>
          <Box horizontal alignItems="center">
            <Title>{currency.name}</Title>
            {/*<Box px={2}>*/}
            {/*  <CryptocurrencyStar currency={currency} />*/}
            {/*</Box>*/}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CryptocurrencyHeader;
